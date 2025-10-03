import { useState } from "react";
import { Link } from "react-router-dom";
import WhiteLogo from "../assets/LogoKryonWhite.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={WhiteLogo} alt="Kryon Logo" />
        </div>
        <div className={`links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/signin" className="nav-btn">Sign In</Link>
          <Link to="/signup" className="nav-btn signup">Sign Up</Link>
        </div>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </nav>

      <style>
        {`
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: #282c34;
            color: white;
            position: relative;
          }

          .logo img {
            height: 50px;
            cursor: pointer;
          }

          .links {
            display: flex;
            gap: 10px;
          }

          .nav-btn {
            padding: 8px 16px;
            border-radius: 5px;
            background-color: #444;
            color: white;
            text-decoration: none;
            transition: background 0.3s;
          }

          .nav-btn:hover {
            background-color: #555;
          }

          .nav-btn.signup {
            background-color: #ff7f50;
          }

          .nav-btn.signup:hover {
            background-color: #ff946b;
          }

          .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
          }

          /* Responsivo */
          @media (max-width: 600px) {
            .links {
              display: none;
              flex-direction: column;
              gap: 10px;
              position: absolute;
              top: 60px;
              right: 20px;
              background-color: #282c34;
              padding: 10px;
              border-radius: 5px;
            }

            .links.open {
              display: flex;
            }

            .menu-toggle {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
}

export default Navbar;
