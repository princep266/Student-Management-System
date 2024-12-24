import React, { useState, useEffect } from "react";
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "./firebase"; // Firebase imports
import "./FeesSection.css";

const FeesSection = () => {
  const [feesData, setFeesData] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    roll: "",
    totalAmount: 0,
    paidAmount: 0,
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch student data from Firestore
  const fetchStudentData = async (studentId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      let studentFound = false;

      querySnapshot.forEach((doc) => {
        const student = doc.data();
        if (student.studentId === studentId) {
          setFormData((prevData) => ({
            ...prevData,
            studentId: student.studentId || "",
            name: student.name || "",
            roll: student.roll || "",
            totalAmount: student.totalAmount || 0,
            paidAmount: student.paidAmount || 0,
            email: student.email || "",
          }));
          studentFound = true;
        }
      });

      if (!studentFound) {
        alert("No student found with the given ID.");
        setFormData((prevData) => ({ ...prevData, studentId }));
      }
    } catch (error) {
      console.error("Error fetching student data: ", error);
      alert("Failed to fetch student data.");
    }
  };

  // Fetch all fees data when the component mounts
  const fetchFeesData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fees"));
      const fetchedFees = [];
      querySnapshot.forEach((doc) => {
        fetchedFees.push({ ...doc.data(), id: doc.id }); // Save the document ID for editing and deleting
      });
      setFeesData(fetchedFees);
    } catch (error) {
      console.error("Error fetching fees data: ", error);
      alert("Failed to fetch fees data.");
    }
  };

  // Call fetchFeesData when component mounts
  useEffect(() => {
    fetchFeesData();
  }, []);

  // Handler to update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "studentId" && value.trim() !== "") {
      fetchStudentData(value.trim());
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const balanceAmount = formData.totalAmount - formData.paidAmount;
    const status = balanceAmount > 0 ? "Due" : "Paid";

    const newFee = {
      studentId: formData.studentId,
      name: formData.name,
      roll: formData.roll,
      totalAmount: Number(formData.totalAmount),
      paidAmount: Number(formData.paidAmount),
      balanceAmount: balanceAmount,
      status: status,
      email: formData.email,
      date: new Date().toLocaleDateString(),
    };

    // Save fee data to Firestore
    try {
      await addDoc(collection(db, "fees"), newFee);
      alert("Fee information added successfully!");

      // Update local state after successful Firestore insertion
      setFeesData([...feesData, newFee]);

      // Clear the form data
      setFormData({
        studentId: "",
        name: "",
        roll: "",
        totalAmount: 0,
        paidAmount: 0,
        email: "",
      });
    } catch (error) {
      console.error("Error adding fee data to Firestore: ", error);
      alert("Failed to add fee data.");
    }
  };

  // Search Handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter fees data based on search term
  const filteredFeesData = feesData.filter((fee) =>
    fee.studentId.toLowerCase().includes(searchTerm)
  );

  // Delete Fee
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "fees", id));
      alert("Fee record deleted successfully!");
      setFeesData(feesData.filter((fee) => fee.id !== id));
    } catch (error) {
      console.error("Error deleting fee data: ", error);
      alert("Failed to delete fee data.");
    }
  };

  // Edit Fee
  const handleEdit = (fee) => {
    setFormData({
      studentId: fee.studentId,
      name: fee.name,
      roll: fee.roll,
      totalAmount: fee.totalAmount,
      paidAmount: fee.paidAmount,
      email: fee.email,
    });
  };

  // Sort Table by Column
  const handleSort = (column) => {
    const sortedData = [...feesData].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setFeesData(sortedData);
  };

  return (
    <div className="fees-section-container">
      <h2 className="fees-section-heading">Manage Fees</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Student ID"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      {/* Form for adding new fees */}
      <form className="fees-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            placeholder="Enter student ID"
          />
        </div>
        <div className="form-row">
          <label htmlFor="name">Student Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="roll">Roll No</label>
          <input
            type="text"
            id="roll"
            name="roll"
            value={formData.roll}
            onChange={handleChange}
            placeholder="Enter roll number"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="totalAmount">Total Amount</label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="Enter total fee amount"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="paidAmount">Paid Amount</label>
          <input
            type="number"
            id="paidAmount"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            placeholder="Enter paid amount"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Fee
        </button>
      </form>

      {/* Fees Table */}
      <table className="fees-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("studentId")}>Student ID</th>
            <th onClick={() => handleSort("name")}>Student Name</th>
            <th onClick={() => handleSort("roll")}>Roll No</th>
            <th onClick={() => handleSort("totalAmount")}>Total Amount</th>
            <th onClick={() => handleSort("paidAmount")}>Paid Amount</th>
            <th onClick={() => handleSort("balanceAmount")}>Balance Amount</th>
            <th>Status</th>
            <th>Email</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeesData.map((fee, index) => (
            <tr key={fee.id}>
              <td>{fee.studentId}</td>
              <td>{fee.name}</td>
              <td>{fee.roll}</td>
              <td>{fee.totalAmount}</td>
              <td>{fee.paidAmount}</td>
              <td>{fee.balanceAmount}</td>
              <td className={fee.status === "Paid" ? "status-paid" : "status-due"}>
                {fee.status}
              </td>
              <td>{fee.email}</td>
              <td>{fee.date}</td>
              <td>
                <button onClick={() => handleEdit(fee)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(fee.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesSection;
