import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { db } from './components/firebase'; // Import your Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods

import StudentSection from "./components/StudentSection";
import FeesSection from "./components/FeesSection";
import NoticeBoard from "./components/NoticeBoard";
import AssignmentsSection from "./components/AssignmentsSection"; // Ensure this path is correct
import "./admin.css";

const Admin = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalNotices, setTotalNotices] = useState(0); // State to hold the number of notices
  const [totalFeesCollected, setTotalFeesCollected] = useState(0); // State to hold total fees
  const [totalBalance, setTotalBalance] = useState(0); // State to hold total balance

  const navigate = useNavigate(); // Add useNavigate for navigation

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const studentsRef = collection(db, "students"); // Reference to the students collection
        const studentDocs = await getDocs(studentsRef);
        setTotalStudents(studentDocs.size); // Get the size of the collection
      } catch (error) {
        console.error("Error fetching total students: ", error);
      }
    };

    const fetchTotalNotices = async () => {
      try {
        const noticesRef = collection(db, "notices"); // Reference to the notices collection
        const noticeDocs = await getDocs(noticesRef);
        setTotalNotices(noticeDocs.size); // Get the size of the collection
      } catch (error) {
        console.error("Error fetching total notices: ", error);
      }
    };

    const fetchFeesData = async () => {
      try {
        const feesRef = collection(db, "fees"); // Reference to the fees collection
        const feeDocs = await getDocs(feesRef);
        
        let feesCollected = 0;
        let balance = 0;

        feeDocs.forEach((doc) => {
          const fee = doc.data();
          feesCollected += fee.paidAmount || 0;
          balance += fee.balanceAmount || 0;
        });

        setTotalFeesCollected(feesCollected); // Set the total fees collected
        setTotalBalance(balance); // Set the total balance
      } catch (error) {
        console.error("Error fetching fees data: ", error);
      }
    };

    fetchTotalStudents();
    fetchTotalNotices();
    fetchFeesData();
  }, []);

  // Handle sign-out by navigating to login page
  const handleSignOut = () => {
    navigate("/login"); // Navigate to the login page on sign out
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/Admin/students">Students</Link></li>
            <li><Link to="/Admin/fees">Fees</Link></li>
            <li><Link to="/Admin/notice-board">Notice Board</Link></li>
            <li><Link to="/Admin/assignments">Assignments</Link></li> {/* Link for Assignments */}
          </ul>
        </nav>
        <button className="logout-button" onClick={handleSignOut}>Sign Out</button> {/* Sign out button */}
      </aside>

      <main className="admin-content">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Students</h3>
            <p>{totalStudents}</p> {/* Display total number of students */}
          </div>
          <div className="dashboard-card">
            <h3>Total Fees Collected</h3>
            <p>{totalFeesCollected}</p> {/* Display total fees collected */}
          </div>
          <div className="dashboard-card">
            <h3>Total Balance</h3>
            <p>{totalBalance}</p> {/* Display total balance */}
          </div>
          <div className="dashboard-card">
            <h3>New Notices</h3>
            <p>{totalNotices}</p> {/* Display total number of notices */}
          </div>
        </div>

        <Routes>
          
          <Route path="/students" element={<StudentSection />} />
          <Route path="/fees" element={<FeesSection />} />
          <Route path="/notice-board" element={<NoticeBoard />} />
          <Route path="/assignments" element={<AssignmentsSection />} /> {/* Route for Assignments */}
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
