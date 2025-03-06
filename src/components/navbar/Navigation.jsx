"use client"

import { useContext, useState } from "react"
import "./navbar.scss"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined"
import ListOutlinedIcon from "@mui/icons-material/ListOutlined"
import { DarkModeContext } from "../../context/darkModeContext"
import { Container, Form, Nav, Navbar } from "react-bootstrap"
import { useSelector } from "react-redux"

const Navigation = () => {
  const { dispatch, darkMode } = useContext(DarkModeContext)
  const { userInfo } = useSelector((state) => state.auth)
  const [showSearch, setShowSearch] = useState(false)

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  return (
    <Navbar expand="lg" className={`navigation ${darkMode ? "darkmode" : ""}`}>
      <Container fluid>
        <Navbar.Brand href="/dashboard" className="brand">
          GlobeFlight
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="toggle-button" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto align-items-center">
            <Nav.Link className="nav-item search-toggle" onClick={toggleSearch}>
              <SearchOutlinedIcon />
            </Nav.Link>
            <Form className={`d-flex search ${showSearch ? "show" : ""}`}>
              <Form.Control type="search" placeholder="Search..." className="me-2 search-input" aria-label="Search" />
            </Form>
            <Nav.Link className="nav-item">
              <LanguageOutlinedIcon />
            </Nav.Link>
            <Nav.Link className="nav-item" onClick={() => dispatch({ type: "TOGGLE" })}>
              <DarkModeOutlinedIcon />
            </Nav.Link>
            <Nav.Link className="nav-item">
              <FullscreenExitOutlinedIcon />
            </Nav.Link>
            <Nav.Link className="nav-item">
              <ListOutlinedIcon />
            </Nav.Link>
            <Nav.Link href="/profile" className="nav-item profile">
              <img
                src={
                  userInfo.image
                    ? `${process.env.REACT_APP_API_URL}/${userInfo.image}`
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
                className="avatar"
              />
              <span className="username">{userInfo.name}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation

