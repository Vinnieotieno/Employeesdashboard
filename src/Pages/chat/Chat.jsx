import React, {useState, useContext, useEffect} from 'react'
import './chat.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import {ListGroup} from 'react-bootstrap'
import MessageForm from '../../components/MessageForm';
import { useGetDepartmentsQuery } from '../../state/usersApiSlice';
import { AppContext } from '../../context/appContext';
import {useDispatch, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { addNotification, resetNotification } from '../../state/authSlice';
import Loader from '../../components/Loader'

const Chat = () => {
  const { data: departments, isLoading, refetch } = useGetDepartmentsQuery();
  const { userInfo } = useSelector(state => state.auth);
  const {newMessages} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { socket, setCurrentRoom, setRooms, rooms, currentRoom } = useContext(AppContext);



  useEffect(() => {
    if (userInfo) {
      setCurrentRoom("General");
      refetch();
      socket.emit("join-room", "General");
      socket.emit("new-user");
    }
  }, []);

  if (isLoading || !departments) {
    return <Loader />;
  }

  const joinRoom = (department) => {
    if (!userInfo) {
      toast.error('You are not logged in');
    } else {
      socket.emit('join-room', department, currentRoom);
      setCurrentRoom(department);
      if (newMessages && newMessages[department]) {
        console.log("Resetting notification for", department);
        dispatch(resetNotification(department));
      } else {
        console.log("No notification to reset for", department);
      }
    }
  }

  const leaveRoom = (department) => {
    if (!userInfo) {
      toast.error('You are not logged in');
    }
    socket.emit('leave-room', department);
    setCurrentRoom(null);
  }

  socket.off("notifications").on("notifications", (department) => {
    if (currentRoom !== department) {
      dispatch(addNotification(department));
    }
  });
  
  return (
    <div className='chat'>
      <Sidebar/>

      <div className="chatContainer">
        <Navigation/>

        <div className="chatDetails">
          <h1 className="text-center" style={{color:"#6439ff", fontSize:'30px', fontWeight:"800"}}>Department Chat Center <MarkChatReadIcon/> </h1>
          <div className="chatBody">
          <div className="sidebarChat">
        <h2 style={{ color: "#6439ff", fontSize: '20px', fontWeight: "800" }}>Available Rooms</h2>
        <ListGroup>
          {departments?.map((department, idx) => (
            <ListGroup.Item
              key={idx}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
              onClick={() => {
                if (department !== currentRoom) {
                  joinRoom(department);
                } else {
                  leaveRoom(department);
                }
              }}
              active={currentRoom && department === currentRoom}
            >
              {department}
              {currentRoom !== department && newMessages?.[department] && (
                <span className="badge rounded-pill bg-info">
                { newMessages?.[department]}
              </span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
            <div className="chatScreen">
            <MessageForm/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat