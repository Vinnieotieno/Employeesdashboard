import React,{useState} from 'react'
import './profile.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import EditModal from '../../components/modals/EditModal';
import {useSelector} from 'react-redux' 
import {toast} from 'react-toastify'
import { useUpdateUserMutation } from '../../state/usersApiSlice';
import LeaveModal from '../../components/modals/LeaveModal';


const Profile = () => {
  const {userInfo}  = useSelector(state => state.auth)
  const [password, setPassword] = useState('')
  const [cpassword, setCpassword] = useState('')
  const [updateUser, {isLoading}] =useUpdateUserMutation();

  let {details} = useParams()
  if(details === undefined){
    details = 'contact'
  }

  const ChangePassword = (e) =>{
    e.preventDefault()
    if(password != cpassword){
      toast.error('Passwords do not match')
    }else{
      updateUser({password}).unwrap().then(res =>{
        toast.success('Password Updated')
      }).catch(err =>{
        toast.error(err?.data?.message || err?.message);
    })
    }
  }

  return (
    <div className='profile '>
        <Sidebar/>
        <div className="profileContainer ">
            <Navigation/>
            <div className="userDetailsContainer container">
              <div className="profileInfo">
              <EditModal/>
                <h3 style={{color:'#6439ff', fontSize:"18px", fontWeight:"500"}} className="text-center">Profile Information</h3>
                <div className="text-center">
                      <img style={{width:'150px', height:'150px', borderRadius:'50%'}} src={userInfo.image ? `https://globeflightapi.onrender.com/${userInfo.image}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} className="img-fluid" />
                  </div>
                  <div className="detailsContainer">
                    <p><b>Username: </b> {userInfo?.name} </p>
                    <p><b>Job Title: </b> {userInfo?.jobtitle}</p>
                    <p><b>Employee ID: </b>{userInfo?.employeeId}</p>
                  </div>
              </div>
              <div className="otherDetails">
                <EditModal/>
                <h3 style={{color:'#6439ff', fontSize:"18px", fontWeight:"500"}} className="text-center">Other Details</h3>
                <div className="linksContainer">
                  <a href="/profile" className="link"><span className="linktext">Contact</span> <ContactPageOutlinedIcon/></a>
                  <a href="/profile/work" className="link"><span className="linktext">Work Schedule</span>  <HistoryOutlinedIcon/></a>
                  <a href="/profile/security" className="link"><span className="linktext">Privacy & Security</span>  <SecurityOutlinedIcon/></a>
                  {/* <a href="/profile/downloads" className="link"><span className="linktext">Downloads</span>  <CloudDownloadOutlinedIcon/></a> */}
                  <a href="/profile/support" className="link"><span className="linktext">Support</span>  <HelpOutlineIcon/></a>
                </div>
                <div className="otherDetailsContainer">
                {details === 'work' ? (
                  <div className='details'>
                    <h4>Work Schedule, Attendance, Compensation and Benefits</h4>
                    <div className="row my-4">
                      <div className="col-4">
                        <a href="/calender" className="button">Calender <CalendarMonthIcon/></a>
                      </div>
                      <div className="col-4">
                      <LeaveModal className="button" />
                      </div>
                      <div className="col-4">
                      <a href="/chat" className="button">Chat <MessageRoundedIcon/></a>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <p><span className='contactDetailsText'>Work Schedule: </span> 8a.m~5p.m</p>
                      </div>
                      <div className="col-6">
                      <p><span className='contactDetailsText'>Time-off Requests: </span> Thrice a Month</p>
                      </div>
                    </div>
                    <h4>Benefits</h4>
                    <ul>
                      <li><span className='contactDetailsText'>Paid Time Off: </span> Generous vacation, sick leave, and holidays to maintain work-life balance.</li>
                      <li><span className="contactDetailsText">Retirement Plan: </span> 401(k) plan with employer matching contributions to secure your future.</li>
                      <li><span className="contactDetailsText">Health Insurance: </span> Full coverage for medical, dental, and vision expenses for employees and their families.</li>
                      <li><span className="contactDetailsText">Training and Development: </span>Opportunities for skill enhancement and career growth. </li>
                    </ul>
                  </div>
                ): details === 'security' ? (
                  <div className='details'>
                    <h4>Change Password <KeyRoundedIcon/></h4>
                    <p>Please ensure your password includes capital letters, small letters, numbers, 
                      and special characters for enhanced security."</p>

                    <Form onSubmit={ChangePassword}>
                      <Form.Group className='mb-3'>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required name="password"/>
                      </Form.Group>
                      <Form.Group className='mb-3'>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" value={cpassword} onChange={(e) => setCpassword(e.target.value)}  required name="Cpassword"/>
                      </Form.Group>
                      <button className="button" type='submit'>Change Password <KeyRoundedIcon/></button>
                    </Form>
                  </div>
                ): details === 'downloads' ? (
                  <div className='details'> 
                  <h4 style={{color:'#777'}}>This month Financial report  <CloudDownloadOutlinedIcon/></h4>
                  </div>
                ): details === 'support' ?(
                  <div className='details'>
                    <h4>Support and Help</h4>
                    <p>Need assistance? <br /> Contact HR: +254808328| lolow@gmail.com. <br /> We're here to help you!</p>
                  </div>
                ): details === 'contact' ? (
                  <div className='details'>
                    <h4>Contact Details</h4>
                    <ul>
                      <li><span className='contactDetailsText'>  <EmailIcon/> Email Address: </span>{userInfo?.email}</li>
                      <li><span className='contactDetailsText'><LocalPhoneIcon/> Phone Number: </span>{userInfo?.mobile}</li>
                      <li><span className='contactDetailsText'> <LocationOnIcon/> Address: </span>{userInfo?.address}</li>
                      <li><span className='contactDetailsText'> <MedicalServicesIcon/> Emergency Contact: </span>{userInfo?.emergency}</li>
                    </ul>
                  </div>
                ): null}
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Profile