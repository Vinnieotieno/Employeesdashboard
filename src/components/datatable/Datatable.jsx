import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import Navigation from '../navbar/Navigation'
import './datatable.scss'
import ServicesTable from './ServicesTable'
import UserTable from './UserTable'
import DumpReportTable from './DumpReportTable'
import Progression from './Progression'
import Drivers from './Drivers'
import Warehouse from './Warehouse'

const Datatable = ({type}) => {
  return (
    <div className='datatable'>
      <Sidebar/>

      <div className="datatableContainer">
        <Navigation/>
        {type === 'sales' && <ServicesTable/>}
        {type === 'users' && <UserTable/>}
        {type === 'dumpreport' && <DumpReportTable/>}
        {type === 'progression' && <Progression/>}
        {type === 'drivers' && <Drivers/>}
        {type === 'warehouse' && <Warehouse/>}
      </div>
    </div>
  )
}

export default Datatable
