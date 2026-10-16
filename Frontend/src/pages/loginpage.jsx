import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3500/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // save token
    localStorage.setItem("token", data.token);

    // update context immediately
    login(data.token, data.user);

    // go to dashboard
    navigate("/dashboard");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#111",
      color: "#fff",
      fontFamily: "sans-serif"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1e1e1e",
          padding: "24px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "320px",
          display: "grid",
          gap: "12px",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>Login</h2>

        <label style={{ fontSize: "14px" }}>
          Email
          <input
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#2a2a2a",
              color: "#fff",
              marginTop: "4px"
            }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label style={{ fontSize: "14px" }}>
          Password
          <input
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#2a2a2a",
              color: "#fff",
              marginTop: "4px"
            }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          style={{
            marginTop: "8px",
            background: "#2563eb",
            border: "none",
            borderRadius: "4px",
            padding: "10px",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
