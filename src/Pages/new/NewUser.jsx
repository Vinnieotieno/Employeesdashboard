import { useState} from 'react';
import {Button,Col, Form, InputGroup, Row} from 'react-bootstrap'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader';
import { useRegisterMutation } from '../../state/usersApiSlice';
import './new.scss'

const options = [
    'Provide a Department.',
    'Sales',
    'Customer Care',
    'Operations',
    'Finance',
    'Warehouse',
    'Management',
  ];

const NewUser = () => {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [department, setDepartment] = useState('')


    const [register, {isLoading}] = useRegisterMutation()

    const handleSubmit = async(event) => {
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        if (password !== cpassword){
            toast.error('passwords do not match')
        }else if (form.checkValidity() === false){
            toast.error('Please correct all the Errors')
        }else{
            try{
                const res = await register({username,department,email, password}).unwrap()
                toast.success(res?.message)
            }catch(err){
                toast.error(err?.data?.message || err?.message)
            }
        }
    
        
        };
  return (
    <div className='newItems'>
        <div className="top">
        <h1>Create An Account</h1>
        </div>
        <div className="bottom">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className='mb-3'>
            <Form.Group as={Col} sm="4" controlId="validationCustomUsername">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} aria-describedby="inputGroupPrepend" required/>
            <Form.Control.Feedback type="invalid">
            Please choose a username.
            </Form.Control.Feedback>
            </InputGroup>
            </Form.Group>

            <Form.Group as={Col} sm="4" controlId="validationCustom03">
            <Form.Label>Email Address:</Form.Label>
            <Form.Control type="email" placeholder="Email Address" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
            Please provide an Email Address.
            </Form.Control.Feedback>

            </Form.Group>
            <Form.Group as={Col} sm="4" controlId="validationCustom03">
            <Form.Label>Department:</Form.Label>
            <Form.Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
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
            Please provide a Department.
            </Form.Control.Feedback>
            </Form.Group>
            </Row>
            <Row className="mb-3">
            <Form.Group as={Col} sm="6" controlId="validationCustom06">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <Form.Control.Feedback >
            Looks Good!
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm="6" controlId="validationCustom06">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
            Please Confirm the Password.
            </Form.Control.Feedback>
            </Form.Group>
            </Row>
            {isLoading && <Loader/>}
            <Button variant='info'  type="submit">Submit form</Button>
            </Form>
        </div>
    </div>
  )
}

export default NewUser