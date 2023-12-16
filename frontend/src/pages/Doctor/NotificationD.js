import React, { useState, useEffect } from "react";
import axios from "axios";
//import NavBar from "../../components/navBar";
import { auth } from "../Protected/AuthProvider";
import NavBar from "../../components/navBarDoctor";

const NotificationsD = () => {
  const [UnseenNotifications, setUnseenNotifications] = useState([]);
  const [SeenNotifications, setSeenNotifications] = useState([]);
  const [username, setUsername] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [token, setToken] = useState("");


  useEffect(() => {
    // Check authentication and role from localStorage
    const isAuthenticated = auth();
    const role = localStorage.getItem("role");
    //const token  = localStorage.getItem('token')

    // Set isPatient and username based on authentication and role
    setIsDoctor(isAuthenticated && role === "Doctor");
    console.log(isAuthenticated)
    console.log(role)
    const usn = localStorage.getItem("username");
    console.log("USERPLEASE"+usn)
    setUsername(usn);
    console.log("USERPLEASE2"+username)
    setToken(localStorage.getItem("token"))
    console.log("HERE USER")
    console.log(localStorage)
    console.log(username)
    console.log(token)

    // Fetch notifications when the component mounts or when username changes
    fetchNotifications();
  }, [username]);

  // Fetch unseen notifications for a specific user
  const fetchNotifications = async () => {

    try {
      console.log('Token:', token);
      console.log("UserName: " +username)
      //${username}
      const response = await fetch(`http://localhost:8000/doctor/getAllUnseenNotifications/${username}`, {
        method: 'GET',
        credentials: 'include',

      });
      const json=await response.json()

      if (response.ok) {
      // console.log(username)
        console.log(json.data[0])
        setUnseenNotifications(json.data);
        console.log(UnseenNotifications)
      }

      const response1 = 
      await fetch(`http://localhost:8000/doctor/getAllSeenNotificationsD/${username}`, {
        method: 'GET',
        credentials: 'include',

      });
      const json1=await response1.json()

      if (response1.ok) {
      // console.log(username)
        console.log(json1.data[0])
        setSeenNotifications(json1.data);
        console.log("SEEN NOTIFICATIONS: "+SeenNotifications)
      }
     
      } catch (error) {
            console.log("HERE ERROR")
            console.error("Error fetching notifications:", error.message);
          }
      };
  const handleMarkAsSeen = async (notificationId) => {
    try {
      const response = await fetch('http://localhost:8000/doctor/markNotificationAsSeen/' +username + "/" + notificationId,
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
  const show = isDoctor;

  return (
    <div>
      <NavBar username={username} />
      {show ? (
        <div className="NotificationDoctor">
          <h1>Unseen Notifications</h1>
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

          <h1>Seen Notifications</h1>
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

export default NotificationsD;
