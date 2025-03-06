import React from 'react'
import './operations.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

const Operations = () => {
    const {userInfo} = useSelector(state => state.auth)
  return (
    <div className="operations">
        <Sidebar/>
        <div className="operationsContainer">
            <Navigation/>
            <div className="titleContainer">
            <h4>Operational Excellence Unleashed: Streamlining Logistics for Elevated Performance</h4>
            {userInfo.department === 'Operations' &&<div className="links">
                    <Link to='/sales/orders/list'  className='link'><RequestQuoteOutlinedIcon/> Orders</Link>
                    <Link to='/sales/progression'  className='link'><AutoModeOutlinedIcon/> Progression</Link>
                    <Link to='/plans'  className='link'><AutoModeOutlinedIcon/> Plans</Link>
                </div>}
                </div>
        <div className="operationsBodydetails">
        <div className="row">
        <div className="col-lg-6 col-12 d-flex flex-column justify-content-start container">
          <h3>Operational Excellence</h3>
          <p> Guiding Efficiency and Quality. Elevate your operational prowess to ensure streamlined processes, optimize performance, and maintain top-notch quality. Your contribution drives success</p>
        </div>
      </div>
        </div>
        </div>
    </div>
  )
}

export default Operations