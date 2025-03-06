import {useState,useEffect, useContext, useRef} from 'react'
import SendIcon from '@mui/icons-material/Send';
import {Form,Row,Col, Button} from 'react-bootstrap'
import './style.scss'
import { AppContext } from '../context/appContext';
import { todayDate, time } from '../TimeAndDate';
import {  useSelector } from "react-redux";

const MessageForm = () => {
    const [message, setMessage] = useState("");
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);

    const {userInfo} = useSelector(state => state.auth)

    const messageEndRef = useRef(null);


    function handleSubmit(e){
      e.preventDefault()
    }

    socket.off('room-messages').on('room-messages',(roomMessages)=>{
      setMessages(roomMessages)
    })


    function handleSubmit(e){
      e.preventDefault()
      if(!message) return
      const roomId = currentRoom
      socket.emit('message-room', roomId, message, userInfo, time, todayDate)
      setMessage("")
    }

    function scrollToBottom() {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
}, [messages]);

  
  return (
    <>
    <div className='messages-output'>
      {userInfo && <div className='roomHeader'> Welcome to {currentRoom} Room, Connect and chat with others</div>}
      {userInfo && messages.map(({_id:date, messagesByDate}, idx) =>(
        <div key={idx}>
          <p className='date'>{date}</p>
          {messagesByDate?.map(({content, time, from:sender}, msgIdx) =>(
            <div className={sender?.email === userInfo?.email ? 'message' : 'incoming-message'} key={msgIdx}>
              <div className="message-inner">
                <div className="d-flex align-tems-center mb-2">
                  <img src={sender?.image ? `https://globeflightapi.onrender.com/${sender.image}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} alt="" />
                  <p className="message-sender">{sender._id ===userInfo?._id ? 'You' : sender.name }</p>
                </div>
                <p className="message-content">{content} <br /> <span className="message-timestamp-left">{time}</span></p>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
    
    <Form onSubmit={handleSubmit} style={{width:'80%', marginLeft:'30px'}}>
    <Row className="text-center">
    <Col sm={10} >
    <Form.Group>
    <Form.Control type="text" placeholder='Your Message'  value={message} onChange={(e) => setMessage(e.target.value)} ></Form.Control>
    </Form.Group>
    </Col>
    <Col sm={2}>
    <Button  variant="primary" type="submit" style={{ width: "90%", backgroundColor: "#6439ff" }}  > <SendIcon/> </Button>
    </Col>
    </Row>
    </Form>
   </>
  )
}

export default MessageForm