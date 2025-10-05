const { User } = require("../models/user_model");
const { sequelize } = require("../config/database");
const apiResponse = require("../config/api_response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");


// Function to capitalize full name
function capitalizeFullName(name) {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
exports.createUser = async (req, res) => {
  try {
    let { fullName, username, email, password, confirmPassword } = req.body;

    // 1️⃣ Individual field validations
    if (!fullName) return apiResponse(res, false, "MISSING_FULLNAME", "The 'Full Name' field is required.", null, 400);
    if (!username) return apiResponse(res, false, "MISSING_USERNAME", "The 'Username' field is required.", null, 400);
    if (!email) return apiResponse(res, false, "MISSING_EMAIL", "The 'Email' field is required.", null, 400);
    if (!isValidEmail(email)) return apiResponse(res, false, "INVALID_EMAIL", "The provided email is not valid.", null, 400);
    if (!password) return apiResponse(res, false, "MISSING_PASSWORD", "The 'Password' field is required.", null, 400);
    if (!confirmPassword) return apiResponse(res, false, "MISSING_CONFIRM_PASSWORD", "The 'ConfirmPassword' field is required.", null, 400);

    // 2️⃣ Check if passwords match
    if (password !== confirmPassword) return apiResponse(res, false, "PASSWORD_MISMATCH", "Passwords do not match.", null, 400);

    // 3️⃣ Format full name
    fullName = capitalizeFullName(fullName);

    // 4️⃣ Check if email or username already exist
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) return apiResponse(res, false, "EMAIL_EXISTS", "The provided email is already in use.", null, 409);
      if (existingUser.username === username) return apiResponse(res, false, "USERNAME_EXISTS", "The provided username is already in use.", null, 409);
    }

    // 5️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Create user
    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    return apiResponse(res, true, "USER_CREATED_SUCCESS", "User created successfully.", {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email
    }, 201);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error creating user.", null, 500);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validações individuais
    if (!email) return apiResponse(res, false, "MISSING_EMAIL", "The 'Email' field is required.", null, 400);
    if (!isValidEmail(email)) return apiResponse(res, false, "INVALID_EMAIL", "The provided email is not valid.", null, 400);
    if (!password) return apiResponse(res, false, "MISSING_PASSWORD", "The 'Password' field is required.", null, 400);

    // 2️⃣ Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) return apiResponse(res, false, "USER_NOT_FOUND", "No user found with this email.", null, 404);

    // 3️⃣ Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return apiResponse(res, false, "INVALID_PASSWORD", "Incorrect password.", null, 401);

    // 4️⃣ Gera JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    // 5 Retorna dados do usuário (pode incluir token se usar JWT)
    return apiResponse(res, true, "LOGIN_SUCCESS", "Logged in successfully.", {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      token
    }, 200);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error logging in.", null, 500);
  }
};