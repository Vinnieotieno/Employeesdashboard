import React, { useState, useEffect } from 'react'
import { useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navigation'
import './Layout.scss'

const Layout = ({ children, className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 767.98px)")

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className={`layout ${className}`}>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        isMobile={isMobile}
      />
      
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
