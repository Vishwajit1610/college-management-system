import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const COURSES = [
   { code: "01CE1412", name: "Advanced Web Technology", faculty: "Prof. Kunal Khimani", credits: 4, attendance: 72 },
   { code: "01CE1305", name: "Operating Systems", faculty: "Prof. Kajal Tanchak", credits: 4, attendance: 80 },
   { code: "01CE1402", name: "Computer Networks", faculty: "Prof. Sweta Khatana", credits: 3, attendance: 88 },
   { code: "01CE1410", name: "Database Management", faculty: "Prof. Rupesh Kanojiya", credits: 4, attendance: 65 },
];

const RESULTS = [
   { subject: "Advanced Web Technology", mid: 26, ese: 44, total: 70, grade: "A" },
   { subject: "Operating Systems", mid: 22, ese: 38, total: 60, grade: "B" },
   { subject: "Computer Networks", mid: 28, ese: 46, total: 74, grade: "A+" },
   { subject: "Database Management", mid: 20, ese: 35, total: 55, grade: "B" },
];

const NOTICES = [
   { title: "AWT Project Frontend Submission Due", date: "20 Mar 2026", type: "Urgent" },
   { title: "Mid Semester Exam Schedule Released", date: "15 Mar 2026", type: "Exam" },
   { title: "Library Book Return Deadline", date: "25 Mar 2026", type: "General" },
   { title: "Sports Week Registration Open", date: "18 Mar 2026", type: "Event" },
];

const NAV = ["Overview", "Courses", "Attendance", "Results", "Notices"];

