import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function SignIn() {
  return (
    <div>
      <Navbar />
      <div className="signin-container">
        <div className="signin-card">
          <h2>Sign In</h2>

          <form
            className="signin-form"
            onSubmit={(e) => {
              e.preventDefault(); // prevent reload while testing
            }}
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="signin-links">
            <a href="#">Forgot your password?</a>
            <p>
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style>
        {`
        .signin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 20px;
          min-height: 70vh;
        }

        .signin-card {
          background: #282c34;
          padding: 36px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6);
          width: 100%;
          max-width: 420px;
          color: white;
        }

        .signin-card, .signin-card * {
          box-sizing: border-box;
        }

        .signin-card h2 {
          font-size: 2rem;
          margin: 0 0 18px;
          color: #ffffff;
          text-align: left;
        }

        .signin-form {
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
          background: #000000;
          color: #fff;
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

        .login-btn {
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

        .login-btn:hover {
          transform: translateY(-2px);
          background: #ff946b;
        }

        .signin-links {
          margin-top: 14px;
          font-size: 0.9rem;
          color: #ccc;
          text-align: left;
        }

        .signin-links a {
          color: #ff7f50;
          text-decoration: none;
        }

        .signin-links a:hover {
          text-decoration: underline;
          color: #ff946b;
        }

        @media (max-width: 600px) {
          .signin-card {
            padding: 24px;
            max-width: 360px;
          }
          .signin-card h2 {
            text-align: center;
          }
          .signin-links {
            text-align: center;
          }
        }
      `}
      </style>
    </div>
  );
}

export default SignIn;
