"use client"

import { useContext, useState, useEffect } from "react"
import "./navbar.scss"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { DarkModeContext } from "../../context/darkModeContext"
import { Container, Form, Nav, Navbar, Dropdown } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useMediaQuery } from "@mui/material"

import StoreIcon from "@mui/icons-material/Store"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import Avatar from "@mui/material/Avatar"
import { useGetNotificationsQuery } from "../../state/leaveApiSlice"


const Navigation = () => {
  const { dispatch, darkMode } = useContext(DarkModeContext)
  const { userInfo } = useSelector((state) => state.auth)
  const [showSearch, setShowSearch] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 767.98px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 991.98px)")
  const isDesktop = useMediaQuery("(min-width: 992px)")

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useGetNotificationsQuery()

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (isDesktop) {
      setShowMobileMenu(false)
    }
  }, [isDesktop])

  // Don't render if userInfo is null (during logout/authentication)
  if (!userInfo) {
    return null;
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log('Searching for:', searchQuery)
      // You can add navigation to search results page or filter current data
    }
  }

  const handleSettings = () => {
    // Navigate to settings page or open settings modal
    window.location.href = '/settings'
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <Navbar expand="lg" className={`modern-navigation ${darkMode ? "dark-mode" : ""} ${isMobile ? "mobile" : ""}`}>
      <Container fluid>
        <div className="nav-left">
          <div className="greeting-section">
            <h5 className="greeting">
              {isMobile ? `Hi, ${userInfo?.name?.split(' ')[0] || 'User'}!` : `${greeting}, ${userInfo?.name?.split(' ')[0] || 'User'}!`}
            </h5>
            {!isMobile && (
              <p className="sub-greeting">Here's what's happening with your logistics today</p>
            )}
          </div>
        </div>

        <Nav className="nav-right">
          {/* Search */}
          <div className={`search-container ${showSearch ? "active" : ""}`}>
            <button className="nav-icon-btn search-trigger" onClick={toggleSearch}>
              <SearchOutlinedIcon />
            </button>
            <Form className="search-form" onSubmit={handleSearch}>
              <SearchOutlinedIcon className="search-icon" />
              <Form.Control
                type="search"
                placeholder="Search orders, users, or anything..."
                className="search-input"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="search-shortcut">⌘K</kbd>
            </Form>
          </div>

          {/* Notifications */}
          <Dropdown className="notification-dropdown">
            <Dropdown.Toggle as="button" className="nav-icon-btn">
              <NotificationsNoneIcon />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification-menu">
              <div className="notification-header">
                <h6>Notifications</h6>
                <button className="mark-read">Mark all as read</button>
              </div>
              <Dropdown.Divider />
              <div className="notification-list">
                {notificationsLoading ? (
                  <div className="notification-item">
                    <div className="notification-content">
                      <p>Loading notifications...</p>
                    </div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification, index) => (
                    <div key={index} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                      <div className="notification-icon">
                        <StoreIcon />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.message}</p>
                        <p className="notification-time">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-item">
                    <div className="notification-content">
                      <p>No notifications</p>
                    </div>
                  </div>
                )}
              </div>
              <Dropdown.Divider />
              <div className="notification-footer">
                <a href="/notifications">View all notifications</a>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Language */}
          <button className="nav-icon-btn">
            <LanguageOutlinedIcon />
          </button>

          {/* Theme Toggle */}
          <button 
            className="nav-icon-btn theme-toggle" 
            onClick={() => dispatch({ type: "TOGGLE" })}
          >
            {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </button>

          {/* Fullscreen */}
          <button className="nav-icon-btn" onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExitOutlinedIcon /> : <FullscreenIcon />}
          </button>

          {/* Settings */}
          <button className="nav-icon-btn" onClick={handleSettings}>
            <SettingsOutlinedIcon />
          </button>

          {/* Profile Dropdown */}
          <Dropdown className="profile-dropdown">
            <Dropdown.Toggle as="div" className="profile-trigger">
              <div className="profile-info">
                <span className="profile-name">{userInfo?.name || 'User'}</span>
                <span className="profile-role">{userInfo?.department || 'Department'}</span>
              </div>
              <Avatar
                src={
                  userInfo?.image
                    ? `${process.env.REACT_APP_API_URL}/${userInfo.image}`
                    : undefined
                }
                alt="Profile"
                className="profile-avatar"
                sx={{ width: 40, height: 40, bgcolor: '#86c517' }}
              >
                {!userInfo?.image && (userInfo?.name || 'U').charAt(0).toUpperCase()}
              </Avatar>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-menu">
              <div className="profile-header">
                <Avatar
                  src={
                    userInfo?.image
                      ? `${process.env.REACT_APP_API_URL}/${userInfo.image}`
                      : undefined
                  }
                  alt="Profile"
                  className="profile-avatar-large"
                  sx={{ width: 60, height: 60, bgcolor: '#86c517' }}
                >
                  {!userInfo?.image && (userInfo?.name || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <div className="profile-details">
                  <h6>{userInfo?.name || 'User'}</h6>
                  <p>{userInfo?.email || 'user@example.com'}</p>
                </div>
              </div>
              <Dropdown.Divider />
              <Dropdown.Item href="/profile">
                <PersonOutlineIcon /> My Profile
              </Dropdown.Item>
              <Dropdown.Item href="/settings">
                <SettingsOutlinedIcon /> Settings
              </Dropdown.Item>
              <Dropdown.Item href="/help">
                <HelpOutlineIcon /> Help & Support
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="logout-item">
                <ExitToAppIcon /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Navigation
