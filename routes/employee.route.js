const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {  salaryUpdateCost } = require("../util/analytics");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "othman23.tmar@gmail.com",
    pass: "ypfqbtyglczkkium",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "All fields are required" });
    }

    let employee = await Employee.findOne({
      email,
    })
      .select("+password")
      .select("+isActive");

    if (!employee) {
      return res
        .status(404)
        .send({ success: false, message: "Account doesn't exists" });
    } else {
      let isCorrectPassword = await bcrypt.compare(password, employee.password);

      if (isCorrectPassword) {
        delete employee._doc.password;
        if (!employee.isActive)
          return res.status(200).send({
            success: false,
            message:
              "Your account is inactive, Please contact your administrator",
          });
        /* 
                                const token = jwt.sign({
                                    iduser:
                
                                        user._id, name: user.firstname, role: user.role
                                }, process.env.SECRET, {
                                    expiresIn: "1h",
                                })
                 */
        const token = generateAccessToken(employee);
        const refreshToken = generateRefreshToken(employee);

        return res
          .status(200)
          .send({ success: true, employee, token, refreshToken });
      } else {
        return res
          .status(404)
          .send({ success: false, message: "Please verify your credentials" });
      }
    }
  } catch (err) {
    return res.status(404).send({
      success: false,
      message: err.message,
    });
  }
});

//Access Token
const generateAccessToken = (employee) => {
  return jwt.sign(
    { idemployee: employee._id, role: employee.role },
    process.env.SECRET,
    {
      expiresIn: "100s",
    }
  );
};

// Refresh
const generateRefreshToken = (employee) => {
  return jwt.sign(
    { idemployee: employee._id, role: employee.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1y" }
  );
};

//Refresh Route
router.post("/refreshToken", async (req, res) => {
  console.log(req.body.refreshToken);
  const refreshtoken = req.body.refreshToken;
  if (!refreshtoken) {
    return res.status(404).send({ success: false, message: "Token Not Found" });
  } else {
    jwt.verify(
      refreshtoken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, employee) => {
        if (err) {
          console.log(err);
          return res
            .status(406)
            .send({ success: false, message: "Unauthorized" });
        } else {
          const jwtToken = generateAccessToken(employee);
          const refreshToken = generateRefreshToken(employee);
          console.log("token-------", jwtToken);
          res.status(200).send({
            success: true,
            jwtToken,
            refreshToken,
          });
        }
      }
    );
  }
});

/**
 * as an admin i can disable or enable an account
 */
router.get("/status/edit/", async (req, res) => {
  try {
    let email = req.query.email;
    let employee = await Employee.findOne({ email });
    employee.isActive = !employee.isActive;
    employee.save();
    res.status(200).send({ success: true, employee });
  } catch (err) {
    return res.status(404).send({ success: false, message: err });
  }
});



//CRUD SERVICES
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find({}, null, {
      sort: { _id: -1 },
    }); /* .select("-password"); */
    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.get("/:employeeId", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.employeeId);

    res.status(200).json(emp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete("/:employeeId", async (req, res) => {
  const id = req.params.employeeId;
  await Employee.findByIdAndDelete(id);

  res.json({ message: "Admin deleted successfully." });
});



router.put('/:employeeId', async (req, res) => {
  const oldDoc = await Employee.findById(req.params.employeeId);
  try {
      const emp = await Employee.findByIdAndUpdate(
          req.params.employeeId,
          { $set: req.body },
          { new: true, runValidators: true }
      );
      res.status(200).json(emp);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
  setImmediate(async () => {
    
    const updatedDoc = await Employee.findByIdAndUpdate(req.params.employeeId, { new: true });
salaryUpdateCost(oldDoc,updatedDoc);

});
});


// créer un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    let { email, password, firstname, lastname, avatar, role, phone } =
      req.body;
    const employee = await Employee.findOne({ email });
    if (employee)
      return res.status(404).send({
        success: false,
        message: "Employee already exists",
      });

    const newEmployee = new Employee({
      email,
      password,
      firstname,
      lastname,
      avatar,
      role,
      phone,
    });
    const createdEmployee = await newEmployee.save();

    // Envoyer l'e-mail de confirmation de l'inscription
    var mailOption = {
      from: '"verify your email " <othman23.tmar@gmail.com>',
      to: newEmployee.email,
      subject: "vérification your email ",
      html: `<h2>${newEmployee.firstname}! thank you for registreting on our website</h2>
    <h4>please verify your email to procced.. </h4>
    <a
    href="http://${req.headers.host}/api/admins/status/edit?email=${newEmployee.email}">click
    here</a>`,
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("verification email sent to your gmail account ");
      }
    });

    /*  ------------------ */

    return res
      .status(201)
      .send({
        success: true,
        message: "Account created successfully",
        employee: createdEmployee,
      });
  } catch (err) {
    console.log(err);
    res.status(404).send({ success: false, message: err });
  }
});

module.exports = router;
