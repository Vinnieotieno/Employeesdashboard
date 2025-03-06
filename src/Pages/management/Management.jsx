import './management.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

const Management = () => {
    const {userInfo} = useSelector(state => state.auth)
  return (
    <div className="management">
    <Sidebar/>
    <div className="managementContainer">
        <Navigation/>
        <div className="titleContainer">
        <h4>Management Mastery: Elevating Excellence in Organizational Leadership and Strategy</h4>
        {userInfo.department === 'Management' &&<div className="links">
                <Link to='/plans'  className='link'> Plans</Link>
                <Link to='/sales/orders/list'  className='link'> Orders</Link>
                <Link to='/management/activities'  className='link'> Today's Activities</Link>
                <Link to='/management/leave'  className='link'>Leave</Link>
                <Link to='/stats'  className='link'>Statistics</Link>
            </div>}
            </div>
    <div className="managementBodydetails">
    <div className="row">
    <div className="col-lg-6 col-12 d-flex flex-column justify-content-start container">
      <h3>Management</h3>
      <p>  Navigating Strategic Leadership. Elevate managerial prowess in guiding our organization's growth, optimizing resources, and nurturing a culture of excellence. Your leadership shapes our success.</p>
    </div>
  </div>
    </div>
    </div>
</div>
  )
}

export default Management