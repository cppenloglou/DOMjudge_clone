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

@app.get("/health")
def health_check():
    """Health check endpoint for Docker health checks and monitoring"""
    try:
        # Check if problems directory exists and is accessible
        if not os.path.exists(PROBLEMS_DIR):
            return {"status": "unhealthy", "error": "Problems directory not found"}
        
        # Check if we can list the directory
        os.listdir(PROBLEMS_DIR)
        
        # Check if g++ compiler is available
        gpp_result = subprocess.run(
            ["g++", "--version"],
            capture_output=True,
            text=True,
            timeout=2
        )
        if gpp_result.returncode != 0:
            return {"status": "unhealthy", "error": "g++ compiler not available"}
        
        # Test compilation with a simple C++ program
        test_cpp = """
#include <iostream>
int main() {
    std::cout << "test" << std::endl;
    return 0;
}
"""
        test_file = "/tmp/health_test.cpp"
        test_executable = "/tmp/health_test"
        
        try:
            # Write test file
            with open(test_file, "w") as f:
                f.write(test_cpp)
            
            # Try to compile
            compile_result = subprocess.run(
                ["g++", test_file, "-o", test_executable],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if compile_result.returncode != 0:
                return {"status": "unhealthy", "error": "g++ compilation test failed"}
            
            # Try to execute
            exec_result = subprocess.run(
                [test_executable],
                capture_output=True,
                text=True,
                timeout=2
            )
            
            if exec_result.returncode != 0 or exec_result.stdout.strip() != "test":
                return {"status": "unhealthy", "error": "g++ execution test failed"}
                
        finally:
            # Cleanup test files
            for file_path in [test_file, test_executable]:
                if os.path.exists(file_path):
                    os.remove(file_path)
        
        # Extract g++ version
        gcc_version = gpp_result.stdout.split('\n')[0] if gpp_result.stdout else "Unknown"
        
        return {
            "status": "healthy",
            "service": "cpp_executor",
            "problems_dir": PROBLEMS_DIR,
            "compiler_version": gcc_version.strip(),
            "temp_dir_writable": os.access("/tmp", os.W_OK)
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/execute")
def run_cpp_script(
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
        executable_path = f"/tmp/a.out"
        with open(temp_file_path, "wb") as f:
            f.write(file.file.read())

        total_execution_time = 0  # Track total execution time
        num_testcases = len(problem["testcases"])  # Number of test cases

        try:
            compile_result = subprocess.run(
                ["g++", temp_file_path, "-o", executable_path],
                capture_output=True, text=True, timeout=10
            )

            if compile_result.returncode != 0:
                os.remove(temp_file_path)
                return create_standard_response(
                    problemID=problemID,
                    status="ERROR",
                    message="Compilation failed.",
                    stdout=compile_result.stdout,
                    stderr=compile_result.stderr,
                    returncode=compile_result.returncode
                )
            
            for idx, testcase in enumerate(problem["testcases"]):
                input_data = testcase["input"]
                expected_output = testcase["output"]
                start_time = time.time()  # Start time for the test case


                run_result = subprocess.run(
                    [executable_path],
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
                    if os.path.exists(temp_file_path):
                        os.remove(temp_file_path)
                    
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
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)