import './warehouse.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';

const Warehouse = () => {
    const {userInfo} = useSelector(state => state.auth)
  return (
    <div className="warehouse">
    <Sidebar/>
    <div className="warehouseContainer">
        <Navigation/>
        <div className="titleContainer">
        <h4>Warehouse Dynamics: Elevating Excellence in Inventory Management</h4>
        {userInfo.department === 'Warehouse' &&<div className="links">
                <Link to='/sales/orders/list'  className='link'> Orders</Link>
                <Link to='/warehouse/all'  className='link'> Inventory Insights</Link>
                <Link to='/plans'  className='link'><AutoModeOutlinedIcon/> Plans</Link>
                <Link to='/payment' className='link'> PaymentReport</Link>
            </div>}
            </div>
    <div className="warehouseBodydetails">
    <div className="row">
    <div className="col-lg-6 col-12 d-flex flex-column justify-content-start container">
      <h3>Warehouse Mastery</h3>
      <p>  Navigating Excellence in Inventory Management. Elevate your warehouse skills for seamless operations, optimizing inventory, and ensuring efficient logistics. Your expertise shapes our success.</p>
    </div>
  </div>
    </div>
    </div>
</div>
  )
}

export default Warehouse