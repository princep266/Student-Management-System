import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, setDoc, doc, query, where } from 'firebase/firestore';
import './AttendanceSection.css'; 
import { jsPDF } from 'jspdf'; 

const AttendanceSection = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); 
  const [attendanceData, setAttendanceData] = useState({}); 
  const [showAttendance, setShowAttendance] = useState(false); 

  // Fetch students data including their IDs and studentId from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "students");
        const studentDocs = await getDocs(studentsRef);
        const studentsData = studentDocs.docs.map((doc) => ({
          id: doc.id,  // Firestore document ID (not studentId)
          studentId: doc.data().studentId,  // Fetch the studentId field from Firestore
          name: doc.data().name,  // Add any other fields you need here
          ...doc.data()  // Optionally spread other student data
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

  // Fetch attendance data for the current month
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); 
        const attendanceRef = collection(db, "attendance");
        const attendanceQuery = query(
          attendanceRef,
          where("date", ">=", `${currentMonth}-01`), 
          where("date", "<=", `${currentMonth}-31`) 
        );
        const attendanceDocs = await getDocs(attendanceQuery);

        let data = {};
        attendanceDocs.forEach((doc) => {
          const attendanceData = doc.data();
          const { studentId, date, isPresent } = attendanceData;

          if (!data[studentId]) {
            data[studentId] = [];
          }
          data[studentId].push({ date, isPresent });
        });

        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data: ", error);
      }
    };

    fetchAttendanceData();
  }, []);

  // Handle attendance change for each student
  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: isPresent
    }));
  };

  // Submit attendance to Firestore
  const submitAttendance = async () => {
    try {
      const date = new Date().toISOString().split('T')[0]; // Get current date
      const attendanceRef = collection(db, "attendance");

      // Save attendance for each student
      for (const studentId in attendance) {
        const isPresent = attendance[studentId];

        if (isPresent === undefined) {
          console.log(`No attendance set for studentId ${studentId}`);
          continue;
        }

        console.log(`Saving attendance for student: ${studentId}, Date: ${date}, Present: ${isPresent}`);
        
        // Save each student's attendance with their studentId
        await setDoc(doc(attendanceRef, `${studentId}_${date}`), {
          studentId,  // Save studentId
          date,
          isPresent: isPresent
        });
      }

      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error("Error submitting attendance: ", error);
      alert("Failed to submit attendance.");
    }
  };

  // Function to generate and download the PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Attendance List', 20, 20);

    let yPosition = 30;

    // Add headers
    doc.setFontSize(12);
    doc.text('Student ID', 20, yPosition);  // Added Student ID to the PDF
    doc.text('Student Name', 50, yPosition);
    doc.text('Date', 100, yPosition);
    doc.text('Present', 160, yPosition);
    yPosition += 10;

    // Loop through students and add their attendance info by date
    students.forEach((student) => {
      const studentAttendance = attendanceData[student.studentId] || [];

      studentAttendance.forEach((attendanceEntry) => {
        const { date, isPresent } = attendanceEntry;
        doc.text(student.studentId, 20, yPosition);  // Display Student ID
        doc.text(student.name, 50, yPosition);
        doc.text(date, 100, yPosition);
        doc.text(isPresent ? 'Present' : 'Absent', 160, yPosition);
        yPosition += 10;
      });
    });

    // Save the PDF with a specific filename
    doc.save('attendance-list.pdf');
  };

  return (
    <div className="attendance-section">
      <h2 className="attendance-title">Attendance</h2>
      
      {/* Button to toggle showing attendance */}
      <button 
        className="show-attendance-button" 
        onClick={() => setShowAttendance((prev) => !prev)}
      >
        {showAttendance ? 'Hide Attendance' : 'Show Attendance'}
      </button>

      {/* Display Attendance Information in the Panel when showAttendance is true */}
      {showAttendance && (
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentAttendance = attendanceData[student.studentId] || [];
                return studentAttendance.length > 0 ? (
                  studentAttendance.map((attendanceEntry, index) => (
                    <tr key={`${student.studentId}-${index}`}>
                      <td>{student.studentId}</td> {/* Display studentId from Firestore */}
                      <td>{student.name}</td>
                      <td>{attendanceEntry.date}</td>
                      <td>{attendanceEntry.isPresent ? 'Present' : 'Absent'}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td colSpan="2">No attendance records</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Buttons */}
      <ul className="attendance-list">
        {students.map((student) => (
          <li key={student.studentId} className="attendance-item">
            <span className="student-id">ID: {student.studentId}</span> {/* Display studentId */}
            <span className="student-name">{student.name}</span>
            <div className="attendance-buttons">
              <button 
                className="present-button"
                onClick={() => handleAttendanceChange(student.studentId, true)} 
                style={{ backgroundColor: attendance[student.studentId] === true ? '#4caf50' : '' }}
              >
                Present
              </button>
              <button 
                className="absent-button"
                onClick={() => handleAttendanceChange(student.studentId, false)} 
                style={{ backgroundColor: attendance[student.studentId] === false ? '#f44336' : '' }}
              >
                Absent
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Submit and Download PDF */}
      <button className="submit-button" type="submit" onClick={submitAttendance}>
        Submit Attendance
      </button>
      <button className="download-pdf-button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default AttendanceSection;
