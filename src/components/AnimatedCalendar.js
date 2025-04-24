// src/components/AnimatedCalendar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AnimatedCalendar.css';

const AnimatedCalendar = () => {
  const [calendar, setCalendar] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/calendar?year=${year}&month=${month}`
        );
        setCalendar(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching calendar data');
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [year, month]);

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(prevYear => prevYear + 1);
    } else {
      setMonth(prevMonth => prevMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(prevYear => prevYear - 1);
    } else {
      setMonth(prevMonth => prevMonth - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="calendar-container">
      <h1>{calendar.month} {calendar.year}</h1>
      <div className="calendar-navigation">
        <button onClick={handlePrevMonth}>Previous</button>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="calendar-grid">
        {calendar.calendar.map((week, index) => (
          <div className="calendar-week" key={index}>
            {week.map((day, i) => (
              <div className={`calendar-day ${day === 0 ? 'empty' : ''}`} key={i}>
                {day !== 0 ? day : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCalendar;
