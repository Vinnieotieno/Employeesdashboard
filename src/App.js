import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/home/Home'
import Login from './Pages/login/Login'
import Profile from './Pages/profile/Profile'
import Stats from './Pages/stats/Stats'
import Predictions from './Pages/predictions/Predictions'
import New from './Pages/new/New'
import './style/dark.scss'
import './style/main.scss'
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import Sales from './Pages/Sales/Sales'
import Delivery from './Pages/Delivery/Delivery'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './components/PrivateRoute'
import Table from './components/datatable/Datatable'
import Users from './Pages/employee/Users'
import { AppContext, socket } from "./context/appContext";
import Chat from './Pages/chat/Chat';
import SingleService from './components/single/SingleService';
import CustomerCare from './Pages/CustomerCare/CustomerCare';
import Operations from './Pages/operations/Operations';
import OperationsDashboard from './Pages/operations/OperationsDashboard';
import OperationsBoard from './components/operations/OperationsBoard';
import OperationsReports from './components/operations/OperationsReports';
import Finance from './Pages/finance/Finance';
import Warehouse from './Pages/warehouse/Warehouse';
import Management from './Pages/management/Management';
import AllPlans from './components/plans/AllPlans'
import SinglePlan from './components/single/SinglePlan';
import Activities from './Pages/management/Activities';
import SingleInventory from './components/single/SingleInventory';
import Calender from './Pages/calender/Calender';
import Leave from './Pages/management/Leave';
import PaymentReport from './Pages/payment/PaymentReport';
import LeaveDashboard from './Pages/leave/LeaveDashboard';


function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [notification, setNotification] = useState([]);
  const [newNotificationMessages, setNewNotificationMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
 

  return (
    <div className={darkMode ? "app dark darkmode" : "app"}>
      <ToastContainer/>
      <AppContext.Provider value={{ socket, newNotificationMessages, setNewNotificationMessages, notification, setNotification, currentRoom, setCurrentRoom, messages, setMessages,rooms, setRooms }} >
      <BrowserRouter>
    <Routes>
      <Route path='/' >
        <Route index element={<Login/>} />
        <Route path='' element={<PrivateRoute/>}>
          {/* Private routes */}
        <Route path='dashboard' element={<Home/>}/>
        <Route path='customer-care' element={<CustomerCare/>}/>
        <Route path='operations'>
          <Route index element={<Operations/>}/>
          <Route path='dashboard' element={<OperationsDashboard/>}/>
          <Route path='board' element={<OperationsBoard/>}/>
          <Route path='reports' element={<OperationsReports/>}/>
        </Route>
        <Route path='finance' element={<Finance/>}/>

        <Route path='warehouse'>
          <Route index element={<Warehouse/>}/>
          <Route path='all' element={<Table type={'warehouse'}/>}/>
          <Route path='new' element={<New type={'warehouse'}/>}/>
          <Route path='inventories/:id' element={<SingleInventory/>}/>
        </Route>
        <Route path='management'>
          <Route index element={<Management/>}/>
          <Route path='activities' element={<Activities/>}/>
          <Route path='leave' element={<Leave/>}/>
        </Route>

        <Route path='profile' element={<Profile/>}>
          <Route path=':details' element={<Profile/>}/>
        </Route>

        <Route path='chat' element={<Chat/>}/>

        <Route path='calender' element={<Calender/>}/>

        <Route path='users'>
        <Route index element={<Users/>}/>
          <Route path='new' element={<New type={'user'}/>}/>
          <Route path='all' element={<Table type={'users'}/>}/>
          <Route path='driver' element={<New type={'driver'}/>}/>
          <Route path='drivers' element={<Table type={'drivers'}/>}/>
        </Route>

        <Route path='plans'>
          <Route index element={<AllPlans/>}/>
          <Route path='new' element={<New type={'plan'}/>}/>
          <Route path='single/:id' element={<SinglePlan/>}/>
        </Route>

        <Route path='sales'>
          <Route index element={<Sales/>}/>
          <Route path='new/:id' element={<New type={'services'}/>}/>
          <Route path='orders/:list' element={<Table type={'sales'}/>}/>
          <Route path='report/:report' element={<Table type={'dumpreport'}/>}/>
          <Route path='order/:id' element={<SingleService/>}/>
          <Route path='progression' element={<Table type={'progression'}/>}/>
          <Route path='progression/:delivered' element={<Table type={'progression'}/>}/>
          <Route path='dump' element={<New type={'dump'}/>}/>
        </Route>
        <Route path='delivery' element={<Delivery/>} />
        <Route path='stats' element={<Stats/>}/>
        <Route path='predictions' element={<Predictions/>}/>
        <Route path='payment' element={<PaymentReport />} />
        <Route path="/leave-dashboard" element={<LeaveDashboard />} />
        </Route>
        </Route>
    </Routes>
    </BrowserRouter>
    </AppContext.Provider>
    </div>
  );
}

export default App;
