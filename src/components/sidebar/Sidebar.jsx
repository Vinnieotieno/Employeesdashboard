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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

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

  return (
    <div className={`sidebar ${!showText ? "collapsed" : ""}`}>
      <div className="top">
        {showText && (
          <Link to="/dashboard" className="logo">
            GlobeFlight
          </Link>
        )}
        <MenuIcon className="menu-icon" onClick={toggleText} />
      </div>
      <div className="center">
        <ul>
          <li>
            <Link to="/dashboard">
              <DashboardIcon className="icon" />
              {showText && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="menu-item">
            <div onClick={toggleMenu}>
              <SubtitlesRoundedIcon className="icon" />
              {showText && <span>Departments</span>}
              {showMenu ? <KeyboardArrowUpIcon className="arrow" /> : <KeyboardArrowDownIcon className="arrow" />}
            </div>
            {showMenu && (
              <ul className="sub-menu">
                <li>
                  <Link to="/sales">
                    <span>Sales</span>
                  </Link>
                </li>
                <li>
                  <Link to="/customer-care">
                    <span>Customer Service</span>
                  </Link>
                </li>
                <li>
                  <Link to="/operations">
                    <span>Operations</span>
                  </Link>
                </li>
                <li>
                  <Link to="/finance">
                    <span>Finance</span>
                  </Link>
                </li>
                <li>
                  <Link to="/warehouse">
                    <span>Warehouse</span>
                  </Link>
                </li>
                <li>
                  <Link to="/management">
                    <span>Management</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/sales/dump">
              <WarehouseRoundedIcon className="icon" />
              {showText && <span>New Dump</span>}
            </Link>
          </li>
          <li>
            <Link to="/users">
              <PersonOutlineIcon className="icon" />
              {showText && <span>Users</span>}
            </Link>
          </li>
          <li>
            <Link to="/sales/orders/list">
              <StoreIcon className="icon" />
              {showText && <span>Orders</span>}
            </Link>
          </li>
          <li>
            <Link to="/sales/orders/dump">
              <StoreIcon className="icon" />
              {showText && <span>Dumps</span>}
            </Link>
          </li>
          <li>
            <Link to="/delivery">
              <LocalShippingIcon className="icon" />
              {showText && <span>Delivery</span>}
            </Link>
          </li>
          {(userInfo.department === "Finance" || userInfo.department === "Management") && (
            <li>
              <Link to="/stats">
                <InsertChartIcon className="icon" />
                {showText && <span>Stats</span>}
              </Link>
            </li>
          )}
          <li>
            <Link to="/chat">
              <MessageRoundedIcon className="icon" />
              {showText && <span>Chat</span>}
            </Link>
          </li>
          <li>
            <Link to="/calender">
              <EditCalendarIcon className="icon" />
              {showText && <span>Calendar</span>}
            </Link>
          </li>
          {isStatsPage && (
            <li>
              <Link to="/predictions">
                <InsertChartIcon className="icon" />
                {showText && <span>Predictions</span>}
              </Link>
            </li>
          )}
           <li>
            <Link to="/payment">
              <EditCalendarIcon className="icon" />
              {showText && <span>Payment</span>}
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <PersonOutlineIcon className="icon" />
              {showText && <span>Profile</span>}
            </Link>
          </li>
          <li>
            <Link to="/management/leave">
              <AirIcon className="icon" />
              {showText && <span>Leave</span>}
            </Link>
          </li>
          <li onClick={logoutHandler}>
            <ExitToAppIcon className="icon" />
            {showText && <span>Logout</span>}
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="color-options">
          <div className="color-option light" onClick={() => dispatch({ type: "LIGHT" })}></div>
          <div className="color-option dark" onClick={() => dispatch({ type: "DARK" })}></div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

