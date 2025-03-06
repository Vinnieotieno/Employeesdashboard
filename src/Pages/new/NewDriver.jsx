import { useState} from 'react';
import {Container, Button,Col, Form, Row} from 'react-bootstrap'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader';
import { useAddDriverMutation } from '../../state/usersApiSlice';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import './new.scss'

const NewDriver = () => {
    const [validated, setValidated] = useState(false);
    const [mobile, setMobile] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nationalId, setNationalId] = useState('')
    const [licence, setLicence] = useState('')
    const [expire, setExpire] = useState('')
    const [licenceClass, setLicenceClass] = useState('')
    const [emergency, setEmergency] = useState('')
    const [addDriver] = useAddDriverMutation()


    const handleSubmit = async(event) => {
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }else{
            setValidated(true);
        const driverData = {mobile, name, email, nationalId, licence, expire,licenceClass, emergency}
        addDriver(driverData).unwrap().then(res =>{
            toast.success(res?.message)
        }).catch(err =>{
            toast.error(err?.data.message || err?.message)
        })
        }
        
        
        };
  return (
    <div className='newItems'>
        <div className="top">
          <h1><LocalShippingIcon/> Add a New Driver</h1>
        </div>
         <div className="bottom ">
         <Container>
      <Form className='form' onSubmit={handleSubmit}>
      <Row className='mb-3'>
        <Form.Group as={Col} sm='3' controlId='validationCustom01'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control value={name} onChange={e => setName(e.target.value)} required className='formInput' type='text' placeholder='Full Name'/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label> Phone Number</Form.Label>
            <Form.Control value={mobile} onChange={e => setMobile(e.target.value)}  required className='formInput' type="text" placeholder="Phone Number"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm='3' controlId='validationCustom01'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control value={email} onChange={e => setEmail(e.target.value)} required className='formInput' type='email' placeholder='Email Address'/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label> National ID Number</Form.Label>
            <Form.Control value={nationalId} onChange={e => setNationalId(e.target.value)}  required className='formInput' type="number" placeholder="National ID Number"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
    </Row>
    <Row className='mb-3'>
        <Form.Group as={Col} sm='3' controlId='validationCustom01'>
            <Form.Label>Driver's Licence Number</Form.Label>
            <Form.Control value={licence} onChange={e => setLicence(e.target.value)} required className='formInput' type='text' placeholder="Driver's Licence Number"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label> Expiration Date of Driver's Lincence</Form.Label>
            <Form.Control value={expire} onChange={e => setExpire(e.target.value)}  required className='formInput' type="date" placeholder=""/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm='3' controlId='validationCustom01'>
            <Form.Label>Class of Driver's Lincence</Form.Label>
            <Form.Control value={licenceClass} onChange={e => setLicenceClass(e.target.value)} required className='formInput' type='text' placeholder="Class of Driver's Lincence"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label> Emergency Contact</Form.Label>
            <Form.Control value={emergency} onChange={e => setEmergency(e.target.value)} required className='formInput' type="text" placeholder="Emergency Contact"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
    </Row>
        <Button variant="success" type='submit'>
          Add Driver
        </Button>
      </Form>
    </Container>
         </div>
    </div>
  )
}

export default NewDriver