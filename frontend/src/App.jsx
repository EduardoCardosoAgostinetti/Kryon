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
import Terms from "./pages/Terms";



function App() {
  return (
    <Router>      
      <Routes>
        <Route path="/kryon/home" element={<Home />} />
        <Route path="/kryon/signin" element={<SignIn />} />
        <Route path="/kryon/signup" element={<SignUp />} />
        <Route path="/kryon/forgot-password" element={<ForgotPassword />} />
        <Route path="/kryon/reset-password" element={<ResetPassword />} />
        <Route path="/kryon/activate-account" element={<ActivateAccount />} />
        <Route path="/kryon/terms" element={<Terms />} />

        {/* Rota protegida */}
        <Route path="/kryon/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path="workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
          <Route path="new" element={<PrivateRoute><NewWorkout /></PrivateRoute> } />
          <Route path="settings" element={<Settings />} />
        </Route>
  
      </Routes>
    </Router>
  );
}

export default App;
