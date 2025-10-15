import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Alerts from "../components/Alerts";
import Loading from "../components/Loading";

function ForgotPassword() {
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();

        if (!email) {
            setAlert({ type: "error", message: "Please enter your email." });
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/user/forgot-password", { email });

            setAlert({ type: "success", message: data.message });


        } catch (error) {
            if (error.response) {
                setAlert({ type: "error", message: error.response.data.message });
            } else {
                setAlert({ type: "error", message: "Server connection error." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            {loading && <Loading message="Sending reset code..." />}
            {alert.message && (
                <Alerts
                    type={alert.type}
                    message={alert.message}
                    onClose={() => {
                        if (alert.type === "success") {
                            navigate("/kryon/signin"); // redireciona após sucesso
                        }
                        setAlert({ type: "", message: "" });
                    }}
                />
            )}

            <div className="forgot-container">
                <div className="forgot-card">
                    <h2>Forgot Password</h2>
                    <p className="forgot-description">
                        Enter your email address and we’ll send you a verification code to reset your password.
                    </p>

                    <form className="forgot-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Enter your email" />
                        </div>

                        <button type="submit" className="send-btn">
                            Send Code
                        </button>
                    </form>

                    <div className="forgot-links">
                        <a href="/kryon/signin">Back to Sign In</a>
                    </div>
                </div>
            </div>

            <Footer />

            <style>
                {`
.forgot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  min-height: 70vh;
}

.forgot-card {
  background: #282c34;
  padding: 36px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  width: 100%;
  max-width: 420px;
  color: white;
  box-sizing: border-box;
}

.forgot-card * {
  box-sizing: border-box;
}

.forgot-card h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ffffff;
}

.forgot-description {
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 20px;
  line-height: 1.4;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: stretch;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-group label {
  font-weight: 600;
  color: #ddd;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #3a3a3f;
  background: #fff;
  color: #000;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #9b9b9b;
}

.form-group input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,127,80,0.12);
  border-color: #ff7f50;
}

.send-btn {
  display: inline-block;
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  background: #ff7f50;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease;
}

.send-btn:hover {
  transform: translateY(-2px);
  background: #ff946b;
}

.forgot-links {
  margin-top: 16px;
  text-align: center;
}

.forgot-links a {
  color: #ff7f50;
  text-decoration: none;
  font-weight: 500;
}

.forgot-links a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .forgot-card {
    padding: 24px;
    max-width: 360px;
  }
  .forgot-card h2,
  .forgot-description {
    text-align: center;
  }
}
`}
            </style>

        </div>
    );
}

export default ForgotPassword;
