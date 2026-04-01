import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const dobRef = useRef();
  const eventRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      let name = nameRef.current.value.trim();
      let email = emailRef.current.value.trim();
      let phone = phoneRef.current.value.trim();
      let dob = dobRef.current.value;
      let eventDate = eventRef.current.value;

      if (!name || !email || !phone || !dob || !eventDate) {
        throw "All fields required!";
      }

      name = name.charAt(0).toUpperCase() + name.slice(1);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw "Invalid email!";
      }

      if (!/^\d{10}$/.test(phone)) {
        throw "Phone must be 10 digits!";
      }

      let today = new Date();
      let dobDate = new Date(dob);
      let event = new Date(eventDate);

      if (dobDate > today) throw "Invalid DOB!";
      if (event < today) throw "Event must be future!";

      let age = today.getFullYear() - dobDate.getFullYear();

      let users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ name, email, phone, age, eventDate });
      localStorage.setItem("users", JSON.stringify(users));

      navigate("/success", { state: { name, age, eventDate } });

    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container">
      <h2>Event Registration</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" ref={nameRef} />
        <input placeholder="Email" ref={emailRef} />
        <input placeholder="Phone" ref={phoneRef} />
        <input type="date" ref={dobRef} />
        <input type="date" ref={eventRef} />

        <button type="submit">Register</button>
      </form>

      <p className="error">{error}</p>
    </div>
  );
}

export default Register;