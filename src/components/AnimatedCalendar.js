import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AnimatedCalendar.css';

const AnimatedCalendar = () => {
  const [calendar, setCalendar] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(prevYear => prevYear + 1);
    } else {
      setMonth(prevMonth => prevMonth + 1);
    }
    setSelectedDay(null);
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(prevYear => prevYear - 1);
    } else {
      setMonth(prevMonth => prevMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    if (day !== 0) {
      setSelectedDay(day);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) return <div className="calendar-container">Loading...</div>;
  if (error) return <div className="calendar-container">{error}</div>;

  return (
    <div className="calendar-wrapper">
      <div className={`calendar-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="calendar-title">{calendar.month} {calendar.year}</h1>
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="calendar-navigation">
          <button onClick={handlePrevMonth}>Previous</button>
          <button onClick={handleNextMonth}>Next</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-week header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="calendar-day">
                {day}
              </div>
            ))}
          </div>
          {calendar.calendar.map((week, index) => (
            <div className="calendar-week" key={index}>
              {week.map((day, i) => (
                <div
                  key={i}
                  className={`calendar-day ${day === 0 ? 'empty' : ''} ${
                    selectedDay === day && day !== 0 ? 'selected' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day !== 0 ? day : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="clock">
          {time.toLocaleTimeString()}
        </div>

        {selectedDay && (
          <div className="selected-day-info">
            Selected: {selectedDay} {calendar.month} {calendar.year}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedCalendar;