"use client"

import { useContext, useState } from "react"
import "./navbar.scss"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { DarkModeContext } from "../../context/darkModeContext"
import { Container, Form, Nav, Navbar, Dropdown } from "react-bootstrap"
import { useSelector } from "react-redux"

import StoreIcon from "@mui/icons-material/Store"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"


const Navigation = () => {
  const { dispatch, darkMode } = useContext(DarkModeContext)
  const { userInfo } = useSelector((state) => state.auth)
  const [showSearch, setShowSearch] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleSearch = () => {
    setShowSearch(!showSearch)
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
    <Navbar expand="lg" className={`modern-navigation ${darkMode ? "dark-mode" : ""}`}>
      <Container fluid>
        <div className="nav-left">
          <div className="greeting-section">
            <h5 className="greeting">{greeting}, {userInfo.name?.split(' ')[0]}!</h5>
            <p className="sub-greeting">Here's what's happening with your logistics today</p>
          </div>
        </div>

        <Nav className="nav-right">
          {/* Search */}
          <div className={`search-container ${showSearch ? "active" : ""}`}>
            <button className="nav-icon-btn search-trigger" onClick={toggleSearch}>
              <SearchOutlinedIcon />
            </button>
            <Form className="search-form">
              <SearchOutlinedIcon className="search-icon" />
              <Form.Control 
                type="search" 
                placeholder="Search orders, users, or anything..." 
                className="search-input" 
                aria-label="Search" 
              />
              <kbd className="search-shortcut">⌘K</kbd>
            </Form>
          </div>

          {/* Notifications */}
          <Dropdown className="notification-dropdown">
            <Dropdown.Toggle as="button" className="nav-icon-btn">
              <NotificationsNoneIcon />
              <span className="notification-badge">5</span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification-menu">
              <div className="notification-header">
                <h6>Notifications</h6>
                <button className="mark-read">Mark all as read</button>
              </div>
              <Dropdown.Divider />
              <div className="notification-list">
                <div className="notification-item unread">
                  <div className="notification-icon order">
                    <StoreIcon />
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">New order received</p>
                    <p className="notification-time">2 minutes ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon delivery">
                    <LocalShippingIcon />
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">Delivery completed</p>
                    <p className="notification-time">1 hour ago</p>
                  </div>
                </div>
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
          <button className="nav-icon-btn">
            <SettingsOutlinedIcon />
          </button>

          {/* Profile Dropdown */}
          <Dropdown className="profile-dropdown">
            <Dropdown.Toggle as="div" className="profile-trigger">
              <div className="profile-info">
                <span className="profile-name">{userInfo.name}</span>
                <span className="profile-role">{userInfo.department}</span>
              </div>
              <img
                src={
                  userInfo.image
                    ? `${process.env.REACT_APP_API_URL}/${userInfo.image}`
                    : "https://ui-avatars.com/api/?name=" + userInfo.name + "&background=86c517&color=fff"
                }
                alt="Profile"
                className="profile-avatar"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-menu">
              <div className="profile-header">
                <img
                  src={
                    userInfo.image
                      ? `${process.env.REACT_APP_API_URL}/${userInfo.image}`
                      : "https://ui-avatars.com/api/?name=" + userInfo.name + "&background=86c517&color=fff"
                  }
                  alt="Profile"
                  className="profile-avatar-large"
                />
                <div className="profile-details">
                  <h6>{userInfo.name}</h6>
                  <p>{userInfo.email}</p>
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
