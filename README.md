# User Management System

This project is a simple user management system with JWT authentication, PostgreSQL database integration, and email verification for account activation.

---

## 🚀 Technologies Used

- **Node.js** with **Express**  
- **PostgreSQL** as the database  
- **JWT (JSON Web Token)** for authentication  
- **Nodemailer** for sending emails  
- **dotenv** for environment variable management  

---

## ⚙️ Project Structure



```
kryon/
│
├── backend/
│ ├── controllers/
│ │ └── userController.js
│ │
│ ├── routes/
│ │ └── userRoutes.js
│ │
│ ├── models/
│ │ └── user_model.js
│ │
│ ├── config/
│ │ ├── api_response.js
│ │ └── database.js
│ │
│ ├── tests/
│ │ ├── forgot_password_route.test.js
│ │ ├── login_route.test.js
│ │ ├── register_route.test.js
│ │ └── reset_password_route.test.js
│ │
│ ├── server.js
│ └── app.js
│
├── .gitignore
├── .env
├── package.json
└── README.md
```

---


---

## 🧩 `.env` File

The `.env` file should contain the following environment variables:

```env
# Database configuration
DB_NAME=dbname
DB_USER=dbuser
DB_PASS=dbpass
DB_HOST=localhost
DB_PORT=5432

# API configuration
API_PORT=3000

# JWT configuration
JWT_SECRET=jwtsecret

# Email configuration
EMAIL_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=smtpuser
SMTP_PASS=smtppass

# Frontend configuration
FRONTEND_URL=http://localhost:5173

```

---

## ▶️ How to Run the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the .env file as shown above.

3. Start the server:
   ```bash
   npm start
   ```

4. The server will run at:
   ```
   http://localhost:3000
   ```

---

## 🔐 Main Routes

### 🔸 Authentication
- `POST /api/user/register` → Create a new user with field validations
- `POST /api/user/login` → Login with JWT token generation
- `POST /api/user/forgot-password` → Send email for password reset
- `POST /api/user/reset-password` → Reset password using token received via email

---


## 🧾 POST /register

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_FULLNAME | Campo ausente | The 'Full Name' field is required. | 400 |
| MISSING_USERNAME | Campo ausente | The 'Username' field is required. | 400 |
| MISSING_EMAIL | Campo ausente | The 'Email' field is required. | 400 |
| INVALID_EMAIL | E-mail inválido | The provided email is not valid. | 400 |
| MISSING_PASSWORD | Campo ausente | The 'Password' field is required. | 400 |
| MISSING_CONFIRM_PASSWORD | Campo ausente | The 'ConfirmPassword' field is required. | 400 |
| PASSWORD_MISMATCH | Senhas diferentes | Passwords do not match. | 400 |
| EMAIL_EXISTS | E-mail já cadastrado | The provided email is already in use. | 409 |
| USERNAME_EXISTS | Username já cadastrado | The provided username is already in use. | 409 |
| SERVER_ERROR | Erro interno | Error creating user. | 500 |

---

## 🔑 POST /login

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_EMAIL | Campo ausente | The 'Email' field is required. | 400 |
| INVALID_EMAIL | E-mail inválido | The provided email is not valid. | 400 |
| MISSING_PASSWORD | Campo ausente | The 'Password' field is required. | 400 |
| USER_NOT_FOUND | Usuário não encontrado | No user found with this email. | 404 |
| INVALID_PASSWORD | Senha incorreta | Incorrect password. | 401 |
| SERVER_ERROR | Erro interno | Error logging in. | 500 |

---

## ✉️ POST /forgot-password

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_EMAIL | Campo ausente | The 'Email' field is required. | 400 |
| INVALID_EMAIL | E-mail inválido | The provided email is not valid. | 400 |
| USER_NOT_FOUND | Usuário não encontrado | No user found with this email. | 404 |
| SERVER_ERROR | Erro interno | Error sending reset email. | 500 |

---

## 🔁 POST /reset-password

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_TOKEN | Campo ausente | The 'Token' field is required. | 400 |
| MISSING_NEW_PASSWORD | Campo ausente | The 'New Password' field is required. | 400 |
| MISSING_CONFIRM_PASSWORD | Campo ausente | The 'Confirm Password' field is required. | 400 |
| PASSWORD_MISMATCH | Senhas diferentes | Passwords do not match. | 400 |
| INVALID_TOKEN | Token inválido ou expirado | The provided token is invalid or expired. | 401 |
| USER_NOT_FOUND | Usuário não encontrado | User not found. | 404 |
| SERVER_ERROR | Erro interno | Error resetting password. | 500 |

---

## ✅ Códigos de Sucesso

| Código | Descrição | HTTP Status |
|:------:|------------|--------------|
| USER_CREATED_SUCCESS | Usuário criado com sucesso | 201 |
| LOGIN_SUCCESS | Login realizado com sucesso | 200 |
| RESET_EMAIL_SENT | E-mail de redefinição enviado | 200 |
| PASSWORD_RESET_SUCCESS | Senha redefinida com sucesso | 200 |

---

## 📨 Configuração de E-mail

Emails are sent via Nodemailer, using the service defined in EMAIL_SERVICE.
If using Gmail, app passwords must be enabled for the account.

---

## 🧑‍💻 Autor

**Eduardo Cardoso Agostinetti**  
📧 Developed for academic and learning purposes.
