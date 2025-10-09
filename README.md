# Kryon

O aplicativo Kryon é a ferramenta ideal para quem deseja organizar e acompanhar seus treinos de forma prática e eficiente. Com ele, você pode criar novas fichas de treino, registrando exercícios, séries, repetições e cargas utilizadas. Cada ficha é salva automaticamente, garantindo que seu histórico de treinos esteja sempre acessível e seguro.

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
| MISSING_FULLNAME | Missing field | The 'Full Name' field is required. | 400 |
| MISSING_USERNAME | Missing field | The 'Username' field is required. | 400 |
| MISSING_EMAIL | Missing field | The 'Email' field is required. | 400 |
| INVALID_EMAIL | Invalid email | The provided email is not valid. | 400 |
| MISSING_PASSWORD | Missing field | The 'Password' field is required. | 400 |
| MISSING_CONFIRM_PASSWORD | Missing field | The 'ConfirmPassword' field is required. | 400 |
| PASSWORD_MISMATCH | Passwords do not match | Passwords do not match. | 400 |
| EMAIL_EXISTS | Email already exists | The provided email is already in use. | 409 |
| USERNAME_EXISTS | Username already exists | The provided username is already in use. | 409 |
| SERVER_ERROR | Internal error | Error creating user. | 500 |

---

## 🔑 POST /login

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_EMAIL | Missing field | The 'Email' field is required. | 400 |
| INVALID_EMAIL | Invalid email | The provided email is not valid. | 400 |
| MISSING_PASSWORD | Missing field | The 'Password' field is required. | 400 |
| USER_NOT_FOUND | User not found | No user found with this email. | 404 |
| INVALID_PASSWORD | Incorrect password | Incorrect password. | 401 |
| SERVER_ERROR | Internal error | Error logging in. | 500 |

---

## ✉️ POST /forgot-password

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_EMAIL | Missing field | The 'Email' field is required. | 400 |
| INVALID_EMAIL | Invalid email | The provided email is not valid. | 400 |
| USER_NOT_FOUND | User not found | No user found with this email. | 404 |
| SERVER_ERROR | Internal error | Error sending reset email. | 500 |

---

## 🔁 POST /reset-password

| Código | Tipo de Erro | Mensagem | HTTP Status |
|:------:|---------------|-----------|--------------|
| MISSING_TOKEN | Missing field | The 'Token' field is required. | 400 |
| MISSING_NEW_PASSWORD | Missing field | The 'New Password' field is required. | 400 |
| MISSING_CONFIRM_PASSWORD | Missing field | The 'Confirm Password' field is required. | 400 |
| PASSWORD_MISMATCH | Passwords do not match | Passwords do not match. | 400 |
| INVALID_TOKEN | Invalid or expired token | The provided token is invalid or expired. | 401 |
| USER_NOT_FOUND | User not found | User not found. | 404 |
| SERVER_ERROR | Internal error | Error resetting password. | 500 |

---

## ✅ Códigos de Sucesso

| Código | Descrição | HTTP Status |
|:------:|------------|--------------|
| USER_CREATED_SUCCESS | User created successfully| 201 |
| LOGIN_SUCCESS | Login successful| 200 |
| RESET_EMAIL_SENT | Password reset email sent | 200 |
| PASSWORD_RESET_SUCCESS | Password reset successfully | 200 |

---

## 📨 Configuração de E-mail

Emails are sent via Nodemailer, using the service defined in EMAIL_SERVICE.
If using Gmail, app passwords must be enabled for the account.

---

## 🧑‍💻 Autor

**Eduardo Cardoso Agostinetti**  
📧 Developed for academic and learning purposes.
