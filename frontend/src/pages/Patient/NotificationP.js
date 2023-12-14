import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../components/navBar";
import { auth } from "../Protected/AuthProvider";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
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
        `http://localhost:8000/patient/getAllUnseenNotifications/${username}`
      );

      console.log(response.data)

      setNotifications(response.data.data);
      //console.log(Notifications.data)

    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };
  const handleMarkAsSeen = async (notificationId) => {
    try {
      await axios.patch(
        `http://localhost:8000/patient/markNotificationAsSeen/${username}/${notificationId}`,{
          withCredentials:true,
        }
      );

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
          <h1>Unseen Notifications</h1>

          <ul>
          {notifications && notifications.map((notification, index) => (
            <li key={index}>
              <strong>{notification.title}</strong>: {notification.notification}
              {!notification.isSeen && (
                <button onClick={() => handleMarkAsSeen(notification._id)}>
                  Mark as Seen
                </button>
              )}
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
