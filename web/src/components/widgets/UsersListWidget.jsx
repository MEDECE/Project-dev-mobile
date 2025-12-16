import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Widget.css";

const UsersListWidget = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data.slice(0, 5)); // Limit to 5 for widget
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="widget">
      <h3>Derniers Utilisateurs</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user._id}
            style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}
          >
            <strong>{user.location}</strong>
            <span style={{ float: "right", color: "#888" }}>
              {user.personsInHouse} pers.
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersListWidget;
