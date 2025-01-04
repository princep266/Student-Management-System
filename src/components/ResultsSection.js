import React from "react";

const ResultsSection = () => {
  const dummyResults = [
    { id: 1, name: "John Doe", subject: "Math", grade: "A" },
    { id: 2, name: "Jane Smith", subject: "Physics", grade: "B+" },
    { id: 3, name: "Mark Johnson", subject: "Chemistry", grade: "A-" },
    { id: 4, name: "Lucy Williams", subject: "Biology", grade: "B" },
  ];

  return (
    <div>
      <h2>Student Results</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {dummyResults.map((result) => (
            <tr key={result.id}>
              <td>{result.name}</td>
              <td>{result.subject}</td>
              <td>{result.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsSection;
