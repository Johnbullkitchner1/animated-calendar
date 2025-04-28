import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AnimatedCalendar.css';
import backgroundImage from '../images/background.jpg'; // Import image

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

  // Calculate rotations for clock hands
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  // Get event for a specific day
  const getEventForDay = (day) => {
    if (!calendar?.events || day === 0) return null;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return calendar.events[dateStr] || null;
  };

  if (loading) return <div className="calendar-container">Loading...</div>;
  if (error) return <div className="calendar-container">{error}</div>;

  return (
    <div
      className="calendar-wrapper"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
              {week.map((day, i) => {
                const event = getEventForDay(day);
                return (
                  <div
                    key={i}
                    className={`calendar-day ${day === 0 ? 'empty' : ''} ${
                      selectedDay === day && day !== 0 ? 'selected' : ''
                    } ${event ? 'has-event' : ''}`}
                    onClick={() => handleDayClick(day)}
                    title={event ? event : ''}
                  >
                    {day !== 0 ? day : ''}
                    {event && <span className="event-marker"></span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="clock">
          <div className="clock-face">
            <div className="hand hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
            <div className="hand minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
            <div className="hand second-hand" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
            <div className="clock-center"></div>
          </div>
        </div>

        {selectedDay && (
          <div className="selected-day-info">
            Selected: {selectedDay} {calendar.month} {calendar.year}
            {getEventForDay(selectedDay) && (
              <div>Event: {getEventForDay(selectedDay)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedCalendar;