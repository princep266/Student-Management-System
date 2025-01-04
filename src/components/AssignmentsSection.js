import React, { useState, useEffect } from "react";
import { db, storage } from "./firebase"; // Import Firestore and Firebase Storage instance
import { collection, onSnapshot, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For file upload
import "./AssignmentsSection.css";

const AssignmentsSection = () => {
  const [assignments, setAssignments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState({}); 
  const [file, setFile] = useState(null); 

  useEffect(() => {
    // Fetch all assignments from Firestore
    const assignmentsQuery = collection(db, "assignments");

    const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
      if (snapshot.empty) {
        setErrorMessage("No assignments available.");
      } else {
        const assignmentsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAssignments(assignmentsData);
      }
    });

    // Cleanup subscription
    return () => {
      unsubscribeAssignments();
    };
  }, []);

  // Function to handle comment submission
  const handleCommentSubmit = async (assignmentId) => {
    const comment = comments[assignmentId];
    if (!comment || !comment.trim()) {
      setErrorMessage("Please enter a comment before submitting.");
      return;
    }

    try {
      const assignmentRef = doc(db, "assignments", assignmentId);
      await updateDoc(assignmentRef, {
        comments: [
          ...(assignments.find((assignment) => assignment.id === assignmentId)?.comments || []),
          { text: comment, submittedAt: new Date() },
        ],
      });

      // Clear the comment input for the specific assignment
      setComments((prevComments) => ({
        ...prevComments,
        [assignmentId]: "", // Clear comment for that assignment
      }));
      setErrorMessage(""); // Clear any error messages
    } catch (error) {
      setErrorMessage("Error submitting comment: " + error.message);
    }
  };

  // Function to handle file upload and submission
  const handleFileUpload = async (assignmentId) => {
    if (!file) {
      setErrorMessage("Please select a file before submitting.");
      return;
    }

    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `submittedWork/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      // Update the assignment with the submitted file URL
      const assignmentRef = doc(db, "assignments", assignmentId);
      await updateDoc(assignmentRef, {
        submittedWork: fileUrl,
      });

      setFile(null); // Clear the file input after submission
      setErrorMessage(""); // Clear any error messages
    } catch (error) {
      setErrorMessage("Error uploading file: " + error.message);
    }
  };

  // Handle comment input for each assignment
  const handleCommentChange = (e, assignmentId) => {
    const { value } = e.target;
    setComments((prevComments) => ({
      ...prevComments,
      [assignmentId]: value,
    }));
  };

  return (
    <div className="assignments-container">
      <h2>Assignments</h2>

      {}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {}
      <div className="assignments-list">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <h3>{assignment.title || "Untitled Assignment"}</h3>
              <p>{assignment.description || "No description available."}</p>
              <p>
                Due:{" "}
                {assignment.dueDate
                  ? new Date(assignment.dueDate.seconds * 1000).toLocaleDateString()
                  : "No due date"}
              </p>
              <p>Status: {assignment.status || "Pending"}</p>
              
              <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                Download File
              </a>

              {}
              <div className="comments-section">
                <h4>Comments</h4>
                <div className="comments-list">
                  {assignment.comments?.map((comment, index) => (
                    <div key={index} className="comment">
                      <p>{comment.text}</p>
                      <p className="comment-date">
                        {new Date(comment.submittedAt.seconds * 1000).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <textarea
                  value={comments[assignment.id] || ""}
                  onChange={(e) => handleCommentChange(e, assignment.id)}
                  placeholder="Add your comment"
                ></textarea>
                <button onClick={() => handleCommentSubmit(assignment.id)}>Submit Comment</button>
              </div>

              {/* File Submission Section */}
              <div className="file-upload-section">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button onClick={() => handleFileUpload(assignment.id)}>
                  Submit Work
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentsSection;
