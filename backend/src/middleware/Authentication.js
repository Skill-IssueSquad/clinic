const jwt = require('jsonwebtoken');
const jwtSecret = '4715aed3c946f7b0a38e6b53d700770d572af3dce43625dd';


//Authenticate admin is logged in
const authAdmin = async = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
            const reply = {
                success: false,
                data: null,
                message: "An error occured",
            }
            res.status(401).json(reply);
        } else {
          if (decodedToken.role !== "Admin") {
            const reply = {
                success: false,
                data: null,
                message: "Not authorized",
            }
            res.status(401).json(reply);
          } else {
            next()
          }
        }
      })
    } else {
        const reply = {
            success: false,
            data: null,
            message: "Not authorized, token not available" ,
        }
        res.status(401).json(reply);
    }
};


//Authenticate doctor is logged in
const authDoctor = async = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
            const reply = {
                success: false,
                data: null,
                message: "An error occured",
            }
            res.status(401).json(reply);
        } else {
          if (decodedToken.role !== "Doctor") {
            const reply = {
                success: false,
                data: null,
                message: "Not authorized",
            }
            res.status(401).json(reply);
          } else {
            next()
          }
        }
      })
    } else {
        const reply = {
            success: false,
            data: null,
            message: "Not authorized, token not available" ,
        }
        res.status(401).json(reply);
    }
};

//Authenticate doctor request is logged in
const authDoctorRequest = async = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
          const reply = {
              success: false,
              data: null,
              message: "An error occured",
          }
          res.status(401).json(reply);
      } else {
        if (decodedToken.role !== "DoctorRequest") {
          const reply = {
              success: false,
              data: null,
              message: "Not authorized",
          }
          res.status(401).json(reply);
        } else {
          next()
        }
      }
    })
  } else {
      const reply = {
          success: false,
          data: null,
          message: "Not authorized, token not available" ,
      }
      res.status(401).json(reply);
  }
};

//Authenticate patient is logged in
const authPatient = async = (req, res, next) => {
    const token = req.cookies.jwt
    console.log(token);
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
            const reply = {
                success: false,
                data: null,
                message: "An error occured",
            }
            res.status(401).json(reply);
        } else {
          if (decodedToken.role !== "Patient") {
            const reply = {
                success: false,
                data: null,
                message: "Not authorized",
            }
            res.status(401).json(reply);
          } else {
            next()
          }
        }
      })
    } else {
        const reply = {
            success: false,
            data: null,
            message: "Not authorized, token not available" ,
        }
        res.status(401).json(reply);
    }
};


module.exports = {
   authAdmin,
   authDoctor,
   authDoctorRequest,
   authPatient
};