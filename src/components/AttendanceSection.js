import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, setDoc, doc, query, where } from 'firebase/firestore';
import './AttendanceSection.css';
import { jsPDF } from 'jspdf';

const Loader = () => (
  <div className="loader">
    <span>Loading...</span>
  </div>
);

const AttendanceSection = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [showAttendance, setShowAttendance] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(''); 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "students");
        const studentDocs = await getDocs(studentsRef);
        const studentsData = studentDocs.docs.map((doc) => ({
          id: doc.id,
          studentId: doc.data().studentId,
          name: doc.data().name,
          ...doc.data(),
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

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

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: isPresent,
    }));
  };

  const submitAttendance = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const date = new Date().toISOString().split('T')[0];
      const attendanceRef = collection(db, "attendance");

      for (const studentId in attendance) {
        const isPresent = attendance[studentId];

        if (isPresent === undefined) {
          console.log(`No attendance set for studentId ${studentId}`);
          continue;
        }

        await setDoc(doc(attendanceRef, `${studentId}_${date}`), {
          studentId,
          date,
          isPresent,
        });
      }

      setSuccessMessage('Attendance added successfully!');
    } catch (error) {
      console.error("Error submitting attendance: ", error);
      setSuccessMessage('Failed to add attendance.');
    } finally {
      setLoading(false);
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const startY = 30;
    const rowHeight = 10;
    const tableWidth = 170;
    const columnWidths = [40, 60, 50, 20]; // Adjust column widths for a balanced layout
    let currentY = startY;
  
    // Add Title
    doc.setFontSize(16);
    doc.text('Attendance List', margin, currentY);
    currentY += 10;
  
    // Add Table Header
    const headers = ['Student ID', 'Student Name', 'Date', 'Present'];
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    let x = margin;
    headers.forEach((header, index) => {
      doc.text(header, x, currentY);
      x += columnWidths[index];
    });
    currentY += rowHeight;
  
    // Draw Data Rows
    doc.setFont('Helvetica', 'normal');
    students.forEach((student) => {
      const studentAttendance = attendanceData[student.studentId] || [];
      studentAttendance.forEach((attendanceEntry) => {
        const { date, isPresent } = attendanceEntry;
        x = margin;
  
        // Row Data
        const rowData = [
          student.studentId,
          student.name,
          date,
          isPresent ? 'Yes' : 'No',
        ];
  
        // Draw each column value
        rowData.forEach((data, index) => {
          doc.text(data, x, currentY);
          x += columnWidths[index];
        });
  
        // Check if content exceeds the page height
        currentY += rowHeight;
        if (currentY + rowHeight > doc.internal.pageSize.height - margin) {
          doc.addPage();
          currentY = startY;
  
          // Repeat Header on New Page
          x = margin;
          headers.forEach((header, index) => {
            doc.text(header, x, currentY);
            x += columnWidths[index];
          });
          currentY += rowHeight;
        }
      });
    });
  
    // Save the PDF
    doc.save('attendance-list.pdf');
  };
  

  return (
    <div className="attendance-section">
      <h2 className="attendance-title">Attendance</h2>

      <button
        className="show-attendance-button"
        onClick={() => setShowAttendance((prev) => !prev)}
      >
        {showAttendance ? 'Hide Attendance' : 'Show Attendance'}
      </button>

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
                      <td>{student.studentId}</td>
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

      <ul className="attendance-list">
        {students.map((student) => (
          <li key={student.studentId} className="attendance-item">
            <span className="student-id">ID: {student.studentId}</span>
            <span className="student-name">{student.name}</span>
            <div className="attendance-buttons">
              <button
                className="present-button"
                onClick={() => handleAttendanceChange(student.studentId, true)}
                aria-label={`Mark ${student.name} as Present`}
              >
                Present
              </button>
              <button
                className="absent-button"
                onClick={() => handleAttendanceChange(student.studentId, false)}
                aria-label={`Mark ${student.name} as Absent`}
              >
                Absent
              </button>
            </div>
          </li>
        ))}
      </ul>

      {loading && <Loader />}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button className="submit-button" type="submit" onClick={submitAttendance} disabled={loading}>
        Submit Attendance
      </button>
      <button className="download-pdf-button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default AttendanceSection;
