import { useAuth } from "../context/authcontext.jsx";

export default function Userbanner() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "16px", fontFamily: "sans-serif", color: "#fff" }}>
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "16px", fontFamily: "sans-serif", color: "red" }}>
        No user info available.
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif", color: "#fff", background: "#1e1e1e" }}>
      <div style={{ fontSize: "18px", fontWeight: "600" }}>
        Welcome, {user.username || "User"}
      </div>

      <div style={{ fontSize: "14px", opacity: 0.8 }}>
        {user.email}
      </div>

      <div style={{ fontSize: "14px", marginTop: "8px" }}>
        Age: {user.age ?? "N/A"} | BMI: {user.BMI ?? "N/A"} | Calories: {user.calories ?? "N/A"}
      </div>

      <div style={{ fontSize: "14px", marginTop: "8px" }}>
        Admin: {user.isAdmin ? "Yes ✅" : "No ❌"}
      </div>
    </div>
  );
}
