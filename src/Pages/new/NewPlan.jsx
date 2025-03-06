import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './new.scss';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useCreatePlanMutation,useGetDepartmentsQuery, useGetUsersQuery } from '../../state/usersApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux'

const NewPlan = () => {
    const [inputFields, setInputFields] = useState([{ value: '' }]);
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [manager, setManager] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [priority, setPriority] = useState(1)
    const [budget, setBudget] = useState('')
    const [createPlan] = useCreatePlanMutation()
    const {userInfo} = useSelector(state => state.auth)
    const {data:users, isLoading, refetch} = useGetUsersQuery()
    const {data:departmets,refetch:refechDepartment } = useGetDepartmentsQuery()
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedManager, setSelectedManager] = useState('')

    console.log(users)
    useEffect(() =>{
      refechDepartment()
      refetch()

    },[departmets, users])

    if(isLoading || !departmets || !users){
      return <Loader/>
    }

  const handleAddFields = () => {
    const newFields = [...inputFields];
    newFields.push({ value: '' });
    setInputFields(newFields);
  };

  const handleRemoveFields = (index) => {
    const newFields = [...inputFields];
    newFields.splice(index, 1);
    setInputFields(newFields);
  };

  const handleInputChange = (index, event) => {
    const newFields = [...inputFields];
    newFields[index].value = event.target.value;
    setInputFields(newFields);
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    createPlan({createdBy:userInfo, inputFields, description,title,manager:selectedDepartment,planManager:selectedManager,startDate,endDate, priority, budget}).unwrap().then(res => {
        toast.success(res?.message)
    }).catch(err =>{
        toast.error(err?.data?.message || err?.message)
    })
  };
  if(isLoading){
    <Loader/>
  }

  function getUsersByDepartment(users, department) {
    return users.filter(user => user.department === department);
  }
  return (
    <div className='newItems'>
        <div className="top">
          <h1><CategoryRoundedIcon/> Create Plan</h1>
        </div>
         <div className="bottom ">
         <Container>
      <Form className='form' onSubmit={handleSubmit}>
      <Row className='mb-3'>
        <Form.Group as={Col} sm='6' controlId='validationCustom01'>
            <Form.Label>Plan Title</Form.Label>
            <Form.Control value={title} onChange={e => setTitle(e.target.value)} required className='formInput' type='text' placeholder='Title'/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="6" controlId="validationCustom02">
            <Form.Label> Plan Description</Form.Label>
            <Form.Control value={description} onChange={e => setDescription(e.target.value)} as={'textarea'} required className='formInput' type="text" placeholder="Description"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
    </Row>
    <Row className='mb-3'>
        <Form.Group as={Col} sm='2' controlId='validationCustom01'>
            <Form.Label>Start Date</Form.Label>
            <Form.Control value={startDate} onChange={e => setStartDate(e.target.value)} required className='formInput' type='date' placeholder='Start Date'/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="2" controlId="validationCustom02">
            <Form.Label> End Date</Form.Label>
            <Form.Control value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate}  required className='formInput' type="date" placeholder="End Date"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom03">
            <Form.Label>Assigned Manager:</Form.Label>
            <Row>
            <Form.Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="formInput"
              required
          >
              {departmets.map((option, index) => (
                  <option key={index} value={option}>
                      {option}
                  </option>
              ))}
          </Form.Select>
          {selectedDepartment && <Form.Select
        value={selectedManager}
        onChange={(e) => setSelectedManager(e.target.value)}
        className="formInput"
        required
    >
         <option value="" disabled>Select a Manager</option> 
        {getUsersByDepartment(users, selectedDepartment).map((user, index) => (
          <option key={index} value={user.name}>
            {user.username}
          </option>
        ))}
    </Form.Select>}
            </Row>
            
            <Form.Control.Feedback type="invalid">
            Provide Assigned Manager.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} sm="2" controlId="validationCustom02">
            <Form.Label> Priority</Form.Label>
            <Form.Range value={priority} onChange={e => setPriority(parseInt(e.target.value, 10))} />
        </Form.Group>
        <Form.Group as={Col} sm="3" controlId="validationCustom02">
            <Form.Label> Budget</Form.Label>
            <Form.Control value={budget} onChange={e => setBudget(e.target.value)}  required className='formInput' type="text" placeholder="Budget"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
    </Row>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', }}>
        <div style={{width:'50%'}}>
        <Form.Label> Tasks</Form.Label>
        {inputFields.map((inputField, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder={`Task ${index + 1}`}
                value={inputField.value}
                onChange={(event) => handleInputChange(index, event)}
              />
            </Col>
            <Col>
              <Button variant="danger" onClick={() => handleRemoveFields(index)}>
                X
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="warning" onClick={handleAddFields}>
          Add Task
        </Button>
        </div>
        </div>
        <Button variant="success" type='submit'>
          Create Plan
        </Button>
      </Form>
    </Container>
         </div>
    </div>
  )
}

export default NewPlan