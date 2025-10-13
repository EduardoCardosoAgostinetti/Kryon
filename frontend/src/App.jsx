import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./css/main.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Workouts from "./pages/Workouts";
import NewWorkout from "./pages/NewWorkout";
import Settings from "./pages/Settings";
import ActivateAccount from "./pages/ActivateAccount";



function App() {
  return (
    <Router>      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/activate-account" element={<ActivateAccount />} />

        {/* Rota protegida */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path="workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
          <Route path="new" element={<PrivateRoute><NewWorkout /></PrivateRoute> } />
          <Route path="settings" element={<Settings />} />
        </Route>
  
      </Routes>
    </Router>
  );
}

export default App;
