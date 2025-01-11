import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Firebase config
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import "./Results.css"; // Optional CSS

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // Query Firestore for all results in the "results" collection
        const resultsSnapshot = await getDocs(collection(db, "results"));

        if (!resultsSnapshot.empty) {
          const fetchedResults = resultsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setResults(fetchedResults);
        } else {
          setError("No results found.");
        }
      } catch (err) {
        setError("An error occurred while fetching results.");
        console.error("Error fetching results:", err);
      }

      setLoading(false);
    };

    fetchAllResults();
  }, []);

  // Loading state
  if (loading) {
    return <p>Loading results...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  // Helper function to calculate percentage
  const calculatePercentage = (obtainedMarks, totalMarks) => {
    if (obtainedMarks && totalMarks) {
      return ((obtainedMarks / totalMarks) * 100).toFixed(2);
    }
    return "N/A";
  };

  // Main rendering logic for results
  return (
    <div className="results">
      <h2>Results</h2>
      {results.map((result) => (
        <div key={result.id} className="result-card">
          <h3>{result.examName || "Exam Name Unavailable"}</h3>
          <p><strong>Grade:</strong> {result.grade || "N/A"}</p>
          <p><strong>Remarks:</strong> {result.remarks || "N/A"}</p>
          <p><strong>Obtained Marks:</strong> {result.obtainedMarks || "N/A"}</p>
          <p><strong>Total Marks:</strong> {result.totalMarks || "N/A"}</p>
          <p><strong>Percentage:</strong> {calculatePercentage(result.obtainedMarks, result.totalMarks)}%</p>

          <h4>Subject-wise Results:</h4>
          {result.subjectResults && result.subjectResults.length > 0 ? (
            <table className="subject-results-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {result.subjectResults.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subject || "N/A"}</td>
                    <td>{subject.marksObtained || "N/A"}</td>
                    <td>{subject.totalMarks || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No subject-wise results available.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Results;
