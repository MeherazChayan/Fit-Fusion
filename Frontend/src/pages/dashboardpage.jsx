import Userbanner from "../components/userbanner.jsx";

export default function Dashboard() {
  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
      <Userbanner />

      <div style={{ padding: "16px" }}>
        <h2 style={{ marginTop: "16px" }}>Your dashboard</h2>
        <p style={{ opacity: 0.8, fontSize: "14px" }}>
          You're logged in. If you made yourself admin in MongoDB (isAdmin: true), you'll see Admin: Yes ✅ in the banner.
        </p>
      </div>
    </div>
  );
}
