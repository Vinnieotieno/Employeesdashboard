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
  const [view, setView] = useState('month')
  const {userInfo} = useSelector(state => state.auth)
  const [addEvent] = useAddEventMutation()
  const {data, isLoading, refetch} = useGetEventsQuery()

  useEffect(() => {
    refetch()
  
    if (data) {
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
  }, [data])

  if(isLoading || !data){
    return <Loader/>
  }

  function handleAddEvent() {
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