document.getElementById("registrationForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let dob = document.getElementById("dob").value;
  let eventDate = document.getElementById("eventDate").value;
  let password = document.getElementById("password").value;

  let errorMsg = document.getElementById("errorMsg");
  let successMsg = document.getElementById("successMsg");

  errorMsg.innerText = "";
  successMsg.innerText = "";

  try {
    // 🔹 Validation
    if (!name || !email || !phone || !dob || !eventDate || !password) {
      throw "All fields are required!";
    }

    // 🔹 Name validation (string)
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // 🔹 Email validation
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw "Invalid email format!";
    }

    // 🔹 Phone validation
    if (!/^\d{10}$/.test(phone)) {
      throw "Phone number must be 10 digits!";
    }

    // 🔹 Password validation
    if (password.length < 6) {
      throw "Password must be at least 6 characters!";
    }

    // 🔹 Date validation
    let today = new Date();
    let dobDate = new Date(dob);
    let event = new Date(eventDate);

    if (dobDate > today) {
      throw "DOB cannot be in the future!";
    }

    if (event < today) {
      throw "Event date must be in the future!";
    }

    // 🔹 Age calculation
    let age = today.getFullYear() - dobDate.getFullYear();

    // 🔹 Success message
    successMsg.innerText = 
      `Registration Successful!\nWelcome ${name}\nAge: ${age}\nEvent Date: ${eventDate}`;

  } catch (error) {
    errorMsg.innerText = error;
  }
});