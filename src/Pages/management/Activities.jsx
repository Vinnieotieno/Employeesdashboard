import {useEffect, useState} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useGetEventsQuery} from '../../state/usersApiSlice'
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Sidebar from '../../components/sidebar/Sidebar';
import Navigation from '../../components/navbar/Navigation';

const Activities = () => {
  const {data, isLoading, refetch} = useGetEventsQuery()
  const {userInfo} = useSelector(state => state.auth)
  const [todaysEvents, setTodaysEvents] = useState([])

  useEffect(() => {
    refetch(); 
  
    if (data) {
      if (data.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const todayEvents = data.reduce((accumulator, currentData) => {
          const filteredEventsForToday = currentData.events
            .filter(event => {
              const eventStart = new Date(event.start);
              return (
                eventStart >= today &&
                eventStart < new Date(today.getTime() + 24 * 60 * 60 * 1000) // Adding 24 hours to get the next day
              );
            })
            .map(event => ({
              ...event,
              creatorName: currentData.creatorName 
            }));
  
          return accumulator.concat(filteredEventsForToday);
        }, []);
  
        setTodaysEvents(todayEvents);
      }
    }
  }, [data]);
  

  if(isLoading || !data){
    return <Loader/>
  }

  let columns = [
    { field: "id", headerName: "ID", width: 80 },
    {field: "creatorName",headerName: "Event Planner",width: 130,},
    { field: "title", headerName: "Event Title", width: 200 },
    {field: "start",headerName: "Start Date & Time",width: 200,},
    {field: "end",headerName: "End Date & Time",width: 200,},
  ]

  const rows = todaysEvents?.map((item) => ({
    id: item._id,
    creatorName: item.creatorName,
    title: item.title,
    start: new Date(item.start).toLocaleString().split(", "),
    end: new Date(item.end).toLocaleString().split(", "),
  }));
  
  return (
    <div className='activities'>
      <Sidebar/>

      <div className="activitiesBody">
        <Navigation/>

        <h4 className="text-center">Today's Activities and Events</h4>
        <DataGrid rows={rows} columns={columns} pageSize={5}  />
      </div>
    </div>
  )
}

export default Activities