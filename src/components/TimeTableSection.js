import React, { useState } from "react";
import './TimeTable.css';


const TimeTableSection = () => {
 
  const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const defaultTimetable = [
    ["Math", "Physics", "Chemistry", "Break", "English", "Computer Science"],
    ["Biology", "Math", "Physics", "Break", "English", "Sports"],
    ["History", "Geography", "Math", "Break", "Physics", "Chemistry"],
    ["Economics", "Civics", "English", "Break", "Math", "Computer Science"],
    ["Physics", "Chemistry", "Biology", "Break", "Sports", "Arts"],
  ];


  const [days, setDays] = useState(defaultDays);
  const [timetable, setTimetable] = useState(defaultTimetable);

 
  const resetTimetable = () => {
    setDays(defaultDays);
    setTimetable(defaultTimetable);
  };

 
  const addDay = () => {
    setDays([...days, `Day ${days.length + 1}`]);
    setTimetable([...timetable, ["", "", "", "", "", ""]]); 
  };

  // Remove the last day
  const removeDay = () => {
    if (days.length > 1) {
      setDays(days.slice(0, -1)); 
      setTimetable(timetable.slice(0, -1)); 
    }
  };

  // Add a new period (column)
  const addPeriod = () => {
    const updatedTimetable = timetable.map((row) => [...row, ""]); 
    setTimetable(updatedTimetable);
  };

  // Remove the last period (column)
  const removePeriod = () => {
    if (timetable[0].length > 1) {
      const updatedTimetable = timetable.map((row) => row.slice(0, -1)); 
      setTimetable(updatedTimetable);
    }
  };

  // Handle input changes in the timetable
  const handleInputChange = (dayIndex, periodIndex, value) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[dayIndex][periodIndex] = value;
    setTimetable(updatedTimetable);
  };

  return (
    <div>
      <h2>Class Time Table</h2>
      <div>
        <button onClick={resetTimetable}>Reset</button>
        <button onClick={addDay}>Add Day</button>
        <button onClick={removeDay}>Remove Day</button>
        <button onClick={addPeriod}>Add Period</button>
        <button onClick={removePeriod}>Remove Period</button>
      </div>
      <table className="timetable">
        <thead>
          <tr>
            <th>Day</th>
            {Array.from({ length: timetable[0].length }, (_, i) => (
              <th key={i}>{`${9 + i} AM - ${10 + i} AM`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timetable.map((row, dayIndex) => (
            <tr key={dayIndex}>
              <td>{days[dayIndex]}</td>
              {row.map((cell, periodIndex) => (
                <td key={periodIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleInputChange(dayIndex, periodIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableSection;
