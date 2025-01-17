import React, { useState, useEffect } from "react";
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot } from 'firebase/firestore'; 
import "./noticeBoard.css";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]); 
  const [newNotice, setNewNotice] = useState({
    date: "",
    author: "",
    message: ""
  });

  // Fetch and listen to notices in real-time using Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, "notices"), (snapshot) => {
        const noticesData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id, 
        }));
        setNotices(noticesData); 
        console.log("Notices fetched from Firestore: ", noticesData);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching notices: ", error);
    }
  }, []);

  // Handle input changes for the new notice
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotice((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (add a new notice to Firestore)
  const handleAddNotice = async (e) => {
    e.preventDefault();

    if (!newNotice.date || !newNotice.author || !newNotice.message) {
      alert("Please fill in all fields.");
      return;
    }

    // Add the notice to Firestore
    try {
      await addDoc(collection(db, "notices"), {
        date: newNotice.date,
        author: newNotice.author,
        message: newNotice.message
      });

      // Clear the form after submission
      setNewNotice({ date: "", author: "", message: "" });
      console.log("Notice added successfully."); 
    } catch (error) {
      console.error("Error adding notice: ", error);
    }
  };

  return (
    <div className="notice-board-container">
      <h2 className="heading">Notice Board</h2>

      {/* Admin form to add new notice */}
      <form onSubmit={handleAddNotice} className="notice-form">
        <input
          type="text"
          name="date"
          placeholder="Date (e.g., 16 May, 2024)"
          value={newNotice.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author (e.g., Admin Name)"
          value={newNotice.author}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="message"
          placeholder="Notice message..."
          value={newNotice.message}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Notice</button>
      </form>

      {/* Display the list of notices */}
      <ul className="notice-list">
        {notices.map((notice, index) => (
          <li key={index}>
            <p>{notice.date}: {notice.author} - {notice.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;
