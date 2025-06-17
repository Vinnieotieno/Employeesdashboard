import React, {useState, useContext, useEffect, useRef} from 'react'
import './chat.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import GroupsIcon from '@mui/icons-material/Groups'
import CircleIcon from '@mui/icons-material/Circle'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import ImageIcon from '@mui/icons-material/Image'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import CloseIcon from '@mui/icons-material/Close'
import { useGetDepartmentsQuery } from '../../state/usersApiSlice'
import { AppContext } from '../../context/appContext'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { addNotification, resetNotification } from '../../state/authSlice'
import Loader from '../../components/Loader'
import EmojiPicker from 'emoji-picker-react'
import { format } from 'date-fns'

const Chat = () => {
  const { data: departments, isLoading, refetch } = useGetDepartmentsQuery()
  const { userInfo } = useSelector(state => state.auth)
  const {newMessages} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const { socket, setCurrentRoom, currentRoom, messages, setMessages } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [onlineUsers, setOnlineUsers] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [filePreview, setFilePreview] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const messageEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (userInfo) {
      setCurrentRoom("General")
      refetch()
      socket.emit("join-room", "General")
      socket.emit("new-user")
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('room-messages', (roomMessages) => {
        // Transform the data structure to match what the UI expects
        const transformedMessages = roomMessages.flatMap(dateGroup => 
          dateGroup.messagesByDate.map(msg => ({
            message: msg.content,
            user: msg.from,
            time: msg.time,
            date: msg.date || dateGroup._id,
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            fileType: msg.fileType,
            fileSize: msg.fileSize
          }))
        )
        setMessages(transformedMessages)
      })

      socket.on('typing', ({ user, room }) => {
        if (room === currentRoom && user !== userInfo.name) {
          setTypingUsers(prev => [...new Set([...prev, user])])
        }
      })

      socket.on('stop-typing', ({ user, room }) => {
        if (room === currentRoom) {
          setTypingUsers(prev => prev.filter(u => u !== user))
        }
      })

      socket.on("online-users", (users) => {
        setOnlineUsers(users)
      })

      return () => {
        socket.off('room-messages')
        socket.off('typing')
        socket.off('stop-typing')
        socket.off("online-users")
      }
    }
  }, [socket, currentRoom, userInfo])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (isLoading || !departments) {
    return <Loader />
  }

  const joinRoom = (department) => {
    if (!userInfo) {
      toast.error('You are not logged in')
    } else {
      socket.emit('join-room', department, currentRoom)
      setCurrentRoom(department)
      if (newMessages && newMessages[department]) {
        dispatch(resetNotification(department))
      }
    }
  }

  socket.off("notifications").on("notifications", (department) => {
    if (currentRoom !== department) {
      dispatch(addNotification(department))
    }
  })

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      socket.emit('typing', { room: currentRoom })
    }
    
    clearTimeout(window.typingTimer)
    window.typingTimer = setTimeout(() => {
      setIsTyping(false)
      socket.emit('stop-typing', { room: currentRoom })
    }, 1000)
  }

  const sendMessage = (messageContent, fileData = null) => {
    const today = new Date()
    const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = today.toLocaleDateString()
    
    // Fixed: Correct parameter order to match server expectation
    socket.emit('message-room', currentRoom, messageContent, userInfo, time, date, fileData)
    
    setMessage('')
    setFilePreview(null)
    setIsTyping(false)
    socket.emit('stop-typing', { room: currentRoom })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() || filePreview) {
      if (filePreview) {
        sendMessage(message.trim() || `Shared a ${filePreview.type}`, {
          fileUrl: filePreview.url,
          fileName: filePreview.name,
          fileType: filePreview.type,
          fileSize: filePreview.size
        })
      } else {
        sendMessage(message)
      }
    }
  }

  const handleEmojiClick = (emojiObject) => {
    // Fixed: Updated for latest emoji-picker-react API
    setMessage(prev => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <ImageIcon />
    if (fileType === 'application/pdf') return <PictureAsPdfIcon />
    return <InsertDriveFileIcon />
  }

  const handleFileUpload = async (e, isImage = false) => {
    const file = e.target.files[0]
    if (!file) return

    // File size limit (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Image size limit (5MB)
    if (isImage && file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploadingFile(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        const fileUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${data.filename}`
        
        setFilePreview({
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          isImage: file.type.startsWith('image/')
        })
        
        toast.success('File uploaded successfully!')
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error uploading file')
    } finally {
      setUploadingFile(false)
    }
  }

  const formatMessageTime = (time) => {
    return time || format(new Date(), 'HH:mm')
  }

  const isMessageFromCurrentUser = (messageUser) => {
    return messageUser?._id && userInfo?._id && messageUser._id === userInfo._id
  }

  const getMessagesByDate = () => {
    const grouped = {}
    messages.forEach(msg => {
      const date = msg.date || format(new Date(), 'dd/MM/yyyy')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(msg)
    })
    return grouped
  }

  const filteredDepartments = departments?.filter(dept => 
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const messagesByDate = getMessagesByDate()

  const FilePreview = ({ file, onRemove }) => (
    <div className="file-preview">
      <div className="file-preview-content">
        {file.isImage ? (
          <img src={file.url} alt={file.name} className="preview-image" />
        ) : (
          <div className="file-icon-preview">
            {getFileIcon(file.type)}
            <span className="file-name">{file.name}</span>
          </div>
        )}
        <div className="file-info">
          <span className="file-size">{formatFileSize(file.size)}</span>
        </div>
      </div>
      <button className="remove-file-btn" onClick={onRemove}>
        <CloseIcon />
      </button>
    </div>
  )

  const MessageFile = ({ fileUrl, fileName, fileType, fileSize }) => (
    <div className="message-file">
      {fileType?.startsWith('image/') ? (
        <div className="message-image">
          <img src={fileUrl} alt={fileName} />
        </div>
      ) : (
        <div className="message-document">
          <div className="document-icon">
            {getFileIcon(fileType)}
          </div>
          <div className="document-info">
            <span className="document-name">{fileName}</span>
            <span className="document-size">{formatFileSize(fileSize)}</span>
          </div>
          <a 
            href={fileUrl} 
            download={fileName}
            className="download-btn"
            title="Download file"
          >
            <DownloadIcon />
          </a>
        </div>
      )}
    </div>
  )

  return (
    <div className='modern-chat'>
      <Sidebar/>

      <div className="chat-container">
        <Navigation/>

        <div className="chat-wrapper">
          {/* Chat Sidebar */}
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h2>
                <GroupsIcon className="header-icon" />
                Chat Rooms
              </h2>
              <button className="settings-btn">
                <MoreVertIcon />
              </button>
            </div>

            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input 
                type="text" 
                placeholder="Search rooms..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rooms-list">
              <h3 className="list-title">Available Departments</h3>
              {filteredDepartments?.map((department, idx) => (
                <div
                  key={idx}
                  className={`room-item ${currentRoom === department ? 'active' : ''}`}
                  onClick={() => {
                    if (department !== currentRoom) {
                      joinRoom(department)
                    }
                  }}
                >
                  <div className="room-avatar">
                    {department.charAt(0)}
                  </div>
                  <div className="room-info">
                    <h4 className="room-name">{department}</h4>
                    <p className="room-status">
                      <CircleIcon className="status-icon online" />
                      {onlineUsers[department] || 0} online
                    </p>
                  </div>
                  {currentRoom !== department && newMessages?.[department] && (
                    <span className="notification-badge">
                      {newMessages[department]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Main Area */}
          <div className="chat-main">
            {currentRoom ? (
              <>
                <div className="chat-header">
                  <div className="header-left">
                    <div className="chat-avatar">
                      {currentRoom.charAt(0)}
                    </div>
                    <div className="chat-info">
                      <h3>{currentRoom}</h3>
                      <p>
                        <CircleIcon className="status-icon online" />
                        {onlineUsers[currentRoom] || 0} members online
                      </p>
                    </div>
                  </div>
                  <div className="header-actions">
                    <button className="action-btn">
                      <SearchIcon />
                    </button>
                    <button className="action-btn">
                      <MoreVertIcon />
                    </button>
                  </div>
                </div>

                <div className="chat-messages">
                  <div className="messages-container">
                    {Object.entries(messagesByDate).map(([date, dateMessages]) => (
                      <div key={date} className="message-group">
                        <div className="date-divider">
                          <span>{date === format(new Date(), 'dd/MM/yyyy') ? 'Today' : date}</span>
                        </div>
                        {dateMessages.map((msg, idx) => {
                           if (!msg?.user) return null

                            const isCurrentUser = isMessageFromCurrentUser(msg.user)
                            const showAvatar = idx === 0 || dateMessages[idx - 1]?.user?._id !== msg.user._id

                          return (
                            <div 
                              key={idx} 
                              className={`message-wrapper ${isCurrentUser ? 'sent' : 'received'}`}
                            >
                              {!isCurrentUser && showAvatar && (
                            <div className="message-avatar">
                                    {msg.user?.image ? (
                                     <img src={`${process.env.REACT_APP_API_URL}/${msg.user.image}`} alt="" />
                                    ) : (
                                             <div className="avatar-placeholder">
                                                   {msg.user?.name?.charAt(0) || "?"}
                                         </div>
                                           )}
                              </div>
                                )}

                              
                              <div className="message-content">
                                {!isCurrentUser && showAvatar && (
                                  <div className="message-sender">{msg.user.name}</div>
                                )}
                                <div className="message-bubble">
                                  {msg.message && <p>{msg.message}</p>}
                                  {msg.fileUrl && (
                                    <MessageFile 
                                      fileUrl={msg.fileUrl}
                                      fileName={msg.fileName}
                                      fileType={msg.fileType}
                                      fileSize={msg.fileSize}
                                    />
                                  )}
                                  <div className="message-meta">
                                    <span className="message-time">{formatMessageTime(msg.time)}</span>
                                    {isCurrentUser && (
                                      <DoneAllIcon className="message-status read" />
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {isCurrentUser && (
                                <button className="message-options">
                                  <MoreVertIcon />
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                    
                    {typingUsers.length > 0 && (
                      <div className="typing-indicator">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="typing-text">
                          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                        </span>
                      </div>
                    )}
                    
                    <div ref={messageEndRef} />
                  </div>

                  <form className="message-input-form" onSubmit={handleSubmit}>
                    {filePreview && (
                      <FilePreview 
                        file={filePreview} 
                        onRemove={() => setFilePreview(null)} 
                      />
                    )}
                    
                    <div className="input-container">
                      <button 
                        type="button" 
                        className="attach-btn" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        title="Attach file"
                      >
                        <AttachFileIcon />
                      </button>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, false)}
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                      
                      <button 
                        type="button" 
                        className="image-btn"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingFile}
                        title="Upload image"
                      >
                        <ImageIcon />
                      </button>
                      
                      <input 
                        type="file" 
                        ref={imageInputRef}
                        onChange={(e) => handleFileUpload(e, true)}
                        style={{ display: 'none' }}
                        accept="image/*"
                      />
                      
                      <input
                        type="text"
                        placeholder={uploadingFile ? "Uploading..." : "Type your message..."}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value)
                          handleTyping()
                        }}
                        className="message-input"
                        disabled={uploadingFile}
                      />
                      
                      <button 
                        type="button" 
                        className="emoji-btn"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        title="Add emoji"
                      >
                        <EmojiEmotionsIcon />
                      </button>
                      
                      <button 
                        type="submit" 
                        className="send-btn"
                        disabled={(!message.trim() && !filePreview) || uploadingFile}
                        title="Send message"
                      >
                        <SendIcon />
                      </button>
                    </div>
                    
                    {showEmojiPicker && (
                      <div className="emoji-picker-container">
                        <EmojiPicker 
                          onEmojiClick={handleEmojiClick}
                          autoFocusSearch={false}
                          theme="light"
                          searchPlaceHolder="Search emoji..."
                          width="100%"
                          height="350px"
                        />
                      </div>
                    )}
                  </form>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="empty-state">
                  <MarkChatReadIcon className="empty-icon" />
                  <h3>Welcome to GlobeFlight Chat</h3>
                  <p>Select a department from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat