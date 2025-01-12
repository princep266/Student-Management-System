import React from "react";

const ReportsSection = () => {

  const totalStudents = 120;
  const totalFeesCollected = 50000;
  const totalNotices = 20;
  const totalAssignments = 35;

  return (
    <div>
      <h2>Reports</h2>
      <div className="report-card">
        <h3>Total Students</h3>
        <p>{totalStudents}</p>
      </div>
      <div className="report-card">
        <h3>Total Fees Collected</h3>
        <p>${totalFeesCollected}</p>
      </div>
      <div className="report-card">
        <h3>Total Notices</h3>
        <p>{totalNotices}</p>
      </div>
      <div className="report-card">
        <h3>Total Assignments</h3>
        <p>{totalAssignments}</p>
      </div>
    </div>
  );
};

export default ReportsSection;
