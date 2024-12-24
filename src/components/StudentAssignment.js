import React from 'react';
import './studentAssignment.css'; // Import CSS for styling

const StudentAssignment = () => {
  // Mocked assignment data
  const assignments = [
    {
      id: 1,
      studentName: "Wesley McCallam",
      assignmentTitle: "Symbiosis Short Answer",
      status: "Turned in",
      attachment: true,
    },
    {
      id: 2,
      studentName: "Clinton Ratliff",
      assignmentTitle: "Symbiosis Short Answer",
      status: "Turned in",
      attachment: true,
    },
    {
      id: 3,
      studentName: "Kareem Tran",
      assignmentTitle: "Symbiosis Short Answer",
      status: "No attachments assigned",
      attachment: false,
    },
    {
      id: 4,
      studentName: "Yael Ruiz",
      assignmentTitle: "Symbiosis Short Answer",
      status: "Graded",
      attachment: false,
    }
  ];

  return (
    <div className="assignment-section">
      <h2 className="assignments-heading">Symbiosis Short Answer (Homework)</h2>

      {/* Summary Stats */}
      <div className="assignment-stats">
        <p>2 Turned in</p>
        <p>1 Assigned</p>
        <p>1 Graded</p>
      </div>

      {/* Assignment Cards */}
      <div className="assignment-cards-container">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-card-info">
              <p className="assignment-student-name">{assignment.studentName}</p>
              <p className="assignment-title">{assignment.assignmentTitle}</p>
              <p className={`assignment-status ${assignment.status.replace(/\s/g, '-').toLowerCase()}`}>
                {assignment.status}
              </p>
            </div>
            {assignment.attachment ? (
              <div className="attachment-icon">
                {}
                <img src="https://via.placeholder.com/40" alt="Attachment" />
              </div>
            ) : (
              <div className="no-attachment">No attachments</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignment;
