import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './MobileNav.scss';

const MobileNav = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767.98px)");

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMobile) {
    return children;
  }

  return (
    <div className="mobile-nav-wrapper">
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Content with mobile menu state */}
      <div className={`mobile-content ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isMobileMenuOpen,
              setIsMobileMenuOpen,
              isMobile
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default MobileNav;
