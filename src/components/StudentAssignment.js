import React, { useState, useEffect } from 'react';
import { db, storage, collection, getDocs, addDoc, serverTimestamp } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './studentAssignment.css'; 

const StudentAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // State to track file upload progress

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentSnapshot = await getDocs(collection(db, 'students'));
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name, // Only fetch name and id
        }));
        setStudents(studentList);
      } catch (error) {
        setErrorMessage('Error fetching students: ' + error.message);
      }
    };

    fetchStudents();
  }, []);

  // Validate file type and size before upload
  const validateFile = (file) => {
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileSizeLimit = 5 * 1024 * 1024; // 5MB
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setErrorMessage('Invalid file type. Only PDF and Word documents are allowed.');
      return false;
    }

    if (file.size > fileSizeLimit) {
      setErrorMessage('File size exceeds 5MB limit.');
      return false;
    }

    return true;
  };

  // Handle file upload to Firebase Storage with progress tracking
  const handleFileUpload = async (file) => {
    try {
      const storageRef = ref(storage, `assignments/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update progress bar
        },
        (error) => {
          throw new Error('Error uploading file: ' + error.message);
        }
      );

      // Wait for upload to complete
      await uploadTask;
      const fileUrl = await getDownloadURL(storageRef);
      return fileUrl;
    } catch (error) {
      throw new Error('Error uploading file: ' + error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Form validation
      if (!title || !description || !dueDate || !file || selectedStudents.length === 0) {
        setErrorMessage('Please fill in all fields and select at least one student.');
        return;
      }

      // File validation
      if (!validateFile(file)) {
        return;
      }

      // Upload file to Firebase Storage
      const fileUrl = await handleFileUpload(file);

      // Save assignment details to Firestore
      await addDoc(collection(db, 'assignments'), {
        title,
        description,
        dueDate: new Date(dueDate),
        fileUrl,
        assignedTo: selectedStudents, // Student IDs
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Assignment uploaded successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setFile(null);
      setSelectedStudents([]);
      setErrorMessage('');
      setUploadProgress(0); // Reset progress bar

    } catch (error) {
      console.error('Error uploading assignment:', error.message);
      setErrorMessage(`Error uploading assignment: ${error.message}`);
    }
  };

  // Handle student selection
  const handleStudentSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedStudents((prev) => [...prev, value]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== value));
    }
  };

  return (
    <div className="assignment-upload-container">
      <h2>Upload Assignment</h2>
      <form onSubmit={handleSubmit} className="assignment-upload-form">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter assignment description"
          required
        ></textarea>

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <label>Upload File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <label>Select Students</label>
        <div className="student-list">
          {students.map((student) => (
            <div key={student.id}>
              <input
                type="checkbox"
                value={student.id}
                onChange={handleStudentSelection}
              />
              <span>{student.name}</span>
            </div>
          ))}
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button type="submit">Upload Assignment</button>
      </form>
    </div>
  );
};

export default StudentAssignment;
