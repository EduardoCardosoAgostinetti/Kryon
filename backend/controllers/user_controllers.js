const { User } = require("../models/user_model");
const { sequelize } = require("../config/database");
const apiResponse = require("../config/api_response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");



function capitalizeFullName(name) {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendResetEmail(toEmail, resetToken) {
  // Configura o transportador SMTP (use suas credenciais reais)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  // Link de redefinição (ajuste conforme sua rota frontend)
  const resetLink = `${process.env.FRONTEND_URL}/kryon/reset-password?token=${resetToken}`;

  // Corpo do e-mail
  const mailOptions = {
    from: `"Suporte - Kryon" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Redefinição de senha",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova:</p>
        <a href="${resetLink}" 
           style="display:inline-block;background:#007bff;color:#fff;padding:10px 20px;
                  border-radius:5px;text-decoration:none;margin-top:10px;">
          Redefinir senha
        </a>
        <p style="margin-top:20px;">Se você não solicitou essa ação, ignore este e-mail.</p>
        <hr>
        <small>Link válido por 15 minutos.</small>
      </div>
    `
  };

  // Envia o e-mail
  await transporter.sendMail(mailOptions);
}

async function sendActivationEmail(toEmail, activationToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const activationLink = `${process.env.FRONTEND_URL}/kryon/activate-account?token=${activationToken}`;

  const mailOptions = {
    from: `"Suporte - Kryon" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Ative sua conta",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2>Ative sua conta</h2>
        <p>Obrigado por se cadastrar! Clique no botão abaixo para ativar sua conta:</p>
        <a href="${activationLink}" 
           style="display:inline-block;background:#28a745;color:#fff;padding:10px 20px;
                  border-radius:5px;text-decoration:none;margin-top:10px;">
          Ativar Conta
        </a>
        <p style="margin-top:20px;">Se você não solicitou essa ação, ignore este e-mail.</p>
        <hr>
        <small>Link válido por 25 minutos.</small>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
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
      isActive: false,
    });

    const activationToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "25m" }
    );

    await sendActivationEmail(user.email, activationToken);

    return apiResponse(res, true, "USER_CREATED_SUCCESS", "User created successfully. Check your email for activation link.", {
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
    if (!email)
      return apiResponse(res, false, "MISSING_EMAIL", "The 'Email' field is required.", null, 400);
    if (!isValidEmail(email))
      return apiResponse(res, false, "INVALID_EMAIL", "The provided email is not valid.", null, 400);
    if (!password)
      return apiResponse(res, false, "MISSING_PASSWORD", "The 'Password' field is required.", null, 400);

    // 2️⃣ Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "No user found with this email.", null, 404);

    // 2.1️⃣ Verifica se o usuário está ativo
    if (!user.isActive) {
      // Gera token de ativação
      const activationToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "25m" }
      );

      // Envia e-mail de ativação
      await sendActivationEmail(user.email, activationToken);

      return apiResponse(res, false, "USER_NOT_ACTIVE", "User account is not activated. Check your email for activation link.", null, 403);
    }

    // 3️⃣ Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return apiResponse(res, false, "INVALID_PASSWORD", "Incorrect password.", null, 401);

    // 4️⃣ Gera JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Retorna dados do usuário
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Validações
    if (!email)
      return apiResponse(res, false, "MISSING_EMAIL", "The 'Email' field is required.", null, 400);
    if (!isValidEmail(email))
      return apiResponse(res, false, "INVALID_EMAIL", "The provided email is not valid.", null, 400);

    // 2️⃣ Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "No user found with this email.", null, 404);

    // 3️⃣ Gera token (expira em 15 min)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 4️⃣ Envia o e-mail
    await sendResetEmail(user.email, resetToken);

    return apiResponse(
      res,
      true,
      "RESET_EMAIL_SENT",
      "Password reset email sent successfully.",
      null,
      200
    );

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error sending reset email.", null, 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token)
      return apiResponse(res, false, "MISSING_TOKEN", "The 'Token' field is required.", null, 400);
    if (!newPassword)
      return apiResponse(res, false, "MISSING_NEW_PASSWORD", "The 'New Password' field is required.", null, 400);
    if (!confirmPassword)
      return apiResponse(res, false, "MISSING_CONFIRM_PASSWORD", "The 'Confirm Password' field is required.", null, 400);
    if (newPassword !== confirmPassword)
      return apiResponse(res, false, "PASSWORD_MISMATCH", "Passwords do not match.", null, 400);

    // Verifica o token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return apiResponse(res, false, "INVALID_TOKEN", "The provided token is invalid or expired.", null, 401);
    }

    // Busca usuário
    const user = await User.findByPk(decoded.id);
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    // Atualiza senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return apiResponse(res, true, "PASSWORD_RESET_SUCCESS", "Password reset successfully.", null, 200);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error resetting password.", null, 500);
  }
};

exports.updateFullName = async (req, res) => {
  try {
    const { userId, newFullName } = req.body;

    if (!newFullName)
      return apiResponse(res, false, "MISSING_FULLNAME", "The 'Full Name' field is required.", null, 400);

    const user = await User.findByPk(userId);
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    const formattedName = capitalizeFullName(newFullName);
    await user.update({ fullName: formattedName });

    // Gera novo token atualizado
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, fullName: formattedName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return apiResponse(res, true, "FULLNAME_UPDATED", "Full name updated successfully.", { fullName: formattedName, token }, 200);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error updating full name.", null, 500);
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    if (!newEmail)
      return apiResponse(res, false, "MISSING_EMAIL", "The 'Email' field is required.", null, 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail))
      return apiResponse(res, false, "INVALID_EMAIL", "The provided email is not valid.", null, 400);

    const user = await User.findByPk(userId);
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    const existingEmail = await User.findOne({ where: { email: newEmail, id: { [Op.ne]: userId } } });
    if (existingEmail)
      return apiResponse(res, false, "EMAIL_EXISTS", "The provided email is already in use.", null, 409);

    await user.update({ email: newEmail });

    const token = jwt.sign(
      { id: user.id, email: newEmail, username: user.username, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return apiResponse(res, true, "EMAIL_UPDATED", "Email updated successfully.", { email: newEmail, token }, 200);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error updating email.", null, 500);
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;

    if (!newUsername)
      return apiResponse(res, false, "MISSING_USERNAME", "The 'Username' field is required.", null, 400);

    const user = await User.findByPk(userId);
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    const existingUsername = await User.findOne({ where: { username: newUsername, id: { [Op.ne]: userId } } });
    if (existingUsername)
      return apiResponse(res, false, "USERNAME_EXISTS", "The provided username is already in use.", null, 409);

    await user.update({ username: newUsername });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: newUsername, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return apiResponse(res, true, "USERNAME_UPDATED", "Username updated successfully.", { username: newUsername, token }, 200);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error updating username.", null, 500);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    // 1️⃣ Validações básicas
    if (!userId)
      return apiResponse(res, false, "MISSING_USER_ID", "The 'User ID' field is required.", null, 400);
    if (!currentPassword)
      return apiResponse(res, false, "MISSING_CURRENT_PASSWORD", "The 'Current Password' field is required.", null, 400);
    if (!newPassword)
      return apiResponse(res, false, "MISSING_NEW_PASSWORD", "The 'New Password' field is required.", null, 400);
    if (!confirmPassword)
      return apiResponse(res, false, "MISSING_CONFIRM_PASSWORD", "The 'Confirm Password' field is required.", null, 400);
    if (newPassword !== confirmPassword)
      return apiResponse(res, false, "PASSWORD_MISMATCH", "Passwords do not match.", null, 400);

    // 2️⃣ Busca o usuário
    const user = await User.findByPk(userId);
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    // 3️⃣ Verifica se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return apiResponse(res, false, "INVALID_CURRENT_PASSWORD", "The current password is incorrect.", null, 401);

    // 4️⃣ Garante que a nova senha seja diferente
    const sameAsOld = await bcrypt.compare(newPassword, user.password);
    if (sameAsOld)
      return apiResponse(res, false, "SAME_PASSWORD", "The new password must be different from the current password.", null, 400);

    // 5️⃣ Criptografa e atualiza a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    // 6️⃣ Gera novo token (mantendo dados atualizados)
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return apiResponse(
      res,
      true,
      "PASSWORD_UPDATED",
      "Password updated successfully.",
      { token },
      200
    );

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error updating password.", null, 500);
  }
};

exports.activateUser = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token)
      return apiResponse(res, false, "MISSING_TOKEN", "Activation token is required.", null, 400);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return apiResponse(res, false, "INVALID_TOKEN", "Activation token is invalid or expired.", null, 401);
    }

    const user = await User.findByPk(decoded.id);
    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    if (user.isActive)
      return apiResponse(res, false, "ALREADY_ACTIVE", "User account is already active.", null, 400);

    await user.update({ isActive: true });

    return apiResponse(res, true, "USER_ACTIVATED", "User account activated successfully.", null, 200);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error activating user.", null, 500);
  }
};
