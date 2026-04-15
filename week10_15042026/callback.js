// Function with callback
function calculate(a, b, callback) {
    console.log("Calculating...");
    callback(a, b);
}

// Callback function
function add(x, y) {
    console.log("Sum = " + (x + y));
}

// Calling function
calculate(5, 3, add);