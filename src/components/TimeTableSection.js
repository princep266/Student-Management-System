import React from "react";

const TimeTableSection = () => {
  return (
    <div>
      <h2>Class Time Table</h2>
      <table className="timetable">
        <thead>
          <tr>
            <th>Day</th>
            <th>9 AM - 10 AM</th>
            <th>10 AM - 11 AM</th>
            <th>11 AM - 12 PM</th>
            <th>12 PM - 1 PM</th>
            <th>2 PM - 3 PM</th>
            <th>3 PM - 4 PM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monday</td>
            <td>Math</td>
            <td>Physics</td>
            <td>Chemistry</td>
            <td>Break</td>
            <td>English</td>
            <td>Computer Science</td>
          </tr>
          <tr>
            <td>Tuesday</td>
            <td>Biology</td>
            <td>Math</td>
            <td>Physics</td>
            <td>Break</td>
            <td>English</td>
            <td>Sports</td>
          </tr>
          {/* Add more rows for other days */}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableSection;
