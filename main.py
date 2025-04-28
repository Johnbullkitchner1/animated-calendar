import calendar
from fastapi import FastAPI, Query
from datetime import datetime
import pytz

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static events dictionary (replace with database in production)
EVENTS = {
    "2025-04-05": "Dentist Appointment",
    "2025-04-10": "Meeting"
}

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Animated Calendar API"}

# Get current date, time, and day based on timezone
@app.get("/datetime")
def get_datetime(timezone: str = Query(default="UTC", description="Enter a valid timezone like 'Africa/Lagos'")):
    try:
        tz = pytz.timezone(timezone)
    except pytz.UnknownTimeZoneError:
        return {"error": "Invalid timezone. Example: 'Africa/Lagos', 'Asia/Tokyo'"}
    
    now = datetime.now(tz)
    return {
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M:%S"),
        "day": now.strftime("%A"),
        "timezone": timezone
    }

# List all valid timezones
@app.get("/timezones")
def get_timezones():
    timezones = pytz.all_timezones
    return {"timezones": timezones}

# Generate a calendar for a given month and year
@app.get("/calendar")
def generate_calendar(year: int = Query(default=datetime.now().year, description="Enter the year"),
                      month: int = Query(default=datetime.now().month, description="Enter the month (1-12)")):
    try:
        # Generate the calendar for the specific month and year
        cal = calendar.monthcalendar(year, month)
        
        # Get the month's name
        month_name = calendar.month_name[month]
        
        # Filter events for the given year and month
        events = {
            date: event
            for date, event in EVENTS.items()
            if date.startswith(f"{year}-{month:02d}")
        }
        
        # Return a dictionary of the calendar data
        return {
            "year": year,
            "month": month_name,
            "calendar": cal,
            "events": events
        }
    except Exception as e:
        return {"error": str(e)}