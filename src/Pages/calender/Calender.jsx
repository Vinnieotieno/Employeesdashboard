import Navigation from '../../components/navbar/Navigation'
import Sidebar from '../../components/sidebar/Sidebar'
import './calender.scss'
import { useEffect, useState } from 'react'
import { format, parse, startOfWeek, getDay } from "date-fns"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useSelector } from 'react-redux'
import {useAddEventMutation, useGetEventsQuery} from '../../state/usersApiSlice'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AddIcon from '@mui/icons-material/Add'
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TodayIcon from '@mui/icons-material/Today'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ViewDayIcon from '@mui/icons-material/ViewDay'

const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Calender = () => {
  const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null })
  const [allEvents, setAllEvents] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventHistory, setShowEventHistory] = useState(false)
  const [view, setView] = useState('month')
  const [historyFilter, setHistoryFilter] = useState('all') // all, past, upcoming
  const {userInfo} = useSelector(state => state.auth)
  const [addEvent] = useAddEventMutation()
  const {data, isLoading} = useGetEventsQuery()

  useEffect(() => {
    if (data && userInfo && userInfo._id) {
      const filteredEvents = data.filter(
        individualData => individualData.creatorId === userInfo._id
      )

      if (filteredEvents.length > 0) {
        const userEvents = filteredEvents[0].events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
        setAllEvents(userEvents)
      }
    }
  }, [data, userInfo])

  // Don't render if userInfo is null (during logout/authentication)
  if (!userInfo) {
    return null;
  }

  // Helper functions for event filtering
  const getFilteredEvents = () => {
    const now = new Date()
    switch (historyFilter) {
      case 'past':
        return allEvents.filter(event => new Date(event.end) < now)
      case 'upcoming':
        return allEvents.filter(event => new Date(event.start) > now)
      case 'today':
        return allEvents.filter(event =>
          new Date(event.start).toDateString() === now.toDateString()
        )
      default:
        return allEvents
    }
  }

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if(isLoading || !data){
    return <Loader/>
  }

  function handleAddEvent() {
    if (!userInfo || !userInfo._id) {
      toast.error("User not authenticated")
      return
    }

    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      toast.error("Please fill all fields")
      return
    }

    const isClash = allEvents.some((event) => {
      return (
        (event.start <= newEvent.start && newEvent.start <= event.end) ||
        (event.start <= newEvent.end && newEvent.end <= event.end)
      )
    })

    if (isClash) {
      toast.error("Event time clashes with an existing event")
      return
    }

    addEvent({creatorId:userInfo._id, creatorName:userInfo.name, newEvent}).unwrap().then(res =>{
      toast.success("Event added successfully!")
      setShowEventForm(false)
    }).catch(err =>{
      toast.error(err?.message || err?.data?.message)
    })

    setAllEvents([...allEvents, newEvent])
    setNewEvent({ title: "", start: null, end: null })
  }

  function handleEventResize(eventIdx, newSize) {
    const updatedEvents = allEvents.map((event, idx) =>
      idx === eventIdx ? { ...event, end: newSize } : event
    )
    setAllEvents(updatedEvents)
  }

  function handleEventDrop({ event, start, end }) {
    const updatedEvents = allEvents.map((existingEvent) =>
      existingEvent === event
        ? { ...event, start, end }
        : existingEvent
    )
    setAllEvents(updatedEvents)
  }

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#86c517',
      borderRadius: '8px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
      padding: '2px 8px',
      fontSize: '0.875rem',
      fontWeight: '500'
    }
    return { style }
  }

  return (
    <div className="modern-calendar">
      <Sidebar/>

      <div className="calendar-container">
        <Navigation/>
        
        <div className="calendar-wrapper">
          {/* Calendar Header */}
          <div className="calendar-header">
            <div className="header-left">
              <h1>
                <CalendarMonthIcon className="header-icon" />
                My Calendar
              </h1>
              <p className="header-subtitle">Manage your events and schedule</p>
            </div>
            <div className="header-right">
              <div className="view-switcher">
                <button 
                  className={`view-btn ${view === 'month' ? 'active' : ''}`}
                  onClick={() => setView('month')}
                >
                  <TodayIcon /> Month
                </button>
                <button 
                  className={`view-btn ${view === 'week' ? 'active' : ''}`}
                  onClick={() => setView('week')}
                >
                  <ViewWeekIcon /> Week
                </button>
                <button 
                  className={`view-btn ${view === 'day' ? 'active' : ''}`}
                  onClick={() => setView('day')}
                >
                  <ViewDayIcon /> Day
                </button>
              </div>
              <button
                className="history-btn"
                onClick={() => setShowEventHistory(true)}
              >
                <EventIcon /> Event History
              </button>
              <button
                className="add-event-btn"
                onClick={() => setShowEventForm(!showEventForm)}
              >
                <AddIcon /> Add Event
              </button>
            </div>
          </div>

          {/* Event Form */}
          {showEventForm && (
            <div className="event-form-container">
              <div className="event-form">
                <h3>
                  <EventIcon className="form-icon" />
                  Create New Event
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Event Title</label>
                    <input
                      type="text"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date & Time</label>
                    <div className="date-picker-wrapper">
                      <AccessTimeIcon className="input-icon" />
                      <DatePicker
                        selected={newEvent.start}
                        onChange={(start) => setNewEvent({ ...newEvent, start })}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="Pp"
                        placeholderText="Select start date"
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>End Date & Time</label>
                    <div className="date-picker-wrapper">
                      <AccessTimeIcon className="input-icon" />
                      <DatePicker
                        selected={newEvent.end}
                        onChange={(end) => setNewEvent({ ...newEvent, end })}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="Pp"
                        placeholderText="Select end date"
                        minDate={newEvent.start}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setShowEventForm(false)
                      setNewEvent({ title: "", start: null, end: null })
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="submit-btn"
                    onClick={handleAddEvent}
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Event History Modal */}
          {showEventHistory && (
            <div className="event-history-container">
              <div className="event-history-modal">
                <div className="history-header">
                  <h3>
                    <EventIcon className="form-icon" />
                    Event History
                  </h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowEventHistory(false)}
                  >
                    ×
                  </button>
                </div>

                {/* Filter Options */}
                <div className="history-filters">
                  <button
                    className={`filter-btn ${historyFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('all')}
                  >
                    All Events ({allEvents.length})
                  </button>
                  <button
                    className={`filter-btn ${historyFilter === 'past' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('past')}
                  >
                    Past Events ({allEvents.filter(e => new Date(e.end) < new Date()).length})
                  </button>
                  <button
                    className={`filter-btn ${historyFilter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('upcoming')}
                  >
                    Upcoming ({allEvents.filter(e => new Date(e.start) > new Date()).length})
                  </button>
                  <button
                    className={`filter-btn ${historyFilter === 'today' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('today')}
                  >
                    Today ({allEvents.filter(e => new Date(e.start).toDateString() === new Date().toDateString()).length})
                  </button>
                </div>

                {/* Event List */}
                <div className="history-content">
                  {getFilteredEvents().length === 0 ? (
                    <div className="no-events">
                      <EventIcon className="no-events-icon" />
                      <p>No events found for the selected filter.</p>
                    </div>
                  ) : (
                    <div className="events-list">
                      {getFilteredEvents()
                        .sort((a, b) => new Date(b.start) - new Date(a.start)) // Sort by most recent first
                        .map((event, index) => {
                          const isUpcoming = new Date(event.start) > new Date()
                          const isPast = new Date(event.end) < new Date()
                          const isToday = new Date(event.start).toDateString() === new Date().toDateString()

                          return (
                            <div key={index} className={`event-item ${isPast ? 'past' : isUpcoming ? 'upcoming' : 'current'}`}>
                              <div className="event-status">
                                {isToday ? (
                                  <TodayIcon className="status-icon today" />
                                ) : isPast ? (
                                  <AccessTimeIcon className="status-icon past" />
                                ) : (
                                  <EventIcon className="status-icon upcoming" />
                                )}
                              </div>
                              <div className="event-details">
                                <h4 className="event-title">{event.title}</h4>
                                <div className="event-time">
                                  <AccessTimeIcon className="time-icon" />
                                  <span>
                                    {formatEventDate(event.start)} - {formatEventDate(event.end)}
                                  </span>
                                </div>
                                <div className="event-duration">
                                  Duration: {Math.round((new Date(event.end) - new Date(event.start)) / (1000 * 60 * 60))} hours
                                </div>
                              </div>
                              <div className="event-badge">
                                {isToday ? (
                                  <span className="badge today">Today</span>
                                ) : isPast ? (
                                  <span className="badge past">Completed</span>
                                ) : (
                                  <span className="badge upcoming">Upcoming</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>

                {/* History Stats */}
                <div className="history-stats">
                  <div className="stat-summary">
                    <div className="summary-item">
                      <strong>{allEvents.length}</strong>
                      <span>Total Events</span>
                    </div>
                    <div className="summary-item">
                      <strong>{allEvents.filter(e => new Date(e.end) < new Date()).length}</strong>
                      <span>Completed</span>
                    </div>
                    <div className="summary-item">
                      <strong>{allEvents.filter(e => new Date(e.start) > new Date()).length}</strong>
                      <span>Upcoming</span>
                    </div>
                    <div className="summary-item">
                      <strong>
                        {Math.round(
                          allEvents.reduce((total, event) =>
                            total + (new Date(event.end) - new Date(event.start)), 0
                          ) / (1000 * 60 * 60)
                        )}
                      </strong>
                      <span>Total Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Stats */}
          <div className="calendar-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <EventIcon />
              </div>
              <div className="stat-content">
                <h4>Total Events</h4>
                <p className="stat-value">{allEvents.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon today">
                <TodayIcon />
              </div>
              <div className="stat-content">
                <h4>Today's Events</h4>
                <p className="stat-value">
                  {allEvents.filter(event => 
                    new Date(event.start).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon upcoming">
                <AccessTimeIcon />
              </div>
              <div className="stat-content">
                <h4>Upcoming</h4>
                <p className="stat-value">
                  {allEvents.filter(event => 
                    new Date(event.start) > new Date()
                  ).length}
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Component */}
          <div className="calendar-main">
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              view={view}
              onView={setView}
              views={['month', 'week', 'day', 'agenda']}
              selectable
              resizable
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              eventPropGetter={eventStyleGetter}
              popup
              components={{
                event: ({ event }) => (
                  <div className="custom-event">
                    <strong>{event.title}</strong>
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calender