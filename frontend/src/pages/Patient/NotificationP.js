import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../components/navBarPatient";
import { auth } from "../Protected/AuthProvider";

const Notifications = () => {
  const [UnseenNotifications, setUnseenNotifications] = useState([]);
  const [SeenNotifications, setSeenNotifications] = useState([]);
  const [username, setUsername] = useState("");
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    // Check authentication and role from localStorage
    const isAuthenticated = auth();
    const role = localStorage.getItem("role");

    // Set isPatient and username based on authentication and role
    setIsPatient(isAuthenticated && role === "Patient");
    setUsername(localStorage.getItem("username"));

    // Fetch notifications when the component mounts or when username changes
    fetchNotifications();
  }, [username]);

  // Fetch unseen notifications for a specific user
  const fetchNotifications = async () => {
    try {
      console.log(username)
      const response = await axios.get(
        `http://localhost:8000/patient/getAllUnseenNotifications/${username}`,
        {withCredentials:true},
      );

      console.log(response.data)
      setUnseenNotifications(response.data.data);
      //console.log(Notifications.data)

      const response1 = await axios.get(
        `http://localhost:8000/patient/getAllSeenNotifications/${username}`,
        {withCredentials:true},
      );

      console.log(response1.data)
      setSeenNotifications(response1.data.data);

    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };
  const handleMarkAsSeen = async (notificationId) => {
    try {
      const response = await fetch('http://localhost:8000/patient/markNotificationAsSeen/' +username + "/" + notificationId,
       {method: "PATCH", credentials: 'include',}
      );

      const json = await response.json();
      // After successful update, fetch and update notifications
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as seen:", error.message);
    }
  };

  // Use the show variable to conditionally render content
  const show = isPatient;

  return (
    <div>
      {show ? (
        <div className="PatientDoctors">
          <NavBar name={"Notifications"} username={username} />
          <h1>Notifications</h1>

          {/* Unseen Notifications */}
          <h2>Unseen Notifications</h2>
          <ul>
            {UnseenNotifications &&
              UnseenNotifications.map((notification, index) => (
                <li key={index}>
                  <strong>{notification.title}</strong>:{" "}
                  {notification.notification}
                  {!notification.isSeen && (
                    <button
                      onClick={() => handleMarkAsSeen(notification._id)}
                    >
                      Mark as Seen
                    </button>
                  )}
                </li>
              ))}
          </ul>

          {/* Seen Notifications */}
          <h2>Seen Notifications</h2>
          <ul>
            {SeenNotifications &&
              SeenNotifications.map((notification, index) => (
                <li key={index}>
                  <strong>{notification.title}</strong>:{" "}
                  {notification.notification}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Notifications;
