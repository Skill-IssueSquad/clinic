# El7a2ni Clinic: A virtual online clinic

El7a2ni clinic is a virtual online clinic platform that enables patients and doctors to communicate and streamline the usually tedious process of booking visits and recieving prescriptions in the usual ohysical setting of traditional clinics.

---

# Section 1: Brief

## 1.1 | Motiviation:

This project was motivated by the very dire need for a more accessible and streamlined way of communication between doctors and patients unlike what is usually present in the real world. Most traditional clinics are usually limited by how many patients they can take in a day and how many of the staff is able to work on any given day. Most tasks have the ability to be automated and streamlined using software solutions that will subsequently increase the capacity of doctors to receive more patients and the ability of patients to communicate with more doctors effeciently; All while keeping their prescriptions and visit statuses organized and accessible any time without the need to call in and ask a staff member.

## 1.2 | Build Status:

Currently the system is working as expected, all functionalities including the more sophisticated ones like video calling, live chatting, booking visits and downloading prescriptions are running with no known issues. Currently if any user is using a _**Chromium based**_ web browser; they will need to run a custom command through termninal on their machine:

| Windows                                                                                                   | MacOS                                                                                                                              |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://www.pngall.com/wp-content/uploads/10/Windows-11-PNG-File.png" width="100" height="100"> | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png" width="100" height="100">             |
| `chrome.exe --disable-web-security --user-data-dir="C:\temp"`                                             | `open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="<path>" --disable-web-security` |
| **Win+R**                                                                                                 | From Terminal                                                                                                                      |

## 1.3 | Code Style:

The code style is enforced using eslint and prettier, both are plugins installed in VS-Code to manage the overall code cleanliness and follow usual conventions in web development.

Prettier link: [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Eslint link: [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## 1.4 | Tech and frameworks:

|                                                      |                                                                                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [React](https://reactjs.org/)                        | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)                  |
| [Node.js](https://nodejs.org/en/)                    | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)              |
| [JWT](https://jwt.io/)                               | ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)                          |
| [Express](https://expressjs.com/)                    | ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)                                       |
| [MongoDB](https://www.mongodb.com/)                  | ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)      |
| [Mongoose](https://mongoosejs.com/)                  | ![Mongoose](https://img.shields.io/badge/Mongoose-black.svg?style=for-the-badge&logo=mongoose&logoColor=orange)      |
| [Material-UI](https://material-ui.com/)              | ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)                  |
| [Stripe](https://stripe.com/)                        | ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)                |
| [Git](https://git-scm.com/)                          | ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)                  |
| [Github Actions](github.com/features/actions)        | ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)         |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | ![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-white.svg?style=for-the-badge&logo=mongodb&logoColor=green)  |
| [Postman](https://www.postman.com/)                  | ![Postman](https://img.shields.io/badge/postman-black.svg?style=for-the-badge&logo=postman&logoColor=orange)         |
| [VSCode](https://code.visualstudio.com/)             | ![VScode](https://img.shields.io/badge/VS%20code-black.svg?style=for-the-badge&logo=visualstudiocode&logoColor=blue) |

---

# Section 2: Features

## 2.1 | Main features:

#### El7a2ni's clinic offers a wide range of features that you might need in a traditional clinic and more, these include:

> ⚠️: **Note:** Click to expand.

<details>
    
 <summary> As a Patient, you can: </summary>
 
  - Reserve and book slots for visits or checkups.
  - Start a video conference with a doctor.
  - Upload and download prescriptions and medical health history documents.
  - Subscribeto health packages for yourself or family members.
  - Get a virtual wallet for payments.
  - Live text chat with a doctor.
  - Link other accounts as family members and relatives.
  - Save credit cards for future payments.
  - Find any doctors in any fields.
  - Claim refunds on eligible items.
    
</details>

<details>
    
 <summary> As a Doctor, you can: </summary>
 
  - Checkout and update reserved slots on your schedule.
  - 
    
</details>


## 2.2 | Complementary features:

## 2.3 | Code examples and screenshots:

---

# Section 3: How to use

## 3.1 | API's:

<details>
    <summary>
        Patient Routes (/patient)
    </summary>

`router.post(
  "/:username/healthrecords"
)` Allows a patient to upload his/her health records

`router.delete("/:username/healthrecords/:recordId")`

`router.get("/:username/healthrecords")`

router.get("/:username/bookingOptions", getPatientBookingOptions);
router.get("/freeAppointments", getAllFreeDocAppointments);
router.get("/:username", getPatientAPI);
router.get("/getByID/:id", getPatientAPIByID);
router.get("/email/:username", getPatientemUsername);
router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.post("/:username/doctors", viewAllDoctors);
router.post("/:username/doctors/available", viewAllDoctorsAvailable);
router.post("/createDoc", createDoc); // TESTING PURPOSES ONLY
router.post("/:username/bookAppointment", bookAppointment);
router.post("/:username/tempBook", tempBookAppointment); // TESTING PURPOSES ONLY
router.post("/:username/reschduleAppointment", rescheduleAppointment);
router.delete(
"/:username/appointments/:doctor_id/:appointment_id",
cancelAppointment
);
router.post("/:username/requestFollowUp", requestFollowUp);
router.post("/:username/tempRequestFollowUp", tempRequestFollowUp); // TESTING PURPOSES ONLY
router.put("/:username/editWalletBalance", editWalletBalance);
router.get("/transitPay/:transit_id", getTransitData);
router.post("/:username/docFollowUpPay", payDoctorScheduledFollowUp);
router.post("/:username/tempDocFollowUpPay", tempPayDoctorFollowUp);

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//link family member route
router.patch("/:username/linkFamMember", linkFamMember);

//get family members route
router.get("/:username/getFamMember", getFamMembers);

//get prescriptions route
router.get("/:username/prescriptions", getPrescriptions);

//subscribe health package route (temp and will be removed )
router.post("/:username/subscriptions/transitSub", tempSub);
router.post("/:username/subscriptions/subscribe", actualSub);

//cancel health package subscription route
router.patch("/:username/subscriptions/cancel", cancelHealthPackage);

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//send email
router.patch("/:sendEmail", sendEmail);

router.post("/:addNotification",AddNotification);

router.get("/getAllUnseenNotifications/:username",getAllUnseenNotifications);

router.patch("/markNotificationAsSeen/:username/:notificationId",markNotificationAsSeen);`

</details>

## 3.2 | Testing:

We used Postman to test our different API endpoints.

![Example of a Postman test](image.png)

## 3.3 | How to use:

To run backend

```bash
cd backend && npm run dev
```

To run frontend

```bash
cd frontend && npm start
```

the backend server and client will be running on the specified ports on your env files.

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

<details>
    <summary>
        envs
    </summary>

`DATABASE_URL`

`PORT`

`VIDEO_PORT`

`SOCKET_PORT`

</details>

## 3.3 | Contribution:

There are a lot more features and improvements that could be made to this project, this is why we welcome contributions with open arms!

Please adhere to this project's code of conduct.

### Getting Started

1. Fork the repository
2. Clone the repository
3. Install dependencies
4. Create a new branch
5. Make your changes
6. Commit and push your changes
7. Create a pull request
8. Wait for your pull request to be reviewed and merged

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). Please read the [full text](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) so that you can understand what actions will and will not be tolerated.

---

# Section 4: Credits and Licensing

## Credits:

## License:
