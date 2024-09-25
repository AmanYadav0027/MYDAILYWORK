let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);

// Function to validate the input
function isValidInput(currentInput) {
    // Prevent multiple consecutive operators
    let lastChar = currentInput[currentInput.length - 1];
    if (['+', '-', '*', '/', '%'].includes(lastChar) && ['+', '-', '*', '/', '%'].includes(currentInput[currentInput.length - 2])) {
        return false;
    }
    return true;
}

// Function to check for invalid ending
function isInvalidEnding(currentInput) {
    // Prevent ending with an operator
    let lastChar = currentInput[currentInput.length - 1];
    return ['+', '-', '*', '/', '%'].includes(lastChar);
}

arr.forEach(button => {
    button.addEventListener('click', (e) => {
        let clickedValue = e.target.innerHTML;

        if (clickedValue == '=') {
            if (isInvalidEnding(string)) {
                input.value = 'Invalid Operation';
                string = "";  // Reset the string after displaying error
            } else {
                try {
                    string = eval(string);
                    input.value = string;
                } catch (error) {
                    input.value = 'Error';
                    string = "";  // Reset the string after displaying error
                }
            }
        } else if (clickedValue == 'AC') {
            string = "";
            input.value = string;
        } else if (clickedValue == 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
        } else {
            // Append the clicked button value to the string
            string += clickedValue;

            // Validate input to prevent consecutive operators
            if (isValidInput(string)) {
                input.value = string;
            } else {
                // Remove the invalid operator if found
                string = string.substring(0, string.length - 1);
            }
        }
    });
});
