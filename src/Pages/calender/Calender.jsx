import Navigation from '../../components/navbar/Navigation'
import Sidebar from '../../components/sidebar/Sidebar'
import './calender.scss'
import { useEffect, useState } from 'react';
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import {useAddEventMutation, useGetEventsQuery} from '../../state/usersApiSlice'
import  {toast} from 'react-toastify'
import Loader from '../../components/Loader';

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calender = () => {
  const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null });
  const [allEvents, setAllEvents] = useState([]);
  const  {userInfo} = useSelector(state => state.auth)
  const [addEvent] = useAddEventMutation()
  const {data, isLoading, refetch} = useGetEventsQuery()

  useEffect(() => {
    refetch();
  
    if (data) {
      const filteredEvents = data.filter(
        individualData => individualData.creatorId === userInfo._id
      );
  
      if (filteredEvents.length > 0) {
        const userEvents = filteredEvents[0].events;
        setAllEvents(userEvents);
      }
    }
  }, [data]);

  if(isLoading || !data){
    return <Loader/>
  }

  function handleAddEvent() {
    const isClash = allEvents.some((event) => {
      return (
        (event.start <= newEvent.start && newEvent.start <= event.end) ||
        (event.start <= newEvent.end && newEvent.end <= event.end)
      );
    });

    if (isClash) {
      alert("Event time clashes with an existing event");
      return;
    }

    addEvent({creatorId:userInfo._id, creatorName:userInfo.name, newEvent}).unwrap().then(res =>{

    }).catch(err =>{
      toast.error(err?.message || err?.data?.message)
    })

    setAllEvents([...allEvents, newEvent]);
    setNewEvent({ title: "", start: null, end: null });
  }

  function handleEventResize(eventIdx, newSize) {
    const updatedEvents = allEvents.map((event, idx) =>
      idx === eventIdx ? { ...event, end: newSize } : event
    );
    setAllEvents(updatedEvents);
  }

  function handleEventDrop({ event, start, end }) {
    const updatedEvents = allEvents.map((existingEvent) =>
      existingEvent === event
        ? { ...event, start, end }
        : existingEvent
    );
    setAllEvents(updatedEvents);
  }

  return (
    <div className="calender">
        <Sidebar/>

        <div className="calenderBody">
            <Navigation/>
            
          <div style={{width:'100%'}}>
        <input
          type="text"
          placeholder="Add Title"
          style={{ width: "20%", marginRight: "10px" }}
          value={newEvent.title}
          className='form-control m-2'
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          style={{ marginRight: "10px" }}
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="Pp"
          className='form-control m-2'
          minDate={new Date()} 
        />
        <DatePicker
          placeholderText="End Date"
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="Pp"
          className='form-control m-2'
          minDate={newEvent.start}
        />
        <button  className={'btn btn-outline-warning m-2 mx-4'} onClick={handleAddEvent}>
          Add Event
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        views={["month","agenda"]}
        selectable
        resizable
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderColor: event.color,
          },
        })}
      />
        </div>
    </div>
  )
}

export default Calender
