import React, { useState, useEffect } from "react";
import { db } from "./firebase"; 
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import "./ResultsSection.css"; 

const ResultsSection = () => {
  const [students, setStudents] = useState([]); 
  const [newResult, setNewResult] = useState({
    studentId: "",
    examName: "",
    subjectResults: [
      { subject: "", marksObtained: "", totalMarks: "" },
    ],
    obtainedMarks: "",
    totalMarks: "",
    grade: "",
    remarks: "",
  });
  const [results, setResults] = useState([]); // List of all results (fetched + entered locally)

  // Fetch student names and IDs from Firestore on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentCollection = collection(db, "students"); // Ensure "students" collection exists in Firestore
        const studentSnapshot = await getDocs(studentCollection);
        const studentList = studentSnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID is the studentId
          ...doc.data(),
        }));
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []); // Only run once when component mounts

  // Fetch results from Firestore on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsCollection = collection(db, "results"); // Ensure "results" collection exists in Firestore
        const resultsSnapshot = await getDocs(resultsCollection);
        const resultsList = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(resultsList);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []); // Only run once when component mounts

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewResult((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes in subject results dynamically
  const handleSubjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubjectResults = [...newResult.subjectResults];
    updatedSubjectResults[index] = {
      ...updatedSubjectResults[index],
      [name]: value,
    };
    setNewResult((prev) => ({
      ...prev,
      subjectResults: updatedSubjectResults,
    }));
  };


  const handleAddSubject = () => {
    setNewResult((prev) => ({
      ...prev,
      subjectResults: [...prev.subjectResults, { subject: "", marksObtained: "", totalMarks: "" }],
    }));
  };

 
  const handleAddResult = async (e) => {
    e.preventDefault();

    // Validate that all required fields are filled
    if (
      !newResult.studentId ||
      !newResult.examName ||
      newResult.subjectResults.some(
        (subject) => !subject.subject || !subject.marksObtained || !subject.totalMarks
      ) ||
      !newResult.grade
    ) {
      alert("Please fill out all fields.");
      return;
    }

    
    const obtainedMarks = newResult.subjectResults.reduce((sum, subject) => sum + parseInt(subject.marksObtained || 0), 0);
    const totalMarks = newResult.subjectResults.reduce((sum, subject) => sum + parseInt(subject.totalMarks || 0), 0);

    const result = {
      studentId: newResult.studentId,
      examName: newResult.examName,
      subjectResults: newResult.subjectResults,
      obtainedMarks: obtainedMarks,
      totalMarks: totalMarks,
      grade: newResult.grade,
      remarks: newResult.remarks,
    };

    try {
      // Add the result to Firestore
      const resultCollection = collection(db, "results"); 
      const docRef = await addDoc(resultCollection, result);

      // Add the result to the local state
      setResults((prev) => [
        ...prev,
        {
          id: docRef.id, 
          ...result,
        },
      ]);

      // Reset the form fields
      setNewResult({
        studentId: "",
        examName: "",
        subjectResults: [{ subject: "", marksObtained: "", totalMarks: "" }],
        obtainedMarks: "",
        totalMarks: "",
        grade: "",
        remarks: "",
      });

      alert("Result added successfully!");
    } catch (error) {
      console.error("Error adding result to Firestore:", error);
      alert("An error occurred while adding the result.");
    }
  };

  // Function to get student name by ID
  const getStudentNameById = (id) => {
    const student = students.find((student) => student.id === id);
    return student ? student.name : "Unknown Student";
  };

  return (
    <div className="results-section">
      <h2>Enter Student Results</h2>

      {/* Form to enter results */}
      <form className="result-form" onSubmit={handleAddResult}>
        <label htmlFor="student">Student Name:</label>
        <select
          id="student"
          name="studentId"
          value={newResult.studentId}
          onChange={handleChange}
          required
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.id})
            </option>
          ))}
        </select>

        <label htmlFor="examName">Exam Name:</label>
        <input
          type="text"
          id="examName"
          name="examName"
          value={newResult.examName}
          onChange={handleChange}
          required
        />

        {/* Dynamically generated subject result fields */}
        {newResult.subjectResults.map((subject, index) => (
          <div key={index} className="subject-result">
            <label htmlFor={`subject-${index}`}>Subject:</label>
            <input
              type="text"
              id={`subject-${index}`}
              name="subject"
              value={subject.subject}
              onChange={(e) => handleSubjectChange(index, e)}
              required
            />

            <label htmlFor={`marksObtained-${index}`}>Marks Obtained:</label>
            <input
              type="number"
              id={`marksObtained-${index}`}
              name="marksObtained"
              value={subject.marksObtained}
              onChange={(e) => handleSubjectChange(index, e)}
              required
            />

            <label htmlFor={`totalMarks-${index}`}>Total Marks:</label>
            <input
              type="number"
              id={`totalMarks-${index}`}
              name="totalMarks"
              value={subject.totalMarks}
              onChange={(e) => handleSubjectChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddSubject}>Add Subject</button>

        <label htmlFor="grade">Grade:</label>
        <input
          type="text"
          id="grade"
          name="grade"
          value={newResult.grade}
          onChange={handleChange}
          required
        />

        <label htmlFor="remarks">Remarks:</label>
        <input
          type="text"
          id="remarks"
          name="remarks"
          value={newResult.remarks}
          onChange={handleChange}
        />

        <button type="submit">Add Result</button>
      </form>

      {/* Display results table */}
      <h3>Results</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exam Name</th>
            <th>Obtained Marks</th>
            <th>Total Marks</th>
            <th>Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{getStudentNameById(result.studentId)}</td> {/* Fetch student name by ID */}
              <td>{result.examName}</td>
              <td>{result.obtainedMarks}</td>
              <td>{result.totalMarks}</td>
              <td>{result.grade}</td>
              <td>{result.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsSection;
