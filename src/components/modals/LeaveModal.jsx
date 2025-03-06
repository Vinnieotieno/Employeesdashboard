import { useState, useContext } from 'react';
import {Button, Form, Modal, Row, Col} from 'react-bootstrap'
import './modal.scss'
import EventBusyIcon from '@mui/icons-material/EventBusy';
import {useSelector} from 'react-redux' 
import { useLeaveApplicationMutation } from '../../state/usersApiSlice';
import {toast} from 'react-toastify'
import { AppContext } from '../../context/appContext';
import {time, todayDate} from '../../TimeAndDate'

const options = [
    'Please select Leave Type',
    'Annual Leave',
    'Sick Leave',
    'Maternity/Paternity Leave',
    'Bereavement Leave',
    'Personal Leave',
    'Unpaid Leave',
    'Other',
  ];

const LeaveModal = () => {
    const [showLeave, setShowLeave] = useState(false);
    const [validated, setValidated] = useState(false);
    const [leaveType, setLeaveType] = useState(options[0]);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')
    const [leaveApplication, {isLoading}] = useLeaveApplicationMutation();
    const {socket} = useContext(AppContext)

    const {userInfo}  = useSelector(state => state.auth)

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const leaveData = {appliedBy:userInfo._id, leaveType, startDate, endDate, reason}

    leaveApplication(leaveData).unwrap().then(res =>{
      toast.success(res?.message)
      const message = `Leave application pending. From ${userInfo.name}. HR's response required.`
      const department = 'Management'
      socket.emit('notification', message, userInfo, time, todayDate, department)
    }).catch(err =>{
        toast.error(err?.data?.message || err?.message)
    })

    
  };
  return (
    <div className='leaveModal'>
      <div className='text-center'onClick={() => setShowLeave(true)}>Leave <EventBusyIcon/></div>
      <Modal
        size="lg"
        show={showLeave}
        onHide={() => setShowLeave(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" style={{fontSize:'20px', color:'#7451f8'}}>
            Apply for a Leave
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className='mb-3'>
                <Form.Group as={Col} sm="4" controlId="validationCustom04">
                    <Form.Label>Leave Type</Form.Label>
                    <Form.Select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
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
                        Please select Leave Type
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="4" controlId="validationCustom02">
                        <Form.Label>Start Date: </Form.Label>
                        <Form.Control value={startDate} onChange={e => setStartDate(e.target.value)}  required  type="date"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="4" controlId="validationCustom02">
                        <Form.Label>End Date: </Form.Label>
                        <Form.Control value={endDate} onChange={e => setEndDate(e.target.value)}  required  type="date"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} sm="9" controlId="validationCustom03">
                    <Form.Label>Reason For Leave:</Form.Label>
                    <Form.Control type="text" value={reason} onChange={e => setReason(e.target.value)}  placeholder="Reason for leave" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide your Address.
                    </Form.Control.Feedback>
                    </Form.Group>
            </Row>
            <Button variant='info'  type="submit">Apply</Button>
            </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default LeaveModal