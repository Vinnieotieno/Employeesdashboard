import React from 'react'
import './home.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navigation'
import Widget from '../../components/widget/Widget'
import Featured from '../../components/featured/Featured'
import Charts from '../../components/charts/Charts'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'

const Home = () => {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
        <Navbar/>
        
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {greeting}, <span className="highlight">Welcome Back!</span>
            </h1>
            <p className="hero-subtitle">
              Monitor your logistics operations and track performance metrics in real-time
            </p>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <TrendingUpIcon className="card-icon" />
              <span>Revenue Up 23%</span>
            </div>
            <div className="floating-card card-2">
              <LocalShippingIcon className="card-icon" />
              <span>45 Active Shipments</span>
            </div>
            <div className="floating-card card-3">
              <PeopleIcon className="card-icon" />
              <span>12 New Customers</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="quick-stats">
          <div className="stats-header">
            <h2>Quick Overview</h2>
            <button className="view-all-btn">View All Reports</button>
          </div>
          <div className="widgets">
            <Widget type='user' />
            <Widget type='order' />
            <Widget type='driver' />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className="featured-wrapper">
              <div className="section-header">
                <h3>Revenue Analytics</h3>
                <span className="badge">Live</span>
              </div>
              <Featured/>
            </div>
            <div className="chart-wrapper">
              <div className="section-header">
                <h3>Performance Trends</h3>
                <div className="chart-controls">
                  <button className="control-btn active">Year</button>
                  <button className="control-btn">Month</button>
                  <button className="control-btn">Week</button>
                </div>
              </div>
              <Charts title="Revenue Overview" aspect={2/1} />
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="action-cards">
          <div className="action-card">
            <div className="card-icon-wrapper">
              <InventoryIcon className="action-icon" />
            </div>
            <h4>Quick Actions</h4>
            <p>Create new orders, manage inventory, and track shipments</p>
            <button className="action-btn primary">Get Started</button>
          </div>
          <div className="action-card highlight-card">
            <div className="card-icon-wrapper">
              <TrendingUpIcon className="action-icon" />
            </div>
            <h4>Analytics Hub</h4>
            <p>Deep dive into your business metrics and performance data</p>
            <button className="action-btn secondary">Explore Analytics</button>
          </div>
          <div className="action-card">
            <div className="card-icon-wrapper">
              <PeopleIcon className="action-icon" />
            </div>
            <h4>Team Management</h4>
            <p>Manage your team, assign tasks, and track productivity</p>
            <button className="action-btn primary">Manage Team</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home