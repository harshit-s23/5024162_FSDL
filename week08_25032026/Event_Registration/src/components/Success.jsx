import { useLocation, Link } from "react-router-dom";

function Success() {
  const location = useLocation();
  const { name, age, eventDate } = location.state || {};

  return (
    <div className="container">
      <h2 className="success">Registration Successful 🎉</h2>

      <p><b>Name:</b> {name}</p>
      <p><b>Age:</b> {age}</p>
      <p><b>Event Date:</b> {eventDate}</p>

      <Link to="/users">
        <button>View Users</button>
      </Link>
    </div>
  );
}

export default Success;