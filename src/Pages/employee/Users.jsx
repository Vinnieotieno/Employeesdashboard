import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import './users.scss'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Users = () => {
  const {userInfo} = useSelector(state => state.auth)
  return (
    <div className='users'>
        <Sidebar/>

        <div className="usersContainer">
            <Navigation/>

            <div className="titleContainer">
            <h4>Empowerment for Excellence: Building a Stronger Future Together</h4>
            {<div className="links">
                  <Link to='/users/all'  className='link'><PeopleAltIcon/> Employees</Link>
                  <Link to='/users/drivers'  className='link'><PeopleAltIcon/> Drivers</Link>
                    {userInfo.department === 'Management'  &&( <><Link to='/users/new'  className='link'><PersonAddAltIcon/> Add new Employee</Link>
                    <Link to='/users/driver'  className='link'> <LocalShippingIcon/> Add new Driver</Link></>)}
                </div>}
                </div>
                <div className="employeeCareBodydetails">
                <div className="row">
                <div className="col-md-6 d-flex flex-column justify-content-end  container">
                <h3>Empower, Engage, Excel: Your Gateway to Success</h3>
              <p>Welcome to your personalized dashboard, designed to empower you, engage your potential, and drive your excellence. Navigate the resources, connect with your colleagues, and embrace a journey of growth together.</p>
                </div>
              </div>
        </div>
        </div>
    </div>
  )
}

export default Users