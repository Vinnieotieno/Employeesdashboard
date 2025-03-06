import React from 'react'
import './finance.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import {useSelector} from 'react-redux'
import InsertChartIcon from "@mui/icons-material/InsertChart";
import StoreIcon from "@mui/icons-material/Store";
import {Link} from 'react-router-dom'
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
import ExchangeRates from '../../components/modals/ExchangeRates'

const Finance = () => {
    const {userInfo} = useSelector(state => state.auth)
  return (
    <div className="finance">
    <Sidebar/>
    <div className="financeContainer">
        <Navigation/>
        <div className="titleContainer">
        <h4>Financial Synergy: Elevating Excellence in Fiscal Management</h4>
        {userInfo.department === 'Finance' &&<div className="links">
                <ExchangeRates className='link' />
                <Link to='/sales/orders'  className='link'><StoreIcon/> Orders</Link>
                <Link to='/stats' className='link' ><InsertChartIcon/>Statistics</Link>
                <Link to='/plans'  className='link'><AutoModeOutlinedIcon/> Plans</Link>
            </div>}
            </div>
    <div className="financeBodydetails">
    <div className="row">
    <div className="col-lg-6 col-12 d-flex flex-column justify-content-start container">
      <h3>Financial Finesse</h3>
      <p> Elevate Expertise in Navigating Numbers. Enhance your financial acumen to ensure precision, optimize strategies, and support the fiscal foundation of our success. Your role is essential to our financial triumph</p>
    </div>
  </div>
    </div>
    </div>
</div>
  )
}

export default Finance