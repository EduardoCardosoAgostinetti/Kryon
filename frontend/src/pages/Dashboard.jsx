import Navbar from "../components/Navbar";
import { Dumbbell, PlusCircle, Settings as SettingsIcon } from "lucide-react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-logo">Kryon</h2>
          <nav className="sidebar-nav">
            <a
              href="#"
              onClick={() => navigate("/kryon/dashboard/workouts")}
              className={currentPath.includes("workouts") ? "active" : ""}
            >
              <Dumbbell size={22} />
              <span>Workouts</span>
            </a>
            <a
              href="#"
              onClick={() => navigate("/kryon/dashboard/new")}
              className={currentPath.includes("new") ? "active" : ""}
            >
              <PlusCircle size={22} />
              <span>New Workout</span>
            </a>
            <a
              href="#"
              onClick={() => navigate("/kryon/dashboard/settings")}
              className={currentPath.includes("settings") ? "active" : ""}
            >
              <SettingsIcon size={22} />
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <button
          className={`bottom-btn ${currentPath.includes("workouts") ? "active" : ""}`}
          onClick={() => navigate("/kryon/dashboard/workouts")}
        >
          <Dumbbell size={24} />
          <span>Workouts</span>
        </button>
        <button
          className={`bottom-btn ${currentPath.includes("new") ? "active" : ""}`}
          onClick={() => navigate("/kryon/dashboard/new")}
        >
          <PlusCircle size={24} />
          <span>New</span>
        </button>
        <button
          className={`bottom-btn ${currentPath.includes("settings") ? "active" : ""}`}
          onClick={() => navigate("/kryon/dashboard/settings")}
        >
          <SettingsIcon size={24} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Inline CSS */}
      <style>
        {`
        .dashboard-page {
            background: #20232a;
            color: white;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .dashboard-wrapper {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
            background: #1c1f26;
            width: 250px;
            min-height: calc(100vh - 60px);
            display: flex;
            flex-direction: column;
            padding: 20px;
            border-right: 1px solid #333;
        }

        .sidebar-logo {
            color: #ff7f50;
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 30px;
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #ccc;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
            font-size: 1rem;
        }

        .sidebar-nav a:hover,
        .sidebar-nav a.active {
            color: #ff7f50;
        }

        .sidebar-nav a svg {
            flex-shrink: 0;
        }

        /* Bottom navbar */
        .bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            background-color: #1c1f26;
            justify-content: space-around;
            align-items: center;
            border-top: 2px solid #333;
            z-index: 10;
        }

        .bottom-nav .bottom-btn {
            background: none;
            border: none;
            color: #ccc;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            transition: color 0.2s, transform 0.2s;
        }

        .bottom-nav .bottom-btn:hover {
            color: #ff7f50;
            transform: translateY(-3px);
        }

        .bottom-nav .bottom-btn.active {
            color: #ff7f50;
        }

        /* Dashboard content */
        .dashboard-content {
            flex: 1;
            background: #41454eff;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 30px;
            overflow-y: auto;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }

        .dashboard-header h1 {
            font-size: 1.8rem;
            color: white;
        }

        /* Responsividade */
        @media (max-width: 900px) {
            .sidebar {
                display: none;
            }

            .bottom-nav {
                display: flex;
            }

            .dashboard-content {
                padding: 24px;
                padding-bottom: 100px;
            }
        }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
