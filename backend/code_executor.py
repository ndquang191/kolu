import sys
import json
import io
from contextlib import redirect_stdout, redirect_stderr

def execute_code(code, input_data):
    globals_dict = {}
    locals_dict = {}
    
    # Redirect stdout and stderr
    stdout = io.StringIO()
    stderr = io.StringIO()
    
    with redirect_stdout(stdout), redirect_stderr(stderr):
        try:
            # Set up input
            sys.stdin = io.StringIO(input_data)
            
            # Execute the code
            exec(code, globals_dict, locals_dict)
            
            # Get the output
            output = stdout.getvalue()
            error = stderr.getvalue()
        except Exception as e:
            error = str(e)
            output = ""
    
    return output, error

if __name__ == "__main__":
    # Read JSON input
    json_input = sys.stdin.read()
    data = json.loads(json_input)
    
    code = data['code']
    input_data = data['input']
    expected = data['expected']
    
    # Execute the code
    actual_output, error = execute_code(code, input_data)
    
    # Prepare the result
    result = {
        "result": actual_output.strip() == expected.strip(),
        "actual_output": actual_output,
        "error": error
    }
    
    # Output the result as JSON
    print(json.dumps(result))