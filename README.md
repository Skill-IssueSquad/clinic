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

---

# Section 2: Features

## 2.1 | Main features:

## 2.2 | Complementary features:

## 2.3 | Code examples and screenshots:

---

# Section 3: How to use

## 3.1 | API's:

## 3.2 | Testing:

We used Postman to test our different API endpoints.

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
