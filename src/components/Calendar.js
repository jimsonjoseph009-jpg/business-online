import React, { useState } from 'react';
import './Calendar.css';
import { useLocalization } from '../contexts/LocalizationContext';

const Calendar = () => {
  const { t } = useLocalization();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Order Delivery',
      date: new Date(2024, 0, 5),
      type: 'delivery',
      customer: 'John Doe',
      orderId: 'ORD-001',
      time: '10:00 AM'
    },
    {
      id: 2,
      title: 'Payment Due',
      date: new Date(2024, 0, 8),
      type: 'payment',
      amount: 5000,
      orderId: 'ORD-002',
      time: '09:00 AM'
    },
    {
      id: 3,
      title: 'Inventory Check',
      date: new Date(2024, 0, 12),
      type: 'inventory',
      location: 'Main Warehouse',
      time: '02:00 PM'
    },
    {
      id: 4,
      title: 'Customer Meeting',
      date: new Date(2024, 0, 15),
      type: 'meeting',
      customer: 'ABC Corp',
      time: '11:00 AM'
    },
    {
      id: 5,
      title: 'Stock Arrival',
      date: new Date(2024, 0, 18),
      type: 'stock',
      quantity: 500,
      time: '08:00 AM'
    },
  ]);
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'delivery',
    time: '09:00 AM',
    customer: '',
    orderId: '',
    amount: '',
    location: '',
    quantity: ''
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setFormData({
      title: '',
      type: 'delivery',
      time: '09:00 AM',
      customer: '',
      orderId: '',
      amount: '',
      location: '',
      quantity: ''
    });
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormData(event);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (!formData.title.trim()) return;

    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...formData, id: selectedEvent.id } : e));
      setSelectedEvent(null);
    } else {
      const newEvent = {
        id: Date.now(),
        ...formData,
        date: selectedDate
      };
      setEvents([...events, newEvent]);
    }

    setShowEventModal(false);
    setFormData({
      title: '',
      type: 'delivery',
      time: '09:00 AM',
      customer: '',
      orderId: '',
      amount: '',
      location: '',
      quantity: ''
    });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
    setShowEventModal(false);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days with dates
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`event-dot ${event.type}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
                title={event.title}
              ></div>
            ))}
            {dayEvents.length > 2 && <div className="more-events">+{dayEvents.length - 2}</div>}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="week-view">
        {weekDays.map((date, idx) => (
          <div key={idx} className="week-day">
            <div className="week-day-header">
              <div className="day-name">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</div>
              <div className={`day-date ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                {date.getDate()}
              </div>
            </div>
            <div className="week-day-events">
              {getEventsForDate(date).map(event => (
                <div
                  key={event.id}
                  className={`week-event ${event.type}`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="event-time">{event.time}</div>
                  <div className="event-title">{event.title}</div>
                </div>
              ))}
              <div className="add-event-btn" onClick={() => {
                setSelectedDate(date);
                setShowEventModal(true);
              }}>
                + Add
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="day-view">
        <div className="day-view-header">
          <h3>{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        </div>
        <div className="day-timeline">
          {hours.map(hour => {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            const eventsAtHour = dayEvents.filter(e => e.time.includes(hour.toString().padStart(2, '0')));

            return (
              <div key={hour} className="hour-block">
                <div className="hour-time">{timeStr}</div>
                <div className="hour-events">
                  {eventsAtHour.map(event => (
                    <div
                      key={event.id}
                      className={`day-event ${event.type}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-title">{event.title}</div>
                      <div className="event-meta">{event.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>📅 {t('calendar', 'title')}</h1>
        <p>{t('calendar', 'description')}</p>
      </div>

      {/* Controls */}
      <div className="calendar-controls">
        <button onClick={handlePrevMonth} className="nav-btn">← {t('calendar', 'previous')}</button>
        <button onClick={handleToday} className="today-btn">{t('calendar', 'today')}</button>
        <button onClick={handleNextMonth} className="nav-btn">{t('calendar', 'next')} →</button>
        
        <div className="view-mode">
          <button
            className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            {t('calendar', 'monthView')}
          </button>
          <button
            className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            {t('calendar', 'weekView')}
          </button>
          <button
            className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            {t('calendar', 'dayView')}
          </button>
        </div>

        <h2 className="month-title">{monthName}</h2>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot delivery"></div>
          <span>{t('calendar', 'typeDelivery')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot payment"></div>
          <span>{t('calendar', 'typePayment')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot inventory"></div>
          <span>{t('calendar', 'typeInventory')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot meeting"></div>
          <span>{t('calendar', 'typeMeeting')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot stock"></div>
          <span>{t('calendar', 'typeStock')}</span>
        </div>
      </div>

      {/* Calendar View */}
      <div className="calendar-content">
        {viewMode === 'month' && (
          <div className="month-view">
            <div className="calendar-grid-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="grid-header-day">{day}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {renderCalendarGrid()}
            </div>
          </div>
        )}

        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Event Statistics */}
      <div className="event-stats">
        <div className="stat-card">
          <h3>{events.length}</h3>
          <p>{t('calendar', 'totalEvents')}</p>
        </div>
        <div className="stat-card">
          <h3>{events.filter(e => e.type === 'delivery').length}</h3>
          <p>{t('calendar', 'typeDelivery')}</p>
        </div>
        <div className="stat-card">
          <h3>{events.filter(e => e.type === 'payment').length}</h3>
          <p>{t('calendar', 'typePayment')}</p>
        </div>
        <div className="stat-card">
          <h3>{events.filter(e => e.type === 'inventory').length}</h3>
          <p>{t('calendar', 'typeInventory')}</p>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent ? t('calendar', 'editEvent') : t('calendar', 'addEvent')}</h2>
              <button className="close-btn" onClick={() => {
                setShowEventModal(false);
                setSelectedEvent(null);
              }}>✕</button>
            </div>

            <div className="form-group">
              <label>{t('calendar', 'eventTitle')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('calendar', 'enterTitle')}
              />
            </div>

            <div className="form-group">
              <label>{t('calendar', 'eventType')}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="delivery">{t('calendar', 'typeDelivery')}</option>
                <option value="payment">{t('calendar', 'typePayment')}</option>
                <option value="inventory">{t('calendar', 'typeInventory')}</option>
                <option value="meeting">{t('calendar', 'typeMeeting')}</option>
                <option value="stock">{t('calendar', 'typeStock')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('calendar', 'time')}</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            {formData.type === 'delivery' && (
              <>
                <div className="form-group">
                  <label>{t('calendar', 'customer')}</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder={t('calendar', 'enterCustomer')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('calendar', 'orderId')}</label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="ORD-001"
                  />
                </div>
              </>
            )}

            {formData.type === 'payment' && (
              <>
                <div className="form-group">
                  <label>{t('calendar', 'amount')}</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>{t('calendar', 'orderId')}</label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="ORD-001"
                  />
                </div>
              </>
            )}

            {formData.type === 'inventory' && (
              <div className="form-group">
                <label>{t('calendar', 'location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('calendar', 'enterLocation')}
                />
              </div>
            )}

            {formData.type === 'stock' && (
              <div className="form-group">
                <label>{t('calendar', 'quantity')}</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => {
                setShowEventModal(false);
                setSelectedEvent(null);
              }}>
                {t('calendar', 'cancel')}
              </button>
              {selectedEvent && (
                <button className="btn-delete" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  {t('calendar', 'delete')}
                </button>
              )}
              <button className="btn-save" onClick={handleAddEvent}>
                {selectedEvent ? t('calendar', 'update') : t('calendar', 'save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
