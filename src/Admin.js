import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { db } from './components/firebase';
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods

import StudentSection from "./components/StudentSection";
import FeesSection from "./components/FeesSection";
import NoticeBoard from "./components/NoticeBoard";
import AssignmentsSection from "./components/AssignmentsSection";
import AttendanceSection from "./components/AttendanceSection";
import TimeTableSection from "./components/TimeTableSection";
import ResultsSection from "./components/ResultsSection";
import ReportsSection from "./components/ReportsSection";
import ProfileSection from "./components/ProfileSection";
import "./admin.css";
import StudentAssignments from "./components/StudentAssignment";

const Admin = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalNotices, setTotalNotices] = useState(0); 
  const [totalFeesCollected, setTotalFeesCollected] = useState(0); 
  const [totalBalance, setTotalBalance] = useState(0); 
  const [totalResultsPublished, setTotalResultsPublished] = useState(0); 
  const [totalTimeTables, setTotalTimeTables] = useState(0); 
  const [activeMenu, setActiveMenu] = useState("dashboard"); // State for active menu item

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const studentsRef = collection(db, "students");
        const studentDocs = await getDocs(studentsRef);
        setTotalStudents(studentDocs.size);
      } catch (error) {
        console.error("Error fetching total students: ", error);
      }
    };

    const fetchTotalNotices = async () => {
      try {
        const noticesRef = collection(db, "notices");
        const noticeDocs = await getDocs(noticesRef);
        setTotalNotices(noticeDocs.size);
      } catch (error) {
        console.error("Error fetching total notices: ", error);
      }
    };

    const fetchFeesData = async () => {
      try {
        const feesRef = collection(db, "fees");
        const feeDocs = await getDocs(feesRef);
        
        let feesCollected = 0;
        let balance = 0;

        feeDocs.forEach((doc) => {
          const fee = doc.data();
          feesCollected += fee.paidAmount || 0;
          balance += fee.balanceAmount || 0;
        });

        setTotalFeesCollected(feesCollected); 
        setTotalBalance(balance); 
      } catch (error) {
        console.error("Error fetching fees data: ", error);
      }
    };

    const fetchResultsData = async () => {
      try {
        const resultsRef = collection(db, "results");
        const resultDocs = await getDocs(resultsRef);
        setTotalResultsPublished(resultDocs.size);
      } catch (error) {
        console.error("Error fetching results data: ", error);
      }
    };

    const fetchTimeTables = async () => {
      try {
        const timeTablesRef = collection(db, "timetables");
        const timeTableDocs = await getDocs(timeTablesRef);
        setTotalTimeTables(timeTableDocs.size);
      } catch (error) {
        console.error("Error fetching time tables: ", error);
      }
    };

    fetchTotalStudents();
    fetchTotalNotices();
    fetchFeesData();
    fetchResultsData(); 
    fetchTimeTables(); 
  }, []);

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu); // Set the active menu item
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin" onClick={() => handleMenuClick("dashboard")}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/students" onClick={() => handleMenuClick("students")}>
                Students
              </Link>
            </li>
            <li>
              <Link to="/admin/fees" onClick={() => handleMenuClick("fees")}>
                Fees
              </Link>
            </li>
            <li>
              <Link to="/admin/notice-board" onClick={() => handleMenuClick("notices")}>
                Notice Board
              </Link>
            </li>
            <li>
              <Link to="/admin/assignments" onClick={() => handleMenuClick("assignments")}>
                Assignments
              </Link>
            </li>
            <li>
              <Link to="/admin/attendance" onClick={() => handleMenuClick("attendance")}>
                Attendance
              </Link>
            </li>
            <li>
              <Link to="/admin/timetable" onClick={() => handleMenuClick("timetable")}>
                Time Table
              </Link>
            </li>
            <li>
              <Link to="/admin/results" onClick={() => handleMenuClick("results")}>
                Results
              </Link>
            </li>
            <li>
              <Link to="/admin/reports" onClick={() => handleMenuClick("reports")}>
                Reports
              </Link>
            </li>
            <li>
              <Link to="/admin/profile" onClick={() => handleMenuClick("profile")}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>

      <main className="admin-content">
        {activeMenu === "dashboard" && (
          <>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Total Students</h3>
                <p>{totalStudents}</p>
              </div>
              <div className="dashboard-card">
                <h3>Total Fees Collected</h3>
                <p>{totalFeesCollected}</p>
              </div>
              <div className="dashboard-card">
                <h3>Total Balance</h3>
                <p>{totalBalance}</p>
              </div>
              <div className="dashboard-card">
                <h3>New Notices</h3>
                <p>{totalNotices}</p>
              </div>
              <div className="dashboard-card">
                <h3>Results Published</h3>
                <p>{totalResultsPublished}</p>
              </div>
              <div className="dashboard-card">
                <h3>Time Tables</h3>
                <p>{totalTimeTables}</p>
              </div>
            </div>
          </>
        )}

        {/* Render other sections based on the active menu */}
        <Routes>
          <Route path="/students" element={<StudentSection />} />
          <Route path="/fees" element={<FeesSection />} />
          <Route path="/notice-board" element={<NoticeBoard />} />
          <Route path="/assignments" element={<StudentAssignments />} />
          <Route path="/attendance" element={<AttendanceSection />} /> 
          <Route path="/timetable" element={<TimeTableSection />} />
          <Route path="/results" element={<ResultsSection />} />
          <Route path="/reports" element={<ReportsSection />} />
          <Route path="/profile" element={<ProfileSection />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
