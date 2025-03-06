"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button, Form } from "react-bootstrap"
import { useLoginMutation } from "../../state/usersApiSlice"
import { setCredentials } from "../../state/authSlice"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"
import TypingText from "../../components/TypingText"
import logo from "../../static/globeflight.png"
import "./login.scss"

const Login = () => {
  const [validated, setValidated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [text, setText] = useState([
    "Explore our dashboard and find revenue, profit, expenses.",
    "Empower your business decisions with valuable insights.",
    "Unlock data, spot trends, optimize strategies for success.",
  ])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard")
    }
  }, [navigate, userInfo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    try {
      console.log(`Attempting login with email: ${email}, password: ${password}`);
      const res = await login({ email, password }).unwrap()
      console.log(`Login response: ${JSON.stringify(res)}`);
      dispatch(setCredentials({ ...res }))
      navigate("/dashboard")
    } catch (err) {
      console.error(`Login error: ${err?.data?.message || err?.message}`);
      toast.error(err?.data?.message || err?.message)
    }

    setValidated(true)
  }

  return (
    <div className="login">
      <div className="login-container">
        <div className="logo-container">
          <img src={logo || "/placeholder.svg"} className="logo" alt="Company Logo" />
        </div>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="title">Employee Dashboard</h1>
          <h2 className="subtitle">Sign In</h2>
          <Form.Group controlId="validationCustom01">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              required
              type="email"
              className="input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="submit-button">
            {isLoading ? <Loader /> : "Sign In"}
          </Button>
        </Form>
        <TypingText className="typetext" texts={text} />
      </div>
    </div>
  )
}

export default Login

