import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Terms() {
  return (
    <div>
      <Navbar />
      <div className="terms">
        <section className="terms-header">
          <h1>Terms of Use</h1>
          <p>
            Welcome to Kryon! By using our platform, you agree to the terms and
            conditions described below.
          </p>
        </section>

        <section className="terms-content">
          <div className="term-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Kryon, you agree to comply with these Terms
              of Use and all applicable laws and regulations. If you do not
              agree, please do not use the service.
            </p>
          </div>

          <div className="term-section">
            <h2>2. Platform Usage</h2>
            <p>
              Kryon is intended for workout and personal progress management.
              You agree to use the service ethically, avoiding any fraudulent,
              offensive, or harmful behavior toward others.
            </p>
          </div>

          <div className="term-section">
            <h2>3. User Account</h2>
            <p>
              To access certain features, you must create an account. You are
              responsible for maintaining the confidentiality of your login
              credentials and for all activities that occur under your account.
            </p>
          </div>

          <div className="term-section">
            <h2>5. Modifications</h2>
            <p>
              Kryon reserves the right to modify these Terms at any time. We
              will notify you of significant changes through the website or via
              email.
            </p>
          </div>

          <div className="term-section">
            <h2>6. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </section>

        <style>
          {`
          .terms {
            font-family: 'Arial', sans-serif;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
          }

          .terms-header {
            text-align: center;
            margin-bottom: 50px;
          }

          .terms-header h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #ff7f50;
          }

          .terms-header p {
            font-size: 1.1rem;
            color: #555;
          }

          .term-section {
            margin-bottom: 40px;
          }

          .term-section h2 {
            color: #ff7f50;
            font-size: 1.5rem;
            margin-bottom: 10px;
          }

          .term-section p {
            font-size: 1rem;
            color: #444;
          }

          a {
            color: #ff7f50;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .terms {
              padding: 20px;
            }

            .terms-header h1 {
              font-size: 2rem;
            }

            .term-section h2 {
              font-size: 1.3rem;
            }
          }
        `}
        </style>
      </div>
      <Footer />
    </div>
  );
}

export default Terms;
