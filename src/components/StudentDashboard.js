import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import "./studentDashboard.css";

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const studentId = state?.studentId;
  const studentName = state?.studentName;

  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    class: "",
    roll: "",
    section: "",
  });
  const [notices, setNotices] = useState([]);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [feesData, setFeesData] = useState([]);
  const [showFeesDetails, setShowFeesDetails] = useState(false);
  const [assignments, setAssignments] = useState([]); // State to store assignments
  const [attendanceCount, setAttendanceCount] = useState(0); // State to store attendance count

  // Fetch student details from Firestore
  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentId) {
        try {
          const studentRef = doc(db, "students", studentId);
          const studentDoc = await getDoc(studentRef);

          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            setStudentInfo({
              class: studentData.class || "N/A",
              roll: studentData.roll || "N/A",
              section: studentData.section || "N/A",
            });
          } else {
            console.error("No student found with this ID:", studentId);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Invalid or missing studentId");
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Fetch fees data (filtered by studentId)
  useEffect(() => {
    const fetchFeesData = async () => {
      if (studentId) {
        try {
          const q = query(collection(db, "fees"), where("studentId", "==", studentId)); // Filter by studentId
          const querySnapshot = await getDocs(q);

          const fees = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setFeesData(fees);
          const totalBalance = fees.reduce((sum, fee) => sum + (fee.balanceAmount || 0), 0);
          setBalanceAmount(totalBalance);
        } catch (error) {
          console.error("Error fetching fees data:", error);
        }
      }
    };

    fetchFeesData();
  }, [studentId]);

  // Fetch notices in real-time (for all students)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notices"), (snapshot) => {
      const noticesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotices(noticesData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all assignments (no filtering by studentId)
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const q = collection(db, "assignments"); // Fetch all assignments
        const querySnapshot = await getDocs(q);

        const assignmentsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        console.log("Assignments fetched:", assignmentsData); // Debugging log

        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching assignments data:", error);
      }
    };

    fetchAssignments();
  }, []);

  // Fetch attendance data (filtered by studentId)
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (studentId) {
        try {
          const q = query(collection(db, "attendance"), where("studentId", "==", studentId)); // Filter by studentId
          const querySnapshot = await getDocs(q);

          const attendanceData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Calculate total attendance count
          const totalAttendance = attendanceData.length;
          setAttendanceCount(totalAttendance);  // Set the attendance count
          console.log("Total attendance fetched:", totalAttendance);  // Debugging log
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      }
    };

    fetchAttendanceData();
  }, [studentId]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleViewFeesDetails = () => {
    setShowFeesDetails(true);
  };

  const handleBackToDashboard = () => {
    setShowFeesDetails(false);
  };

  if (!studentName) {
    return <p>Error: No student data available.</p>;
  }

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="dashboard-title">Dashboard</h2>
        <ul className="sidebar-menu">
          <li><a href="/timetable">Time Table</a></li>
          <li><a href="/assignments">Assignments</a></li>
          
          <li><a href="/subjects">Subjects</a></li>
          <li><a href="/teacher">Class Teacher</a></li>
          <li><a href="/exams">Exam Marks</a></li>
          <li>
            <a
              className="fees-link"
              onClick={handleViewFeesDetails}
             
            >
              Fee Information
            </a>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {showFeesDetails ? (
          // Fees Section
          <section className="fees-section">
            <h4>Fees Information</h4>
            <button className="back-button" onClick={handleBackToDashboard}>Back to Dashboard</button>
            {feesData.length > 0 ? (
              <table className="fees-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feesData.map((fee) => (
                    <tr key={fee.id}>
                      <td>{fee.date}</td>
                      <td>{fee.totalAmount}</td>
                      <td>{fee.paidAmount}</td>
                      <td>{fee.balanceAmount}</td>
                      <td className={fee.status === "Paid" ? "status-paid" : "status-due"}>
                        {fee.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No fee records available.</p>
            )}
          </section>
        ) : (
          <>
            {/* Student Profile */}
            <div className="profile-container">
              <h3>{studentName || "N/A"}</h3>
              <div className="profile-details">
                {loading ? (
                  <p>Loading student data...</p>
                ) : (
                  <>
                    <p>Student ID: {studentId}</p>
                    <p>Roll No: {studentInfo.roll || "N/A"}</p>
                    <p>Class: {studentInfo.class || "N/A"}</p>
                    <p>Section: {studentInfo.section || "N/A"}</p>
                  </>
                )}
              </div>
            </div>

            {/* Performance Grid */}
            <section className="performance-grid">
              <div className="performance-card attendance">
                <h4>Attendance</h4>
                <p>{attendanceCount}</p> {/* Display total attendance count */}
              </div>
              <div className="performance-card assignments">
                <h4>Assignments</h4>
                <p>{assignments.length}</p> {/* Display total number of assignments */}
              </div>
              <div className="performance-card fee">
                <h4>Pending Fee Balance</h4>
                <p>{balanceAmount} Rs</p>
              </div>
              <div className="performance-card subjects">
                <h4>Subjects</h4>
                <p>3</p>
              </div>
              <div className="performance-card exams">
                <h4>Exams</h4>
                <p>3</p>
              </div>
              <div className="performance-card events">
                <h4>Events</h4>
                <p>4</p>
              </div>
            </section>

            {/* Notices Section */}
            <section className="notices">
              <h4>Notices</h4>
              <ul className="notices-list">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <li key={notice.id}>
                      <p>
                        <span>{notice.date}</span>: {notice.author} - {notice.message}
                      </p>
                    </li>
                  ))
                ) : (
                  <li>No notices available.</li>
                )}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
