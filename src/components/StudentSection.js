import React, { useState, useEffect } from "react";
import { db, realtimedb } from './firebase';  
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { ref, push, onValue, remove, update } from 'firebase/database'; 
import "./student.css";

const StudentSection = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    roll: "",
    class: "",
    section: "",
    password: "",
    studentId: "",
    contactNo: "", 
    address: "",   
    fatherName: "", 
    motherName: "", 
  });
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  // Fetch student data from Realtime Database
  useEffect(() => {
    const studentRef = ref(realtimedb, "students");
    const unsubscribe = onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentsData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setStudents(studentsData);
      } else {
        setStudents([]);
      }
    });
    return () => unsubscribe();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const generateStudentId = () => {
    const baseId = `${students.length + 1}`.padStart(3, '0');
    const randomPart = Math.random().toString(36).substr(2, 7).toUpperCase();
    return `STU-${baseId}${randomPart}`;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const newRoll = `#${Math.floor(Math.random() * 10000)}`;
    const newPassword = Math.random().toString(36).slice(-8);
    const newStudentId = generateStudentId();

    const studentData = {
      name: newStudent.name,
      roll: newRoll,
      class: newStudent.class,
      section: newStudent.section,
      password: newPassword,
      studentId: newStudentId,
      contactNo: newStudent.contactNo,
      address: newStudent.address,
      fatherName: newStudent.fatherName,
      motherName: newStudent.motherName,
    };

    try {
      if (editMode) {
        // Update student data
        const firestoreDoc = doc(db, "students", currentStudentId);
        await updateDoc(firestoreDoc, studentData);
        
        const studentRef = ref(realtimedb, `students/${currentStudentId}`);
        await update(studentRef, studentData);
        
        alert('Student details updated successfully.');
        setEditMode(false);
      } else {
        // Add new student
        await addDoc(collection(db, "students"), studentData);
        const studentRef = ref(realtimedb, "students");
        await push(studentRef, studentData);
        alert(`New student added! Roll: ${newRoll}, Password: ${newPassword}, ID: ${newStudentId}`);
      }

      setNewStudent({ name: "", roll: "", class: "", section: "", password: "", studentId: "", contactNo: "", address: "", fatherName: "", motherName: "" });
    } catch (error) {
      console.error("Error adding/updating student: ", error);
    }
  };

  const handleEdit = (student) => {
    setEditMode(true);
    setCurrentStudentId(student.id);
    setNewStudent({
      name: student.name,
      roll: student.roll,
      class: student.class,
      section: student.section,
      password: student.password,
      studentId: student.studentId,
      contactNo: student.contactNo,
      address: student.address,
      fatherName: student.fatherName,
      motherName: student.motherName,
    });
  };

  const handleDelete = async (studentId) => {
    try {
      const firestoreDoc = doc(db, "students", studentId);
      await deleteDoc(firestoreDoc);

      const studentRef = ref(realtimedb, `students/${studentId}`);
      await remove(studentRef);

      alert('Student deleted successfully.');
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };

  const [showStudents, setShowStudents] = useState(false);
  const toggleShowStudents = () => setShowStudents(!showStudents);

  return (
    <div>
      <h2 className="student-section-heading">Manage Students</h2>

      <form onSubmit={handleAddStudent} className="add-student-form">
        <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} required />
        <input type="text" name="class" placeholder="Class" value={newStudent.class} onChange={handleInputChange} required />
        <input type="text" name="section" placeholder="Section" value={newStudent.section} onChange={handleInputChange} required />
        <input type="text" name="contactNo" placeholder="Contact Number" value={newStudent.contactNo} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="Address" value={newStudent.address} onChange={handleInputChange} required />
        <input type="text" name="fatherName" placeholder="Father's Name" value={newStudent.fatherName} onChange={handleInputChange} required />
        <input type="text" name="motherName" placeholder="Mother's Name" value={newStudent.motherName} onChange={handleInputChange} required />
        <button type="submit">{editMode ? "Update Student" : "Add Student"}</button>
      </form>

      <button onClick={toggleShowStudents} className="view-students-btn">
        {showStudents ? "Hide Students" : "View All Students"}
      </button>

      {showStudents && (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Section</th>
              <th>Contact No</th>
              <th>Address</th>
              <th>Father's Name</th>
              <th>Mother's Name</th>
              <th>Password</th>
              <th>Student ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.roll}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>{student.contactNo}</td>
                <td>{student.address}</td>
                <td>{student.fatherName}</td>
                <td>{student.motherName}</td>
                <td>{student.password}</td>
                <td>{student.studentId}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentSection;
