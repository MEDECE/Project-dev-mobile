import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import "./Admin.css";

const Admin = () => {
  const [sensors, setSensors] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    location: "",
    type: "temperature",
    userID: "",
  });
  const [message, setMessage] = useState("");

  // Fetch Data
  const fetchData = async () => {
    try {
      const [sensorsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/api/sensors"),
        axios.get("http://localhost:3000/api/users"),
      ]);
      setSensors(sensorsRes.data);
      setUsers(usersRes.data);
      if (usersRes.data.length > 0 && !formData.userID) {
        setFormData((prev) => ({ ...prev, userID: usersRes.data[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Erreur chargement données");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Sensor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/sensors", formData);
      setMessage("Capteur ajouté avec succès !");
      fetchData(); // Refresh list
      setFormData({ ...formData, location: "" }); // Reset location
    } catch (error) {
      console.error("Error adding sensor:", error);
      setMessage("Erreur lors de l'ajout.");
    }
  };

  // Delete Sensor
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce capteur ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/sensors/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting sensor:", error);
      }
    }
  };

  return (
    <Layout>
      <h2>Administration des Capteurs</h2>

      {message && (
        <div
          className={`message ${
            message.includes("Erreur") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      <div className="admin-container">
        {/* ADD FORM */}
        <div className="admin-card">
          <h3>Ajouter un Capteur</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Emplacement :</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Ex: Salon, Jardin..."
              />
            </div>

            <div className="form-group">
              <label>Type :</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="temperature">Température</option>
                <option value="humidity">Humidité</option>
                <option value="airPollution">Pollution Air</option>
              </select>
            </div>

            <div className="form-group">
              <label>Utilisateur Associé :</label>
              <select
                name="userID"
                value={formData.userID}
                onChange={handleChange}
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.location} ({user.personsInHouse} pers.)
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Ajouter
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="admin-card">
          <h3>Liste des Capteurs ({sensors.length})</h3>
          <ul className="sensor-list">
            {sensors.map((sensor) => (
              <li key={sensor._id} className="sensor-item">
                <div className="sensor-info">
                  <strong>{sensor.location}</strong>
                  <span className="badge">{sensor.type}</span>
                  <small>
                    User: {sensor.userID ? sensor.userID.location : "Aucun"}
                  </small>
                </div>
                <button
                  onClick={() => handleDelete(sensor._id)}
                  className="btn-delete"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