const f = {
   root: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#f9fafb" },
   sidebar: {
      width: "220px", background: "#fff", borderRight: "1px solid #e5e7eb",
      display: "flex", flexDirection: "column", flexShrink: 0,
   },
   sideTop: { padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0" },
   sideInst: { fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb" },
   sideTitle: { fontSize: "0.9rem", fontWeight: "600", color: "#111", marginTop: "0.15rem" },
   nav: { flex: 1, padding: "1rem 0.75rem" },
   navItem: (active) => ({
      display: "block", width: "100%", textAlign: "left", padding: "0.55rem 0.75rem",
      borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem",
      background: active ? "#eff6ff" : "transparent",
      color: active ? "#2563eb" : "#555",
      fontWeight: active ? "500" : "400",
      marginBottom: "2px",
   }),
   sideBot: { padding: "1rem 1.5rem", borderTop: "1px solid #f0f0f0" },
   userRole: { fontSize: "0.68rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" },
   userName: { fontSize: "0.85rem", fontWeight: "500", color: "#333", marginTop: "0.1rem" },
   logoutBtn: {
      marginTop: "0.6rem", width: "100%", padding: "0.45rem 0.75rem",
      border: "1px solid #e5e7eb", borderRadius: "6px", background: "transparent",
      color: "#888", fontSize: "0.78rem", cursor: "pointer", textAlign: "left",
   },
   main: { flex: 1, display: "flex", flexDirection: "column" },
   topbar: {
      background: "#fff", borderBottom: "1px solid #e5e7eb",
      padding: "0.9rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between",
   },
   topTitle: { fontSize: "1rem", fontWeight: "600", color: "#111" },
   topMeta: { fontSize: "0.78rem", color: "#aaa" },
   content: { padding: "2rem", flex: 1 },
   statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" },
   statBox: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.25rem" },
   statVal: { fontSize: "1.75rem", fontWeight: "700", color: "#111" },
   statLbl: { fontSize: "0.75rem", color: "#888", marginTop: "0.2rem" },
   sectionTitle: { fontSize: "0.85rem", fontWeight: "600", color: "#333", marginBottom: "0.75rem" },
   table: { width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" },
   th: { textAlign: "left", padding: "0.65rem 1rem", fontSize: "0.72rem", fontWeight: "600", color: "#888", borderBottom: "1px solid #e5e7eb", background: "#fafafa", textTransform: "uppercase", letterSpacing: "0.05em" },
   td: { padding: "0.75rem 1rem", fontSize: "0.83rem", color: "#444", borderBottom: "1px solid #f3f4f6" },
   row: { background: "#fff" },
   card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem 1.25rem", marginBottom: "0.5rem" },
   cardTitle: { fontSize: "0.88rem", fontWeight: "500", color: "#222" },
   cardMeta: { fontSize: "0.75rem", color: "#999", marginTop: "0.2rem" },
   progressWrap: { height: "4px", background: "#f0f0f0", borderRadius: "4px", marginTop: "0.6rem", overflow: "hidden" },
   badge: (type) => {
      const map = { Urgent: ["#fef2f2", "#dc2626"], Exam: ["#eff6ff", "#2563eb"], General: ["#f9fafb", "#888"], Event: ["#f0fdf4", "#16a34a"] };
      const [bg, color] = map[type] || ["#f9fafb", "#888"];
      return { background: bg, color, fontSize: "0.68rem", fontWeight: "600", padding: "0.15rem 0.5rem", borderRadius: "4px", letterSpacing: "0.04em" };
   },
   gradeColor: (g) => g === "A+" ? "#16a34a" : g === "A" ? "#2563eb" : "#888",
   noticeRow: { display: "flex", alignItems: "center", gap: "0.75rem", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "0.85rem 1.1rem", marginBottom: "0.5rem" },
   attendRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem 1.25rem", marginBottom: "0.5rem" },
};

export default function Dashboard() {
   const [active, setActive] = useState("Overview");
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem("token")) navigate("/");
   }, [navigate]);

   const logout = () => { localStorage.clear(); navigate("/"); };

   return (
      <div style={f.root}>
         <aside style={f.sidebar}>
            <div style={f.sideTop}>
               <div style={f.sideInst}>University</div>
               <div style={f.sideTitle}>Student Portal</div>
            </div>
            <nav style={f.nav}>
               {NAV.map(n => (
                  <button key={n} style={f.navItem(active === n)} onClick={() => setActive(n)}>{n}</button>
               ))}
            </nav>
            <div style={f.sideBot}>
               <div style={f.userRole}>Student · Sem 4</div>
               <div style={f.userName}>Computer Science Engineering</div>
               <button style={f.logoutBtn} onClick={logout}>Sign out</button>
            </div>
         </aside>

         <main style={f.main}>
            <div style={f.topbar}>
               <div style={f.topTitle}>{active}</div>
               <div style={f.topMeta}>Semester 4 &nbsp;·&nbsp; 2025–26</div>
            </div>
            <div style={f.content}>

               {active === "Overview" && (
                  <>
                     <div style={f.statsRow}>
                        {[["4", "Enrolled Courses"], ["76%", "Avg Attendance"], ["8.4", "CGPA"], ["2", "Pending Tasks"]].map(([v, l]) => (
                           <div key={l} style={f.statBox}>
                              <div style={f.statVal}>{v}</div>
                              <div style={f.statLbl}>{l}</div>
                           </div>
                        ))}
                     </div>
                     <div style={f.sectionTitle}>Recent Notices</div>
                     {NOTICES.slice(0, 3).map((n, i) => (
                        <div key={i} style={f.noticeRow}>
                           <span style={f.badge(n.type)}>{n.type}</span>
                           <span style={{ flex: 1, fontSize: "0.85rem", color: "#333" }}>{n.title}</span>
                           <span style={{ fontSize: "0.75rem", color: "#aaa" }}>{n.date}</span>
                        </div>
                     ))}
                  </>
               )}

               {active === "Courses" && (
                  <>
                     <div style={f.sectionTitle}>Enrolled Courses</div>
                     <table style={f.table}>
                        <thead>
                           <tr>
                              {["Code", "Course Name", "Faculty", "Credits"].map(h => <th key={h} style={f.th}>{h}</th>)}
                           </tr>
                        </thead>
                        <tbody>
                           {COURSES.map((c, i) => (
                              <tr key={i}>
                                 <td style={f.td}>{c.code}</td>
                                 <td style={f.td}>{c.name}</td>
                                 <td style={f.td}>{c.faculty}</td>
                                 <td style={f.td}>{c.credits}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </>
               )}

               {active === "Attendance" && (
                  <>
                     <div style={f.sectionTitle}>Attendance by Subject</div>
                     {COURSES.map((c, i) => (
                        <div key={i} style={f.attendRow}>
                           <div>
                              <div style={{ fontSize: "0.85rem", fontWeight: "500", color: "#222" }}>{c.name}</div>
                              <div style={{ fontSize: "0.73rem", color: "#aaa", marginTop: "0.15rem" }}>{c.code}</div>
                           </div>
                           <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "1rem", fontWeight: "600", color: c.attendance >= 75 ? "#16a34a" : "#dc2626" }}>
                                 {c.attendance}%
                              </div>
                              <div style={{ fontSize: "0.68rem", color: "#aaa" }}>{c.attendance >= 75 ? "Good" : "Low — attend more"}</div>
                           </div>
                        </div>
                     ))}
                  </>
               )}

               {active === "Results" && (
                  <>
                     <div style={f.sectionTitle}>Semester Results</div>
                     <table style={f.table}>
                        <thead>
                           <tr>
                              {["Subject", "Mid Sem /30", "End Sem /50", "Total /80", "Grade"].map(h => <th key={h} style={f.th}>{h}</th>)}
                           </tr>
                        </thead>
                        <tbody>
                           {RESULTS.map((r, i) => (
                              <tr key={i}>
                                 <td style={f.td}>{r.subject}</td>
                                 <td style={f.td}>{r.mid}</td>
                                 <td style={f.td}>{r.ese}</td>
                                 <td style={f.td}>{r.total}</td>
                                 <td style={{ ...f.td, fontWeight: "600", color: f.gradeColor(r.grade) }}>{r.grade}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </>
               )}

               {active === "Notices" && (
                  <>
                     <div style={f.sectionTitle}>All Notices</div>
                     {NOTICES.map((n, i) => (
                        <div key={i} style={f.noticeRow}>
                           <span style={f.badge(n.type)}>{n.type}</span>
                           <span style={{ flex: 1, fontSize: "0.85rem", color: "#333" }}>{n.title}</span>
                           <span style={{ fontSize: "0.75rem", color: "#aaa" }}>{n.date}</span>
                        </div>
                     ))}
                  </>
               )}

            </div>
         </main>
      </div>
   );
}
