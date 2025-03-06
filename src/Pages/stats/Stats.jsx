import React from 'react'
import './stats.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navigation'
import Row1 from './Row1'
import Row2 from './Row2'

const Stats = () => {
  return (
    <div className='stats'>
        <Sidebar/>
        <div className="statsContainer">
            <Navbar/>
            <div style={{ marginTop:"40px"}} className="">
                <Row1/>
                <Row2/>
            </div>
        </div>
    </div>
  )
}

export default Stats