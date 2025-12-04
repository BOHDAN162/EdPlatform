import React from "react";

const WeeklyCalendar = ({ events = [] }) => {
  return (
    <section className="card weekly-calendar">
      <div className="section-head">
        <div>
          <p className="meta">Календарь</p>
          <h3>Ближайшие события</h3>
        </div>
      </div>
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-row">
            <div className="event-date">
              <div className="event-day">{event.day}</div>
              <div className="event-month">{event.month}</div>
            </div>
            <div className="event-body">
              <div className="event-title">{event.title}</div>
              <div className="meta subtle">{event.description}</div>
            </div>
            <div className="pill subtle">{event.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeeklyCalendar;
