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

def create_standard_response(problemID, status, message, testcase_index=0, expected_output="", actual_output="", stdout="", stderr="", returncode=1, avg_execution_time=0):
    response = {
        "problemID": int(problemID),
        "status": status,
        "details": {
            "message": message,
            "testcaseIndex": testcase_index,
            "expectedOutput": expected_output,
            "actualOutput": actual_output
        },
        "stdout": stdout,
        "stderr": stderr,
        "returncode": returncode,
        "avgTime": float(avg_execution_time)
    }
    print("Response:", response)
    return response

@app.get("/health")
def health_check():
    """Health check endpoint for Docker health checks and monitoring"""
    try:
        # Check if problems directory exists and is accessible
        if not os.path.exists(PROBLEMS_DIR):
            return {"status": "unhealthy", "error": "Problems directory not found"}
        
        # Check if we can list the directory
        os.listdir(PROBLEMS_DIR)
        
        # Check if Python interpreter is available
        result = subprocess.run(
            ["python3", "--version"],
            capture_output=True,
            text=True,
            timeout=1
        )
        if result.returncode != 0:
            return {"status": "unhealthy", "error": "Python interpreter not available"}
        
        return {
            "status": "healthy",
            "service": "python_executor",
            "problems_dir": PROBLEMS_DIR,
            "python_version": result.stdout.strip()
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/execute")
def run_python_script(
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

        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(file.file.read())

        total_execution_time = 0  # To track total execution time
        num_testcases = len(problem["testcases"])  # To count number of testcases

        try:
            for idx, testcase in enumerate(problem["testcases"]):
                input_data = testcase["input"]
                expected_output = testcase["output"]

                start_time = time.time()  # Start time for the test case

                result = subprocess.run(
                    ["python3", temp_file_path],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=2
                )

                end_time = time.time()  # End time for the test case
                execution_time = end_time - start_time  # Calculate execution time for this test case
                total_execution_time += execution_time  # Add to total execution time

                actual_output = result.stdout.strip()
                expected_output = expected_output.strip()

                if actual_output != expected_output:
                    return create_standard_response(
                        problemID=problemID,
                        status="FAILED",
                        message="Test case failed.",
                        testcase_index=idx,
                        expected_output=expected_output,
                        actual_output=actual_output,
                        stdout=result.stdout,
                        stderr=result.stderr,
                        returncode=result.returncode
                    )

            avg_execution_time = total_execution_time / num_testcases if num_testcases > 0 else 0

            return create_standard_response(
                problemID=problemID,
                status="PASSED",
                message="All test cases passed.",
                stdout=result.stdout,
                stderr=result.stderr,
                returncode=result.returncode,
                avg_execution_time=avg_execution_time  # Return the average execution time
            )

        except subprocess.TimeoutExpired as e:
            return create_standard_response(
                problemID=problemID,
                status="ERROR",
                message="Script execution timed out.",
                stdout=e.stdout if hasattr(e, "stdout") and e.stdout else "",
                stderr=e.stderr if hasattr(e, "stderr") and e.stderr else "",
                returncode=124  # 124 is typical Linux timeout exit code
            )
        except Exception as e:
            return create_standard_response(
                problemID=problemID,
                status="ERROR",
                message=str(e),
                stdout="",
                stderr="",
                returncode=1
            )
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)