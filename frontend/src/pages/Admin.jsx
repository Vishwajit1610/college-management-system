import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const INIT_STUDENTS = [
   { id: 1, name: "Arjun Patel", enrollment: "22BECE10045", sem: 4, cgpa: "8.9", status: "Active" },
   { id: 2, name: "Priya Shah", enrollment: "22BECE10046", sem: 4, cgpa: "9.2", status: "Active" },
   { id: 3, name: "Rohit Mehta", enrollment: "22BECE10047", sem: 4, cgpa: "7.5", status: "Active" },
   { id: 4, name: "Sneha Joshi", enrollment: "22BECE10048", sem: 4, cgpa: "8.1", status: "Active" },
   { id: 5, name: "Dev Trivedi", enrollment: "22BECE10049", sem: 4, cgpa: "6.8", status: "On Leave" },
];

const FACULTY = [
   { name: "Prof. Kunal Khimani", dept: "CE", subjects: "AWT, Web Development" },
   { name: "Prof. Kajal Tanchak", dept: "CE", subjects: "Operating Systems, DS" },
   { name: "Prof. Sweta Khatana", dept: "CE", subjects: "Computer Networks" },
   { name: "Prof. Rupesh Kanojiya", dept: "CE", subjects: "DBMS, SQL" },
   { name: "Prof. Charmy Vora", dept: "CE", subjects: "AWT, Security" },
];

const NAV = ["Overview", "Students", "Faculty", "Courses"];

