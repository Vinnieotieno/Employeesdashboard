import React from 'react'
import './home.scss'
import Layout from '../../components/layout/Layout'
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
    <Layout className="home">

        {/* Hero Section */}
        <div className="hero-section responsive-section">
          <div className="container-responsive">
            <div className="row-responsive">
              <div className="col-responsive col-md-6 col-lg-7">
                <div className="hero-content">
                  <h1 className="hero-title">
                    {greeting}, <span className="highlight">Welcome Back!</span>
                  </h1>
                  <p className="hero-subtitle">
                    Monitor your logistics operations and track performance metrics in real-time
                  </p>
                </div>
              </div>
              <div className="col-responsive col-md-6 col-lg-5 d-mobile-only d-tablet-up">
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
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="quick-stats responsive-section">
          <div className="container-responsive">
            <div className="stats-header mobile-stack">
              <h2>Quick Overview</h2>
              <button className="view-all-btn btn-responsive">View All Reports</button>
            </div>
            <div className="widgets card-grid-3">
              <Widget type='user' />
              <Widget type='order' />
              <Widget type='driver' />
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section responsive-section">
          <div className="container-responsive">
            <div className="analytics-grid card-grid-2">
              <div className="featured-wrapper card-responsive">
                <div className="section-header mobile-stack">
                  <h3>Revenue Analytics</h3>
                  <span className="badge">Live</span>
                </div>
                <Featured/>
              </div>
              <div className="chart-wrapper card-responsive">
                <div className="section-header mobile-stack">
                  <h3>Performance Trends</h3>
                  <div className="chart-controls mobile-stack">
                    <button className="control-btn active btn-responsive">Year</button>
                    <button className="control-btn btn-responsive">Month</button>
                    <button className="control-btn btn-responsive">Week</button>
                  </div>
                </div>
                <Charts title="Revenue Overview" aspect={2/1} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="action-cards responsive-section">
          <div className="container-responsive">
            <div className="card-grid-3">
              <div className="action-card card-responsive">
                <div className="card-icon-wrapper">
                  <InventoryIcon className="action-icon" />
                </div>
                <h4>Quick Actions</h4>
                <p>Create new orders, manage inventory, and track shipments</p>
                <button className="action-btn primary btn-responsive mobile-full-width">Get Started</button>
              </div>
              <div className="action-card highlight-card card-responsive">
                <div className="card-icon-wrapper">
                  <TrendingUpIcon className="action-icon" />
                </div>
                <h4>Analytics Hub</h4>
                <p>Deep dive into your business metrics and performance data</p>
                <button className="action-btn secondary btn-responsive mobile-full-width">Explore Analytics</button>
              </div>
              <div className="action-card card-responsive">
                <div className="card-icon-wrapper">
                  <PeopleIcon className="action-icon" />
                </div>
                <h4>Team Management</h4>
                <p>Manage your team, assign tasks, and track productivity</p>
                <button className="action-btn primary btn-responsive mobile-full-width">Manage Team</button>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default Home