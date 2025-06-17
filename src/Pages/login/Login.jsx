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
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
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
      <div className="animated-bg">
        <div className="gradient-overlay"></div>
        <div className="animated-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="card-header">
            <div className="logo-wrapper">
              <div className="logo-glow"></div>
              <img src={logo || "/placeholder.svg"} className="logo" alt="Company Logo" />
            </div>
            <h1 className="brand-title">Employee Dashboard</h1>
            <p className="brand-subtitle">Welcome back! Please sign in to continue.</p>
          </div>
          
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="login-form">
            <div className={`form-group-wrapper ${isEmailFocused ? 'focused' : ''} ${email ? 'has-value' : ''}`}>
              <Form.Group controlId="validationCustom01">
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Form.Control
                    required
                    type="email"
                    className="modern-input"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                  <Form.Label className="floating-label">Email Address</Form.Label>
                </div>
                <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className={`form-group-wrapper ${isPasswordFocused ? 'focused' : ''} ${password ? 'has-value' : ''}`}>
              <Form.Group controlId="validationCustom02">
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2"/>
                    </svg>
                  </div>
                  <Form.Control
                    required
                    className="modern-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <Form.Label className="floating-label">Password</Form.Label>
                </div>
                <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="form-footer">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            
            <Button 
              variant="primary" 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="button-content">
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </Button>
          </Form>
          
          <div className="typing-container">
            <TypingText className="typetext" texts={text} />
          </div>
        </div>
        
        <div className="login-footer">
          <p>© 2025 GlobeFlight. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login