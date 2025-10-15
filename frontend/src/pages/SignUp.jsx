import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Alerts from "../components/Alerts";
import Loading from "../components/Loading";

function SignUp() {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.name.value.trim();
    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target["confirm-password"].value;
    const terms = e.target.terms.checked;

    if (!terms) {
      setAlert({ type: "error", message: "You must accept the terms of use." });
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/user/register", {
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      setAlert({ type: "success", message: data.message });
      console.log(data);
    } catch (error) {
      if (error.response) {
        setAlert({ type: "error", message: error.response.data.message });
        console.log(error.response.data);
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
      {loading && <Loading message="Creating your account..." />}
      {alert.message && (
        <Alerts
          type={alert.type}
          message={alert.message}
          onClose={() => {
            setAlert({ type: "", message: "" });
            if (alert.type === "success") navigate("/kryon/signin");
          }}
        />
      )}

      <div className="signup-container">
        <div className="signup-card">
          <h2>Create Account</h2>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" placeholder="Enter your full name" />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" placeholder="Enter your username" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            <div className="form-check">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I accept the <a href="#">terms of use</a>.
              </label>
            </div>

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>

          <div className="signup-links">
            <p>
              Already have an account? <a href="/kryon/signin">Sign In</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style>
        {`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 20px;
          min-height: 70vh;
        }

        .signup-card {
          background: #282c34;
          padding: 36px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6);
          width: 100%;
          max-width: 480px;
          color: white;
        }

        .signup-card, .signup-card * {
          box-sizing: border-box;
        }

        .signup-card h2 {
          font-size: 2rem;
          margin: 0 0 18px;
          color: #ffffff;
          text-align: left;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: stretch;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
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
          background: #ffffffff;
          color: #000000ff;
          font-size: 1rem;
        }

        .form-group input::placeholder {
          color: #9b9b9b;
        }

        .form-group input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,127,80,0.12);
          border-color: #ff7f50;
        }

        .form-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #ccc;
        }

        .form-check input {
          accent-color: #ff7f50;
        }

        .form-check a {
          color: #ff7f50;
          text-decoration: none;
        }

        .form-check a:hover {
          text-decoration: underline;
          color: #ff946b;
        }

        .signup-btn {
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

        .signup-btn:hover {
          transform: translateY(-2px);
          background: #ff946b;
        }

        .signup-links {
          margin-top: 14px;
          font-size: 0.9rem;
          color: #ccc;
          text-align: left;
        }

        .signup-links a {
          color: #ff7f50;
          text-decoration: none;
        }

        .signup-links a:hover {
          text-decoration: underline;
          color: #ff946b;
        }

        @media (max-width: 600px) {
          .signup-card {
            padding: 24px;
            max-width: 360px;
          }
          .signup-card h2 {
            text-align: center;
          }
          .signup-links {
            text-align: center;
          }
        }
      `}
      </style>
    </div>
  );
}

export default SignUp;
