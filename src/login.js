import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from './components/firebase'; // Firebase Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore methods
import "./login.css";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // For admin login
  const [loginType, setLoginType] = useState("Student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const adminUsername = "admin"; // Set your admin username
  const adminPassword = "admin123"; // Set your admin password

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Admin login logic
    if (loginType === "Admin") {
      // Check if admin credentials match
      if (username !== adminUsername || password !== adminPassword) {
        setError("Invalid admin credentials");
        return;
      }
      // Redirect to Admin Dashboard if credentials are correct
      navigate("/admin");
    } else {
      // Student login logic
      if (!studentId || !password) {
        setError("Please fill out both fields");
        return;
      }

      // Check if studentId follows the required format
      const studentIdRegex = /^STU-\d{3}[A-Z0-9]{7}$/; // Adjust the regex based on your ID format
      if (!studentIdRegex.test(studentId)) {
        setError("Invalid Student ID format. Please use STU-XXXYYYYYYY format.");
        return;
      }

      try {
        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("studentId", "==", studentId));
        const querySnapshot = await getDocs(q);
        
        // Check if the student exists and if the password matches
        let studentFound = false;
        let studentName = ""; // Initialize studentName
        querySnapshot.forEach((doc) => {
          const studentData = doc.data();
          // Compare the password from Firestore with the entered password
          if (studentData.password === password) {
            studentFound = true;
            studentName = studentData.name; // Get the student's name
            // Redirect to student dashboard or home page with state
            navigate("/student-dashboard", { state: { studentId, studentName } }); // Pass student ID and name
          }
        });

        if (!studentFound) {
          setError("Invalid Student ID or password");
        }
      } catch (error) {
        console.error("Error logging in student: ", error);
        setError("Error logging in. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login as {loginType}</h2>
        <div className="toggle-role">
          <button
            className={`toggle-btn ${loginType === "Student" ? "active" : ""}`}
            onClick={() => setLoginType("Student")}
          >
            Student
          </button>
          <button
            className={`toggle-btn ${loginType === "Admin" ? "active" : ""}`}
            onClick={() => setLoginType("Admin")}
          >
            Admin
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          {loginType === "Admin" && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </>
          )}
          {loginType === "Student" && (
            <>
              <input
                type="text" // Changed type to text for Student ID
                placeholder="Student ID"
                value={studentId} // Use studentId state
                onChange={(e) => setStudentId(e.target.value)} // Update state
                required
              />
            </>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
