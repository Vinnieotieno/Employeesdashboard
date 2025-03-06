import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navigation from '../../components/navbar/Navigation';
import './customercare.scss';
import {Link} from 'react-router-dom'
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import {useSelector} from 'react-redux'
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';


const CustomerCare = () => {
  const {userInfo} = useSelector(state => state.auth)
  return (
    <div className="CustomerCare">
      <Sidebar />
      <div className="CustomerCareBody ">
        <Navigation />
        <div className="titleContainer">
            <h4>CareConnect: Elevating Logistics Delight</h4>
            {userInfo.department === 'Customer Care' &&<div className="links">
                    <Link to='/sales/orders/list'  className='link'><WarehouseRoundedIcon/> Orders</Link>
                    <Link to='/plans'  className='link'><AutoModeOutlinedIcon/> Plans</Link>
                </div>}
                </div>
        <div className="customerCareBodydetails">
        <div className="row">
        <div className="col-lg-6 col-12 d-flex flex-column justify-content-start container">
          <h3>Client Delight</h3>
          <p> Navigating Excellence: Elevate your customer care expertise for seamless logistics, delighting clients while fostering growth. Your impact matters</p>
        </div>
      </div>
        </div>
        </div>
    </div>
  );
};

export default CustomerCare;
