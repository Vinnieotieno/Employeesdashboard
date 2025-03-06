import {useState} from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import {toast} from 'react-toastify'
import {useAddServiceMutation, useUpdateServiceMutation} from '../../state/servicesApiSlice'
import Loader from '../../components/Loader'
import { useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import './new.scss'

const options = [
    'Please select an Action',
    'Call',
    'Chat',
    'Email',
    'In Person',
  ];

const services = [
    'Air Freight',
    'Sea Freight',
    'Consolidation',
    'Warehousing',
    'Distribution',
    'Custom Brokage',
    'E-commerce'
  ];


  const engagementPurposeList = [
    'Please select an Engagement Purpose',
    'Introduction',
    'New Account',
    'Follow Up',
    'Account Revival'
  ];

const DailyDump = () => {
    const [companyName, setCompanyName] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [validated, setValidated] = useState(false);
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [engagementPurpose, setEngagementPurpose] = useState('')
    const [action, setAction] = useState('')
    const [order, setOrder] = useState([]);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [addService, {isLoading}] =useAddServiceMutation();
    const {userInfo} = useSelector(state => state.auth)

    const dumpData = {createdBy:userInfo, companyName, contactPerson, mobile, email, engagementPurpose, action, order}

    const handleDumpSubmit = async(event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          toast.error('Please fill in all the required fields')
        }else{
            setValidated(true);
            addService(dumpData).unwrap().then(res =>{
                toast.success(res?.message)
            }).catch(err =>{
                toast.error(err?.data?.message || err?.message);
            })
        }
    }

   
  return (
    <div className='newItems'>
        <div className="top">
          <h1><CategoryRoundedIcon/>Daily Dump</h1>
        </div>
        <div className="bottom">
        <Form noValidate validated={validated} onSubmit={handleDumpSubmit} className='form'>
        <Row className='mb-3'>
        <Form.Group as={Col} sm='3' controlId='validationCustom01'>
            <Form.Label>Company name:</Form.Label>
            <Form.Control value={companyName} onChange={e => setCompanyName(e.target.value)} required className='formInput' type='text' placeholder='Company Name'/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label>Contact Person:</Form.Label>
            <Form.Control value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className='formInput' type="text" placeholder="Contact Person"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label>Phone Number:</Form.Label>
            <Form.Control value={mobile} onChange={e => setMobile(e.target.value)} required className='formInput' type="text" placeholder="Phone Number"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label>Email</Form.Label>
            <Form.Control value={email} onChange={e => setEmail(e.target.value)} required className='formInput' type="email" placeholder="Email"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        </Row>
        <Row className='mb-3'>
        <Form.Group as={Col} sm="3" controlId="validationCustom03">
            <Form.Label>Engagement Purpose</Form.Label>
            <Form.Select
                value={engagementPurpose}
                onChange={(e) => setEngagementPurpose(e.target.value)}
                className="formInput"
                required
            >
                {engagementPurposeList.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                Please select an Action
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm="3" controlId="validationCustom04">
            <Form.Label>Action</Form.Label>
            <Form.Select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="formInput"
                required
            >
                {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                Please select an Action
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm="3" controlId="validationCustom04">
            <Form.Label>Service</Form.Label>
            {!servicesOpen && <Form.Control onClick={() => setServicesOpen(!servicesOpen)}  placeholder='Select Atleast one service' className='formInput'/>}
            {servicesOpen && <p onClick={()=>setServicesOpen(!servicesOpen)} style={{cursor:'pointer'}} > Close Services</p>}
            {servicesOpen && services.map((option, index) => (
                <div key={index} className="form-check">
                    <input
                        type="checkbox"
                        id={`service-${index}`}
                        value={option}
                        checked={order.includes(option)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setOrder([...order, option]);
                            } else {
                                setOrder(order.filter((selectedOption) => selectedOption !== option));
                            }
                        }}
                        className="form-check-input"
                    />
                    <label htmlFor={`service-${index}`} className="form-check-label">
                        {option}
                    </label>
                </div>
            ))}
            <Form.Control.Feedback type="invalid">
                Please select at least one Service
            </Form.Control.Feedback>
            </Form.Group>

        </Row>
        <Button variant='info'  type="submit">Create Dump</Button>
        </Form>
        </div>
    </div>
  )
}

export default DailyDump