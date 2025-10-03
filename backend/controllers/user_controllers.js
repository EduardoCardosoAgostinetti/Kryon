const { User } = require("../models/user_model");
const { sequelize } = require("../config/database");
const  apiResponse  = require("../config/api_response");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");


// Função para capitalizar nome completo
function capitalizeFullName(name) {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

exports.createUser = async (req, res) => {
  try {
    let { fullName, username, email, password, confirmPassword } = req.body;

    // 1️⃣ Validações individuais
    if (!fullName) return apiResponse(res, false, "MISSING_FULLNAME", "Campo 'fullName' é obrigatório.", null, 400);
    if (!username) return apiResponse(res, false, "MISSING_USERNAME", "Campo 'username' é obrigatório.", null, 400);
    if (!email) return apiResponse(res, false, "MISSING_EMAIL", "Campo 'email' é obrigatório.", null, 400);
    if (!isValidEmail(email)) return apiResponse(res, false, "INVALID_EMAIL", "O email informado não é válido.", null, 400);
    if (!password) return apiResponse(res, false, "MISSING_PASSWORD", "Campo 'password' é obrigatório.", null, 400);
    if (!confirmPassword) return apiResponse(res, false, "MISSING_CONFIRM_PASSWORD", "Campo 'confirmPassword' é obrigatório.", null, 400);

    // 2️⃣ Verificar se as senhas conferem
    if (password !== confirmPassword) return apiResponse(res, false, "PASSWORD_MISMATCH", "As senhas não conferem.", null, 400);

    // 3️⃣ Formatar nome
    fullName = capitalizeFullName(fullName);

    // 4️⃣ Checar se email ou username já existem
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) return apiResponse(res, false, "EMAIL_EXISTS", "O email informado já está em uso.", null, 409);
      if (existingUser.username === username) return apiResponse(res, false, "USERNAME_EXISTS", "O username informado já está em uso.", null, 409);
    }

    // 5️⃣ Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Criar usuário
    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    return apiResponse(res, true, "USER_CREATED_SUCCESS", "Usuário criado com sucesso.", {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email
    }, 201);

  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Erro ao criar usuário.", null, 500);
  }
};
