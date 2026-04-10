import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const S = {
   page: {
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f5f5f5",
      fontFamily: "'Inter', system-ui, sans-serif",
   },
   card: {
      background: "#fff", border: "1px solid #e0e0e0",
      borderRadius: "8px", padding: "2.5rem", width: "100%", maxWidth: "380px",
   },
   logo: {
      fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#2563eb", marginBottom: "1.5rem",
   },
   title: {
      fontSize: "1.4rem", fontWeight: "600", color: "#111",
      marginBottom: "0.25rem",
   },
   sub: { fontSize: "0.85rem", color: "#888", marginBottom: "1.75rem" },
   label: {
      display: "block", fontSize: "0.78rem", fontWeight: "500",
      color: "#555", marginBottom: "0.35rem",
   },
   input: {
      width: "100%", padding: "0.6rem 0.75rem", fontSize: "0.88rem",
      border: "1px solid #d1d5db", borderRadius: "6px", outline: "none",
      background: "#fff", color: "#111", boxSizing: "border-box",
      transition: "border-color 0.15s",
   },
   inputErr: { borderColor: "#ef4444" },
   err: { fontSize: "0.72rem", color: "#ef4444", marginTop: "0.25rem" },
   group: { marginBottom: "1rem" },
   serverErr: {
      background: "#fef2f2", border: "1px solid #fecaca",
      color: "#dc2626", padding: "0.6rem 0.8rem", borderRadius: "6px",
      fontSize: "0.8rem", marginBottom: "1rem",
   },
   btn: {
      width: "100%", padding: "0.65rem", background: "#2563eb",
      color: "#fff", border: "none", borderRadius: "6px",
      fontSize: "0.88rem", fontWeight: "500", cursor: "pointer",
      marginTop: "0.25rem",
   },
   footer: {
      textAlign: "center", marginTop: "1.25rem",
      fontSize: "0.82rem", color: "#888",
   },
   link: { color: "#2563eb", textDecoration: "none", fontWeight: "500" },
};

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errors, setErrors] = useState({});
   const [serverError, setServerError] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const validate = () => {
      const e = {};
      if (!email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
      if (!password) e.password = "Password is required";
      else if (password.length < 6) e.password = "Minimum 6 characters";
      return e;
   };

   const handleLogin = async (ev) => {
      ev.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({}); setServerError(""); setLoading(true);
      try {
         const res = await axios.post("https://college-management-system-ljbm.onrender.com/login", { email, password });
         localStorage.setItem("token", res.data.token);
         localStorage.setItem("role", res.data.role);
         res.data.role === "admin" ? navigate("/admin") : navigate("/dashboard");
      } catch (err) {
         setServerError(err.response?.data?.message || "Login failed. Try again.");
      } finally { setLoading(false); }
   };

   return (
      <div style={S.page}>
         <div style={S.card}>
            <div style={S.logo}>University</div>
            <h1 style={S.title}>Sign in</h1>
            <p style={S.sub}>College Management System</p>

            {serverError && <div style={S.serverErr}>{serverError}</div>}

            <form onSubmit={handleLogin} noValidate>
               <div style={S.group}>
                  <label style={S.label}>Email</label>
                  <input style={{ ...S.input, ...(errors.email ? S.inputErr : {}) }}
                     type="email" placeholder="you@college.edu"
                     value={email} onChange={e => setEmail(e.target.value)} />
                  {errors.email && <div style={S.err}>{errors.email}</div>}
               </div>
               <div style={S.group}>
                  <label style={S.label}>Password</label>
                  <input style={{ ...S.input, ...(errors.password ? S.inputErr : {}) }}
                     type="password" placeholder="••••••••"
                     value={password} onChange={e => setPassword(e.target.value)} />
                  {errors.password && <div style={S.err}>{errors.password}</div>}
               </div>
               <button type="submit" style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
               </button>
            </form>

            <div style={S.footer}>
               No account? <Link to="/signup" style={S.link}>Create one</Link>
            </div>
         </div>
      </div>
   );
}
