import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const S = {
   page: {
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f5f5f5",
      fontFamily: "'Inter', system-ui, sans-serif", padding: "2rem 1rem",
   },
   card: {
      background: "#fff", border: "1px solid #e0e0e0",
      borderRadius: "8px", padding: "2.5rem", width: "100%", maxWidth: "420px",
   },
   logo: {
      fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#2563eb", marginBottom: "1.5rem",
   },
   title: { fontSize: "1.4rem", fontWeight: "600", color: "#111", marginBottom: "0.25rem" },
   sub: { fontSize: "0.85rem", color: "#888", marginBottom: "1.75rem" },
   label: { display: "block", fontSize: "0.78rem", fontWeight: "500", color: "#555", marginBottom: "0.35rem" },
   input: {
      width: "100%", padding: "0.6rem 0.75rem", fontSize: "0.88rem",
      border: "1px solid #d1d5db", borderRadius: "6px", outline: "none",
      background: "#fff", color: "#111", boxSizing: "border-box",
   },
   select: {
      width: "100%", padding: "0.6rem 0.75rem", fontSize: "0.88rem",
      border: "1px solid #d1d5db", borderRadius: "6px", outline: "none",
      background: "#fff", color: "#111", boxSizing: "border-box", appearance: "none",
   },
   inputErr: { borderColor: "#ef4444" },
   err: { fontSize: "0.72rem", color: "#ef4444", marginTop: "0.25rem" },
   group: { marginBottom: "1rem" },
   row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
   serverErr: {
      background: "#fef2f2", border: "1px solid #fecaca",
      color: "#dc2626", padding: "0.6rem 0.8rem", borderRadius: "6px",
      fontSize: "0.8rem", marginBottom: "1rem",
   },
   success: {
      background: "#f0fdf4", border: "1px solid #bbf7d0",
      color: "#16a34a", padding: "0.6rem 0.8rem", borderRadius: "6px",
      fontSize: "0.8rem", marginBottom: "1rem",
   },
   btn: {
      width: "100%", padding: "0.65rem", background: "#2563eb",
      color: "#fff", border: "none", borderRadius: "6px",
      fontSize: "0.88rem", fontWeight: "500", cursor: "pointer", marginTop: "0.25rem",
   },
   footer: { textAlign: "center", marginTop: "1.25rem", fontSize: "0.82rem", color: "#888" },
   link: { color: "#2563eb", textDecoration: "none", fontWeight: "500" },
   divider: { height: "1px", background: "#f0f0f0", margin: "0.25rem 0 1rem" },
};

export default function Signup() {
   const [form, setForm] = useState({ name: "", enrollmentNo: "", email: "", role: "student", password: "", confirmPassword: "" });
   const [errors, setErrors] = useState({});
   const [serverError, setServerError] = useState("");
   const [success, setSuccess] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

   const validate = () => {
      const e = {};
      if (!form.name.trim()) e.name = "Required";
      if (!form.enrollmentNo.trim()) e.enrollmentNo = "Required";
      if (!form.email) e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.password) e.password = "Required";
      else if (form.password.length < 6) e.password = "Min 6 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
      return e;
   };

   const handleSubmit = async (ev) => {
      ev.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({}); setServerError(""); setLoading(true);
      try {
         await axios.post("http://localhost:3000/signup", {
            name: form.name, email: form.email,
            password: form.password, role: form.role,
            enrollmentNo: form.enrollmentNo,
         });
         setSuccess("Account created! Redirecting...");
         setTimeout(() => navigate("/"), 1500);
      } catch (err) {
         setServerError(err.response?.data?.message || "Registration failed.");
      } finally { setLoading(false); }
   };

   return (
      <div style={S.page}>
         <div style={S.card}>
            <div style={S.logo}>University</div>
            <h1 style={S.title}>Create account</h1>
            <p style={S.sub}>Register to access the student portal</p>

            {serverError && <div style={S.serverErr}>{serverError}</div>}
            {success && <div style={S.success}>{success}</div>}

            <form onSubmit={handleSubmit} noValidate>
               <div style={S.row}>
                  <div style={S.group}>
                     <label style={S.label}>Full Name</label>
                     <input style={{ ...S.input, ...(errors.name ? S.inputErr : {}) }}
                        type="text" placeholder=""
                        value={form.name} onChange={e => set("name", e.target.value)} />
                     {errors.name && <div style={S.err}>{errors.name}</div>}
                  </div>
                  <div style={S.group}>
                     <label style={S.label}>Enrollment No.</label>
                     <input style={{ ...S.input, ...(errors.enrollmentNo ? S.inputErr : {}) }}
                        type="text" placeholder=""
                        value={form.enrollmentNo} onChange={e => set("enrollmentNo", e.target.value)} />
                     {errors.enrollmentNo && <div style={S.err}>{errors.enrollmentNo}</div>}
                  </div>
               </div>

               <div style={S.group}>
                  <label style={S.label}>Email</label>
                  <input style={{ ...S.input, ...(errors.email ? S.inputErr : {}) }}
                     type="email" placeholder="you@college.edu"
                     value={form.email} onChange={e => set("email", e.target.value)} />
                  {errors.email && <div style={S.err}>{errors.email}</div>}
               </div>

               <div style={S.group}>
                  <label style={S.label}>Role</label>
                  <select style={S.select} value={form.role} onChange={e => set("role", e.target.value)}>
                     <option value="student">Student</option>
                     <option value="faculty">Faculty</option>
                  </select>
               </div>

               <div style={S.row}>
                  <div style={S.group}>
                     <label style={S.label}>Password</label>
                     <input style={{ ...S.input, ...(errors.password ? S.inputErr : {}) }}
                        type="password" placeholder="••••••••"
                        value={form.password} onChange={e => set("password", e.target.value)} />
                     {errors.password && <div style={S.err}>{errors.password}</div>}
                  </div>
                  <div style={S.group}>
                     <label style={S.label}>Confirm Password</label>
                     <input style={{ ...S.input, ...(errors.confirmPassword ? S.inputErr : {}) }}
                        type="password" placeholder="••••••••"
                        value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
                     {errors.confirmPassword && <div style={S.err}>{errors.confirmPassword}</div>}
                  </div>
               </div>

               <button type="submit" style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
               </button>
            </form>

            <div style={S.footer}>
               Already have an account? <Link to="/" style={S.link}>Sign in</Link>
            </div>
         </div>
      </div>
   );
}
