import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { db, collection, addDoc, serverTimestamp } from "./firebase"; 

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    mobile: "",
    institute: "",
  });
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader

  const generateUserID = (fullName) => {
    const namePart = fullName.split(" ")[0].toUpperCase();
    return `${namePart}-${Math.floor(1000 + Math.random() * 9000)}`; 
  };

  const generateRandomPassword = (length = 10) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@*";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, dob, email, mobile, institute } = formData;

    // Validation
    if (!fullName || !dob || !email || !mobile || !institute) {
      setError("All fields are required.");
      return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      setError("Mobile number must be a valid 10-digit number.");
      return;
    }

    setIsLoading(true); // Set loading state

    // Generate userId and password
    const userId = generateUserID(fullName);
    const password = generateRandomPassword();

    try {
      // Save user data to Firestore
      await addDoc(collection(db, "users"), {
        fullName,
        dob,
        email,
        mobile,
        institute,
        userId,
        password,
        createdAt: serverTimestamp(), 
      });

      // Store generated credentials in state for display
      setGeneratedCredentials({ userId, password });

      // Reset form and error
      setFormData({
        fullName: "",
        dob: "",
        email: "",
        mobile: "",
        institute: "",
      });
      setError("");

      // Show success message after delay
      setTimeout(() => {
        setShowSuccessMessage(true);
        setIsLoading(false); 
      }, 500);
    } catch (err) {
      console.error("Error saving user data:", err);
      setError("An error occurred while creating the account. Please try again.");
      setIsLoading(false); 
    }
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>}
      {!showSuccessMessage ? (
        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Gmail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              maxLength="10"
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="form-group">
            <label htmlFor="institute">Institute Name</label>
            <input
              type="text"
              id="institute"
              name="institute"
              value={formData.institute}
              onChange={handleInputChange}
              required
              disabled={isLoading} // Disable input during loading
            />
          </div>

          <button type="submit" className="cta-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {isLoading && <div className="loader">Loading...</div>} {/* Loader element */}
        </form>
      ) : (
        <div className="success-message">
          <h3>Account Created Successfully!</h3>
          <p><strong>User ID:</strong> {generatedCredentials.userId}</p>
          <p><strong>Password:</strong> {generatedCredentials.password}</p>
          <span>Note: Please save these credentials securely.</span>
          <button onClick={() => navigate("/login")} className="cta-button">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
