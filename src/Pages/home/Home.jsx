import React from 'react'
import './home.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navigation'
import Widget from '../../components/widget/Widget'
import Featured from '../../components/featured/Featured'
import Charts from '../../components/charts/Charts'

const Home = () => {
  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
        <Navbar/>
        <div className="widgets ">
          <Widget type='user' />
          <Widget type='order' />
          <Widget type='driver' />
        </div>
        <div className="charts">
          <Featured/>
          <Charts title="The Whole Year's (Revenue)" aspect={2/1} />
        </div>
      </div>
    </div>
  )
}

export default Home