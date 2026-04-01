import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(data);
  }, []);

  return (
    <div className="container">
      <h2>Registered Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user, index) => (
          <div className="card" key={index}>
            <p><b>{user.name}</b></p>
            <p>{user.email}</p>
            <p>{user.eventDate}</p>
          </div>
        ))
      )}

      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default Users;