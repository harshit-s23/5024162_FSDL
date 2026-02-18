// VARIABLE
let count = 0;

// CLASS
class Counter {
    constructor(initialValue) {
        this.count = initialValue;
    }

    // FUNCTION - Increment
    increment() {
        this.count++;   // Operator
        return this.count;
    }

    // FUNCTION - Decrement
    decrement() {
        this.count--;
        return this.count;
    }

    // FUNCTION - Reset
    reset() {
        this.count = 0;
        return this.count;
    }

    // FUNCTION - Check Condition
    getColor() {
        // CONDITION
        if (this.count > 0) {
            return "green";
        } else if (this.count < 0) {
            return "red";
        } else {
            return "black";
        }
    }
}

// OBJECT
const counter = new Counter(count);

// SELECT ELEMENTS
const display = document.getElementById("countDisplay");
const incrementBtn = document.getElementById("incrementBtn");
const decrementBtn = document.getElementById("decrementBtn");
const resetBtn = document.getElementById("resetBtn");

// FUNCTION TO UPDATE UI
function updateDisplay() {
    display.textContent = counter.count;
    display.style.color = counter.getColor();
}

// EVENTS
incrementBtn.addEventListener("click", function () {
    counter.increment();
    updateDisplay();
});

decrementBtn.addEventListener("click", function () {
    counter.decrement();
    updateDisplay();
});

resetBtn.addEventListener("click", function () {
    counter.reset();
    updateDisplay();
});

// LOOP (Example usage)
for (let i = 0; i < 1; i++) {
    updateDisplay();
}
