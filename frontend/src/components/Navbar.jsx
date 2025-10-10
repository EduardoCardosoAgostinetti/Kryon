import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";
import WhiteLogo from "../assets/LogoKryonWhite.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={WhiteLogo} alt="Kryon Logo" />
        </div>

        <div className={`links ${isOpen ? "open" : ""}`}>
          {!isLogged ? (
            <>
              <Link to="/" className="nav-btn">
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link to="/signin" className="nav-btn">
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>

              <Link to="/signup" className="nav-btn signup">
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/workouts" className="nav-btn">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

            </>
          )}
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

          .navbar .nav-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 6px;
            background-color: #444;
            color: white;
            text-decoration: none;
            transition: background 0.3s, transform 0.2s;
            border: none;
            cursor: pointer;
            font-size: 0.95rem;
          }

          .navbar .nav-btn:hover {
            background-color: #555;
            transform: translateY(-2px);
          }

          .navbar .nav-btn.signup {
            background-color: #ff7f50;
          }

          .navbar .nav-btn.signup:hover {
            background-color: #ff946b;
          }
                    
          .nav-btn svg {
            flex-shrink: 0;
          }

          .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
          }

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
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .links.open {
              display: flex;
            }

            .menu-toggle {
              display: block;
            }

            .nav-btn {
              justify-content: flex-start;
              width: 160px;
            }
          }
        `}
      </style>
    </>
  );
}

export default Navbar;
