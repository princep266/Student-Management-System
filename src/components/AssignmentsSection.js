import React, { useState, useEffect } from "react";
import { db, storage } from './firebase'; // Import the Firestore and Storage instances
import { collection, onSnapshot, updateDoc, doc, arrayUnion } from 'firebase/firestore'; // Firestore methods
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Storage methods for resumable upload
import "./AssignmentsSection.css"; // Import the CSS file

const AssignmentsSection = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(""); // State for selected student
  const [students, setStudents] = useState([]); // State to store students
  const [uploading, setUploading] = useState(false); // State to track if uploading
  const [progress, setProgress] = useState(0); // State for tracking progress percentage

  // Fetch students from Firestore when the component mounts
  useEffect(() => {
    const unsubscribeStudents = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudents(studentsData); // Update students state with real-time data
    });

    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribeStudents();
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (!selectedStudent) {
      setMessage("Please select a student to assign the assignment.");
      return;
    }

    try {
      // Create a storage reference
      const storageRef = ref(storage, `assignments/${selectedStudent}/${file.name}`);

      // Upload the file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Set the uploading state to true
      setUploading(true);
      setMessage("Uploading file...");

      // Monitor the file upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Calculate progress percentage
          const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progressPercentage)); // Update progress state
        },
        (error) => {
          // Handle any errors during upload
          setMessage("Error uploading file: " + error.message);
          setUploading(false); // Stop the loading animation on error
        },
        async () => {
          // Get the download URL once the upload is complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save the download URL in Firestore under the selected student's document
          const studentRef = doc(db, "students", selectedStudent);
          await updateDoc(studentRef, {
            assignments: arrayUnion(downloadURL) // Use arrayUnion directly to append the URL to the assignments array
          });

          // Set success message
          setMessage(`File assigned to ${students.find(student => student.id === selectedStudent).name} successfully!`);

          // Clear the file and student selection after upload
          setFile(null);
          setSelectedStudent("");
          setUploading(false); // Stop the loading animation
          setProgress(0); // Reset progress
        }
      );
    } catch (error) {
      setMessage("Error uploading file: " + error.message);
      setUploading(false); // Stop the loading animation on error
    }
  };

  return (
    <div className="assignments-container">
      <h2>Upload Assignments</h2>
      
      <label htmlFor="student-select">Select Student:</label>
      <select id="student-select" value={selectedStudent} onChange={handleStudentChange}>
        <option value="">-- Select a Student --</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>Assign Assignment</button>

      {/* Show progress bar when uploading */}
      {uploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
          <p>{progress}%</p>
        </div>
      )}

      {message && <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>}
    </div>
    
  );
};

export default AssignmentsSection;
