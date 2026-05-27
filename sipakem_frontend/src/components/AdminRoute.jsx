import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // belum login
  if (!user) {
    return <Navigate to="/" />;
  }

  // bukan admin
  if (user.role !== "admin") {
    return <Navigate to="/beranda" />;
  }

  return children;
}

export default AdminRoute;
