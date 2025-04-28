from fastapi import FastAPI, File, UploadFile, Form
import subprocess
import os
import json
import time
from threading import Lock

app = FastAPI()

execution_lock = Lock()
PROBLEMS_DIR = "./problems"

def load_problem(problemID: str):
    problem_path = os.path.join(PROBLEMS_DIR, f"problem{problemID}.json")
    if not os.path.exists(problem_path):
        return None
    with open(problem_path, "r") as f:
        return json.load(f)

def create_standard_response(problemID, status, message, testcase_index=None, expected_output="", actual_output="", stdout="", stderr="", returncode=0, avg_execution_time=0):
    response = {
        "problemID": problemID,
        "status": status,
        "details": {
            "message": message,
            "testcase_index": testcase_index,
            "expected_output": expected_output,
            "actual_output": actual_output
        },
        "stdout": stdout,
        "stderr": stderr,
        "returncode": returncode,
        "avgTime": float(avg_execution_time)  # Include the average execution time
    }

    print("Response:", response)
    return response


@app.post("/execute")
def run_java_script(
    problemID: str = Form(...),
    file: UploadFile = File(...)
):
    with execution_lock:
        problem = load_problem(problemID)
        if problem is None:
            return create_standard_response(
                problemID=problemID,
                status="ERROR",
                message=f"Problem with ID '{problemID}' not found."
            )

        temp_java_path = f"/tmp/{file.filename.rsplit('_', 1)[-1]}"
        classname = os.path.splitext(file.filename.rsplit('_', 1)[-1])[0]  # remove .java extension
        temp_class_path = f"/tmp/{classname}.class"

        with open(temp_java_path, "wb") as f:
            f.write(file.file.read())

        total_execution_time = 0  # Track total execution time
        num_testcases = len(problem["testcases"])  # Number of test cases

        try:
            # Compile Java
            compile_result = subprocess.run(
                ["javac", temp_java_path],
                capture_output=True,
                text=True,
                timeout=10
            )

            if compile_result.returncode != 0:
                if os.path.exists(temp_java_path):
                    os.remove(temp_java_path)
                return create_standard_response(
                    problemID=problemID,
                    status="ERROR",
                    message="Compilation failed.",
                    stdout=compile_result.stdout,
                    stderr=compile_result.stderr,
                    returncode=compile_result.returncode
                )

            # Execute Java Program for each testcase
            for idx, testcase in enumerate(problem["testcases"]):
                input_data = testcase["input"]
                expected_output = testcase["output"]

                start_time = time.time()  # Start time for the test case

                run_result = subprocess.run(
                    ["java", "-cp", "/tmp", classname],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=10
                )

                end_time = time.time()  # End time for the test case
                execution_time = end_time - start_time  # Calculate execution time for this test case
                total_execution_time += execution_time  # Add to total execution time

                actual_output = run_result.stdout.strip()
                expected_output = expected_output.strip()

                if actual_output != expected_output:
                    if os.path.exists(temp_java_path):
                        os.remove(temp_java_path)
                    if os.path.exists(temp_class_path):
                        os.remove(temp_class_path)
                    return create_standard_response(
                        problemID=problemID,
                        status="FAILED",
                        message="Test case failed.",
                        testcase_index=idx,
                        expected_output=expected_output,
                        actual_output=actual_output,
                        stdout=run_result.stdout,
                        stderr=run_result.stderr,
                        returncode=run_result.returncode
                    )

            # Calculate average execution time
            avg_execution_time = total_execution_time / num_testcases if num_testcases > 0 else 0

            # All testcases passed
            return create_standard_response(
                problemID=problemID,
                status="PASSED",
                message="All test cases passed.",
                stdout=run_result.stdout,
                stderr=run_result.stderr,
                returncode=run_result.returncode,
                avg_execution_time=avg_execution_time  # Return the average execution time
            )

        except subprocess.TimeoutExpired:
            return create_standard_response(
                problemID=problemID,
                status="ERROR",
                message="Script execution timed out."
            )
        except Exception as e:
            return create_standard_response(
                problemID=problemID,
                status="ERROR",
                message=str(e)
            )
        finally:
            # Always cleanup
            if os.path.exists(temp_java_path):
                os.remove(temp_java_path)
            if os.path.exists(temp_class_path):
                os.remove(temp_class_path)