const s = {
   root: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#f9fafb" },
   sidebar: { width: "220px", background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 },
   sideTop: { padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0" },
   sideInst: { fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb" },
   sideTitle: { fontSize: "0.9rem", fontWeight: "600", color: "#111", marginTop: "0.15rem" },
   adminTag: { display: "inline-block", marginTop: "0.4rem", fontSize: "0.65rem", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", background: "#111", padding: "0.15rem 0.5rem", borderRadius: "4px" },
   nav: { flex: 1, padding: "1rem 0.75rem" },
   navItem: (a) => ({
      display: "block", width: "100%", textAlign: "left", padding: "0.55rem 0.75rem",
      borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem",
      background: a ? "#eff6ff" : "transparent", color: a ? "#2563eb" : "#555",
      fontWeight: a ? "500" : "400", marginBottom: "2px",
   }),
   sideBot: { padding: "1rem 1.5rem", borderTop: "1px solid #f0f0f0" },
   logoutBtn: { marginTop: "0.5rem", width: "100%", padding: "0.45rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: "6px", background: "transparent", color: "#888", fontSize: "0.78rem", cursor: "pointer", textAlign: "left" },
   main: { flex: 1, display: "flex", flexDirection: "column" },
   topbar: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0.9rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" },
   topTitle: { fontSize: "1rem", fontWeight: "600", color: "#111" },
   topMeta: { fontSize: "0.78rem", color: "#aaa" },
   content: { padding: "2rem", flex: 1 },
   statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" },
   statBox: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.25rem" },
   statVal: { fontSize: "1.75rem", fontWeight: "700", color: "#111" },
   statLbl: { fontSize: "0.75rem", color: "#888", marginTop: "0.2rem" },
   sectionTitle: { fontSize: "0.85rem", fontWeight: "600", color: "#333", marginBottom: "0.75rem" },
   toolbar: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", justifyContent: "space-between" },
   searchInput: { padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.82rem", outline: "none", color: "#333", width: "220px" },
   addBtn: { padding: "0.5rem 0.9rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.82rem", fontWeight: "500", cursor: "pointer" },
   table: { width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" },
   th: { textAlign: "left", padding: "0.65rem 1rem", fontSize: "0.72rem", fontWeight: "600", color: "#888", borderBottom: "1px solid #e5e7eb", background: "#fafafa", textTransform: "uppercase", letterSpacing: "0.05em" },
   td: { padding: "0.75rem 1rem", fontSize: "0.83rem", color: "#444", borderBottom: "1px solid #f3f4f6" },
   delBtn: { padding: "0.25rem 0.6rem", border: "1px solid #fecaca", borderRadius: "5px", background: "#fef2f2", color: "#dc2626", fontSize: "0.72rem", cursor: "pointer" },
   statusPill: (s) => ({
      display: "inline-block", padding: "0.15rem 0.55rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "500",
      background: s === "Active" ? "#f0fdf4" : "#fffbeb",
      color: s === "Active" ? "#16a34a" : "#d97706",
   }),
   // Modal
   overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
   modal: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.75rem", width: "100%", maxWidth: "360px" },
   modalTitle: { fontSize: "1rem", fontWeight: "600", color: "#111", marginBottom: "1.25rem" },
   label: { display: "block", fontSize: "0.75rem", fontWeight: "500", color: "#555", marginBottom: "0.3rem" },
   input: { width: "100%", padding: "0.55rem 0.7rem", fontSize: "0.85rem", border: "1px solid #d1d5db", borderRadius: "6px", outline: "none", boxSizing: "border-box", color: "#111" },
   inputErr: { borderColor: "#ef4444" },
   err: { fontSize: "0.7rem", color: "#ef4444", marginTop: "0.2rem" },
   fgroup: { marginBottom: "0.9rem" },
   modalActions: { display: "flex", gap: "0.6rem", marginTop: "1.25rem" },
   confirmBtn: { flex: 1, padding: "0.6rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" },
   cancelBtn: { flex: 1, padding: "0.6rem", background: "transparent", color: "#888", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" },
};

export default function Admin() {
   const [active, setActive] = useState("Overview");
   const [students, setStudents] = useState(INIT_STUDENTS);
   const [search, setSearch] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [newS, setNewS] = useState({ name: "", enrollment: "", sem: "4" });
   const [fErr, setFErr] = useState({});
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem("token")) navigate("/");
   }, [navigate]);

   const logout = () => { localStorage.clear(); navigate("/"); };

   const filtered = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(search.toLowerCase())
   );

   const validateAdd = () => {
      const e = {};
      if (!newS.name.trim()) e.name = "Required";
      if (!newS.enrollment.trim()) e.enrollment = "Required";
      return e;
   };

   const addStudent = (ev) => {
      ev.preventDefault();
      const e = validateAdd();
      if (Object.keys(e).length) { setFErr(e); return; }
      setStudents(p => [...p, { id: Date.now(), name: newS.name, enrollment: newS.enrollment, sem: parseInt(newS.sem), cgpa: "—", status: "Active" }]);
      setNewS({ name: "", enrollment: "", sem: "4" });
      setShowModal(false); setFErr({});
   };

   const deleteStudent = (id) => setStudents(p => p.filter(s => s.id !== id));

   return (
      <div style={s.root}>
         <aside style={s.sidebar}>
            <div style={s.sideTop}>
               <div style={s.sideInst}>University</div>
               <div style={s.sideTitle}>Admin Panel</div>
               <div style={s.adminTag}>Administrator</div>
            </div>
            <nav style={s.nav}>
               {NAV.map(n => (
                  <button key={n} style={s.navItem(active === n)} onClick={() => setActive(n)}>{n}</button>
               ))}
            </nav>
            <div style={s.sideBot}>
               <div style={{ fontSize: "0.75rem", color: "#888" }}>Logged in as Admin</div>
               <button style={s.logoutBtn} onClick={logout}>Sign out</button>
            </div>
         </aside>

         <main style={s.main}>
            <div style={s.topbar}>
               <div style={s.topTitle}>{active}</div>
               <div style={s.topMeta}>2025–26 &nbsp;·&nbsp; Computer Science Engineering</div>
            </div>
            <div style={s.content}>

               {active === "Overview" && (
                  <>
                     <div style={s.statsRow}>
                        {[[students.length, "Total Students"], [FACULTY.length, "Faculty Members"], ["4", "Active Courses"], ["1", "Department"]].map(([v, l]) => (
                           <div key={l} style={s.statBox}>
                              <div style={s.statVal}>{v}</div>
                              <div style={s.statLbl}>{l}</div>
                           </div>
                        ))}
                     </div>
                     <div style={s.sectionTitle}>Student List</div>
                     <table style={s.table}>
                        <thead><tr>{["Name", "Enrollment", "Sem", "Status"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                        <tbody>
                           {students.slice(0, 4).map(st => (
                              <tr key={st.id}>
                                 <td style={s.td}>{st.name}</td>
                                 <td style={s.td}>{st.enrollment}</td>
                                 <td style={s.td}>{st.sem}</td>
                                 <td style={s.td}><span style={s.statusPill(st.status)}>{st.status}</span></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </>
               )}

               {active === "Students" && (
                  <>
                     <div style={s.toolbar}>
                        <div style={s.sectionTitle} >Manage Students</div>
                        <div style={{ display: "flex", gap: "0.6rem" }}>
                           <input style={s.searchInput} placeholder="Search by name or enrollment..."
                              value={search} onChange={e => setSearch(e.target.value)} />
                           <button style={s.addBtn} onClick={() => setShowModal(true)}>+ Add Student</button>
                        </div>
                     </div>
                     <table style={s.table}>
                        <thead><tr>{["#", "Name", "Enrollment", "Sem", "CGPA", "Status", "Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                        <tbody>
                           {filtered.map((st, i) => (
                              <tr key={st.id}>
                                 <td style={s.td}>{i + 1}</td>
                                 <td style={s.td}>{st.name}</td>
                                 <td style={s.td}>{st.enrollment}</td>
                                 <td style={s.td}>{st.sem}</td>
                                 <td style={s.td}>{st.cgpa}</td>
                                 <td style={s.td}><span style={s.statusPill(st.status)}>{st.status}</span></td>
                                 <td style={s.td}><button style={s.delBtn} onClick={() => deleteStudent(st.id)}>Remove</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </>
               )}

               {active === "Faculty" && (
                  <>
                     <div style={s.sectionTitle}>Faculty Members</div>
                     <table style={s.table}>
                        <thead><tr>{["Name", "Department", "Subjects"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                        <tbody>
                           {FACULTY.map((f, i) => (
                              <tr key={i}>
                                 <td style={s.td}>{f.name}</td>
                                 <td style={s.td}>{f.dept}</td>
                                 <td style={s.td}>{f.subjects}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </>
               )}

               {active === "Courses" && (
                  <>
                     <div style={s.sectionTitle}>Active Courses</div>
                     <table style={s.table}>
                        <thead><tr>{["Code", "Course Name", "Credits", "Semester", "Enrolled"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                        <tbody>
                           {[
                              ["01CE1412", "Advanced Web Technology", 4, 4, 42],
                              ["01CE1305", "Operating Systems", 4, 3, 38],
                              ["01CE1402", "Computer Networks", 3, 4, 40],
                              ["01CE1410", "Database Management", 4, 3, 45],
                           ].map(([code, name, cr, sem, enr]) => (
                              <tr key={code}>
                                 <td style={s.td}>{code}</td>
                                 <td style={s.td}>{name}</td>
                                 <td style={s.td}>{cr}</td>
                                 <td style={s.td}>{sem}</td>
                                 <td style={s.td}>{enr}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </>
               )}

            </div>
         </main>

         {showModal && (
            <div style={s.overlay} onClick={() => setShowModal(false)}>
               <div style={s.modal} onClick={e => e.stopPropagation()}>
                  <div style={s.modalTitle}>Add New Student</div>
                  <form onSubmit={addStudent} noValidate>
                     <div style={s.fgroup}>
                        <label style={s.label}>Full Name</label>
                        <input style={{ ...s.input, ...(fErr.name ? s.inputErr : {}) }}
                           type="text" placeholder="Student Name"
                           value={newS.name} onChange={e => setNewS(p => ({ ...p, name: e.target.value }))} />
                        {fErr.name && <div style={s.err}>{fErr.name}</div>}
                     </div>
                     <div style={s.fgroup}>
                        <label style={s.label}>Enrollment Number</label>
                        <input style={{ ...s.input, ...(fErr.enrollment ? s.inputErr : {}) }}
                           type="text" placeholder="22BECE10000"
                           value={newS.enrollment} onChange={e => setNewS(p => ({ ...p, enrollment: e.target.value }))} />
                        {fErr.enrollment && <div style={s.err}>{fErr.enrollment}</div>}
                     </div>
                     <div style={s.fgroup}>
                        <label style={s.label}>Semester</label>
                        <select style={s.input} value={newS.sem} onChange={e => setNewS(p => ({ ...p, sem: e.target.value }))}>
                           {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                        </select>
                     </div>
                     <div style={s.modalActions}>
                        <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" style={s.confirmBtn}>Add Student</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
