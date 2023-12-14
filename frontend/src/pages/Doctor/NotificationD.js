import React, { useState, useEffect } from "react";
import axios from "axios";
//import NavBar from "../../components/navBar";
import { auth } from "../Protected/AuthProvider";
import NavBar from "../../components/navBarForDR";

const NotificationsD = () => {
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(null);
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
 /*     const response = await axios.get(
       // `http://localhost:8000/doctor/getAllUnseenNotifications/${username}`
       `http://localhost:8000/doctor/getAllUnseenNotifications/t`
      );
*/

console.log('Token:', token);
/*
const getAllUnseenNotificationsEndpoint = 
`http://localhost:8000/doctor/getAllUnseenNotifications/${username}`;
  
  const response = await axios.get(getAllUnseenNotificationsEndpoint, {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});
*/

//${username}
/*const response = await fetch(`http://localhost:8000/doctor/getAllUnseenNotifications/${username}`, {
  method: 'GET',
 /* headers: {
    'Content-Type':'application/json',
  },
  'credentials': 'include',*/
//});
console.log("UserName: " +username)
const response = await fetch(`http://localhost:8000/doctor/getAllUnseenNotifications/${username}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json', // Adjust the content type as needed
  },
});

if (!response.ok) {
 // console.log(username)
  console.log(token)
  console.log("Here NOT ERROR")
  console.log(response)
  setNotifications(response.data.data);

 // throw new Error(`HTTP error! Status: ${response.status}`);
}
     // console.log(response)

      //console.log(Notifications.data)

 } catch (error) {
      console.log("HERE ERROR")
      console.error("Error fetching notifications:", error.message);
    }
  };
  const handleMarkAsSeen = async (notificationId) => {
    try {
      await axios.patch(
        `http://localhost:8000/doctor/markNotificationAsSeen/${username}/${notificationId}`
      );

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
            <NavBar name={"Notifications"} username={username} />
      {show ? (
        <div className="NotificationDoctor">
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

export default NotificationsD;
