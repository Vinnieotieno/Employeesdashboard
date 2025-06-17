"use client"

import { useContext, useEffect, useState } from "react"
import "./sidebar.scss"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "@mui/material"
import { useLogoutMutation } from "../../state/usersApiSlice"
import { logout } from "../../state/authSlice"
import { DarkModeContext } from "../../context/darkModeContext"

// Import icons
import DashboardIcon from "@mui/icons-material/Dashboard"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import StoreIcon from "@mui/icons-material/Store"
import InsertChartIcon from "@mui/icons-material/InsertChart"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SubtitlesRoundedIcon from "@mui/icons-material/SubtitlesRounded"
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded"
import MessageRoundedIcon from "@mui/icons-material/MessageRounded"
import EditCalendarIcon from "@mui/icons-material/EditCalendar"
import AirIcon from "@mui/icons-material/Air"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import PaymentIcon from "@mui/icons-material/Payment"
import GroupWorkIcon from "@mui/icons-material/GroupWork"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

const Sidebar = () => {
  const [showText, setShowText] = useState(true)
  const { dispatch } = useContext(DarkModeContext)
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()
  const { userInfo } = useSelector((state) => state.auth)
  const isStatsPage = location.pathname === "/stats"

  const isMediumScreen = useMediaQuery("(min-width: 576px) and (max-width: 991.98px)")
  const isSmallScreen = useMediaQuery("(max-width: 575.98px)")

  const toggleText = () => {
    setShowText((prevShowText) => !prevShowText)
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    if (isMediumScreen || isSmallScreen) {
      setShowText(false)
    } else {
      setShowText(true)
    }
  }, [isMediumScreen, isSmallScreen])

  const logoutDispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      logoutDispatch(logout())
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className={`sidebar ${!showText ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {showText && (
          <Link to="/dashboard" className="logo">
            <GroupWorkIcon className="logo-icon" />
            <span>GlobeFlight</span>
          </Link>
        )}
        <button className="menu-toggle" onClick={toggleText}>
          {showText ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="section-title">Main</div>
            <ul>
              <li className={isActive("/dashboard") ? "active" : ""}>
                <Link to="/dashboard">
                  <DashboardIcon className="icon" />
                  {showText && <span>Dashboard</span>}
                </Link>
              </li>
              
              <li className={`menu-item ${showMenu ? "expanded" : ""}`}>
                <div className="expandable-trigger" onClick={toggleMenu}>
                  <SubtitlesRoundedIcon className="icon" />
                  {showText && (
                    <>
                      <span>Departments</span>
                      <KeyboardArrowDownIcon className={`arrow ${showMenu ? "rotated" : ""}`} />
                    </>
                  )}
                </div>
                {showMenu && showText && (
                  <ul className="sub-menu">
                    <li className={isActive("/sales") ? "active" : ""}>
                      <Link to="/sales">Sales</Link>
                    </li>
                    <li className={isActive("/customer-care") ? "active" : ""}>
                      <Link to="/customer-care">Customer Service</Link>
                    </li>
                    <li className={isActive("/operations") ? "active" : ""}>
                      <Link to="/operations">Operations</Link>
                    </li>
                    <li className={isActive("/finance") ? "active" : ""}>
                      <Link to="/finance">Finance</Link>
                    </li>
                    <li className={isActive("/warehouse") ? "active" : ""}>
                      <Link to="/warehouse">Warehouse</Link>
                    </li>
                    <li className={isActive("/management") ? "active" : ""}>
                      <Link to="/management">Management</Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="section-title">Operations</div>
            <ul>
              <li className={isActive("/sales/dump") ? "active" : ""}>
                <Link to="/sales/dump">
                  <WarehouseRoundedIcon className="icon" />
                  {showText && <span>New Dump</span>}
                </Link>
              </li>
              <li className={isActive("/users") ? "active" : ""}>
                <Link to="/users">
                  <PersonOutlineIcon className="icon" />
                  {showText && <span>Users</span>}
                </Link>
              </li>
              <li className={isActive("/sales/orders/list") ? "active" : ""}>
                <Link to="/sales/orders/list">
                  <StoreIcon className="icon" />
                  {showText && <span>Orders</span>}
                </Link>
              </li>
              <li className={isActive("/sales/orders/dump") ? "active" : ""}>
                <Link to="/sales/orders/dump">
                  <StoreIcon className="icon" />
                  {showText && <span>Dumps</span>}
                </Link>
              </li>
              <li className={isActive("/delivery") ? "active" : ""}>
                <Link to="/delivery">
                  <LocalShippingIcon className="icon" />
                  {showText && <span>Delivery</span>}
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="section-title">Analytics & Tools</div>
            <ul>
              {(userInfo.department === "Finance" || userInfo.department === "Management") && (
                <li className={isActive("/stats") ? "active" : ""}>
                  <Link to="/stats">
                    <InsertChartIcon className="icon" />
                    {showText && <span>Stats</span>}
                  </Link>
                </li>
              )}
              <li className={isActive("/chat") ? "active" : ""}>
                <Link to="/chat">
                  <MessageRoundedIcon className="icon" />
                  {showText && <span>Chat</span>}
                  {showText && <span className="badge">3</span>}
                </Link>
              </li>
              <li className={isActive("/calender") ? "active" : ""}>
                <Link to="/calender">
                  <EditCalendarIcon className="icon" />
                  {showText && <span>Calendar</span>}
                </Link>
              </li>
              {isStatsPage && (
                <li className={isActive("/predictions") ? "active" : ""}>
                  <Link to="/predictions">
                    <InsertChartIcon className="icon" />
                    {showText && <span>Predictions</span>}
                  </Link>
                </li>
              )}
              <li className={isActive("/payment") ? "active" : ""}>
                <Link to="/payment">
                  <PaymentIcon className="icon" />
                  {showText && <span>Payment</span>}
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="section-title">Account</div>
            <ul>
              <li className={isActive("/profile") ? "active" : ""}>
                <Link to="/profile">
                  <PersonOutlineIcon className="icon" />
                  {showText && <span>Profile</span>}
                </Link>
              </li>
              <li className={isActive("/management/leave") ? "active" : ""}>
                <Link to="/management/leave">
                  <AirIcon className="icon" />
                  {showText && <span>Leave</span>}
                </Link>
              </li>
              <li className={isActive("/leave-dashboard") ? "active" : ""}>
                <Link to="/leave-dashboard">
                  <DashboardIcon className="icon" />
                  {showText && <span>Leave Management</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="logout-item" onClick={logoutHandler}>
          <ExitToAppIcon className="icon" />
          {showText && <span>Logout</span>}
        </div>
        
        {showText && (
          <div className="theme-switcher">
            <button 
              className="theme-btn light" 
              onClick={() => dispatch({ type: "LIGHT" })}
              title="Light Mode"
            >
              <LightModeIcon />
            </button>
            <button 
              className="theme-btn dark" 
              onClick={() => dispatch({ type: "DARK" })}
              title="Dark Mode"
            >
              <DarkModeIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar