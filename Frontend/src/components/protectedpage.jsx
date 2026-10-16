import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  // still checking token/user
  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", fontFamily: "sans-serif", background: "#000", minHeight: "100vh" }}>
        Checking session...
      </div>
    );
  }

  // not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // admin-only route but user isn't admin
  if (requireAdmin && !user.isAdmin) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif", background: "#000", color: "red", minHeight: "100vh" }}>
        You are not allowed to view this page.
      </div>
    );
  }

  // allowed
  return children;
}
