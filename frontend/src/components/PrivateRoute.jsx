import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Se não tiver token, redireciona para o login
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Caso tenha token, renderiza o componente normalmente
  return children;
}

export default PrivateRoute;
