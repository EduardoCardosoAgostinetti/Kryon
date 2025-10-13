import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      {/* Seções do footer */}
      <div className="footer-sections">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

        <div className="footer-section">
          <h3>Features</h3>
          <p>Personalized Workouts</p>
          <p>Motivational Tips</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </div>

      {/* Barra dividindo as seções do copyright */}
      <div className="footer-divider"></div>

      {/* Copyright */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Kryon. All rights reserved.
      </div>

      <style>
        {`
          .footer {
            background-color: #282c34;
            color: white;
            padding: 40px 20px 20px 20px;
            font-family: Arial, sans-serif;
          }

          .footer-sections {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 20px;
          }

          .footer-section h3 {
            margin-bottom: 15px;
          }

          .footer-section a,
          .footer-section p {
            display: block;
            color: white;
            text-decoration: none;
            margin-bottom: 8px;
            transition: color 0.3s;
          }

          .footer-section a:hover {
            color: #ff7f50;
          }

          /* Barra divisória */
          .footer-divider {
            width: 100%;
            height: 1px;
            background-color: #444;
            margin-bottom: 20px;
          }

          .footer-bottom {
            text-align: center;
            font-size: 0.9rem;
            color: #ccc;
          }

          @media (max-width: 768px) {
            .footer-sections {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;
