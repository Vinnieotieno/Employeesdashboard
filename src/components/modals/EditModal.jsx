import { useState, useEffect } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {Button,Col, Form, InputGroup, Row, Modal} from 'react-bootstrap'
import { useAddImageMutation } from '../../state/productsApiSlice';
import {toast} from 'react-toastify'
import { useUpdateUserMutation } from '../../state/usersApiSlice';
import Loader from '../../components/Loader'
import './modal.scss'
import {useSelector} from 'react-redux'

const EditModal = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [validated, setValidated] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [username, setUsername] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [emergency, setEmergency] = useState('');
    const [employeeId, setEmployeeId] = useState('')
    const [jobtitle, setJobtitle] = useState('');
    const [image, setImage] = useState('')
    const [imageUploaded, setImageUploaded] = useState(false);
    const [addImage] =useAddImageMutation();
    const [updateUser, {isLoading}] =useUpdateUserMutation();
    const {userInfo} = useSelector(state => state.auth)



    const handleFile = (e) =>{
        e.preventDefault();
        const file = e.target.files[0]
        setImagePreview(URL.createObjectURL(file));
        const data = new FormData();
        data.append('photo', file);

        addImage(data).unwrap().then((res) =>{
            setImage(res)
            setImageUploaded(true)
        }).catch(err =>{
            toast.error(err?.data?.message || err?.message);
        })
  }


    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        //check if image is uploaded before saving everything
        if(!imageUploaded){
            toast.error('Add Profile Photo');
        }else{
            const userData = {fname, lname, username, address, email, mobile, emergency, employeeId, jobtitle, image}
            updateUser(userData).unwrap().then(res =>{
                toast.success(res?.message)
            }).catch(err =>{
                toast.error(err?.data?.message || err?.message);
            })
        }
      };

      useEffect(() =>{
        setFname(userInfo.fname)
        setLname(userInfo.lname)
        setUsername(userInfo.name)
        setAddress(userInfo.address)
        setEmail(userInfo.email)
        setMobile(userInfo.mobile)
        setEmergency(userInfo.emergency)
        setEmployeeId(userInfo.employeeId)
        setJobtitle(userInfo.jobtitle)

      },[userInfo])
    

  return (
    <div className='editModal'>
        <div onClick={() => setShowEdit(true)}>Edit</div>
        <Modal size="lg" dialogClassName='modalBody' show={showEdit} onHide={() => setShowEdit(false)} aria-labelledby="edit-page" style={{color:'gray'}}>
        <Modal.Header closeButton>
          <Modal.Title id="edit-page"><h4 className='text-center'>Edit Profile Details</h4></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div style={{width:'150px', height:'150px', margin:'0 auto', position:'relative'}} className="signup-profile-pic__container">
                    <img style={{width:'150px', height:'150px', borderRadius:"50%", border:'2px solid gray', objectFit:'cover'}} src={userInfo?.image ? `https://globeflightapi.onrender.com/${userInfo.image}` : imagePreview || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}  />
                    <label htmlFor="file" className="image-upload-label">
                        <AddPhotoAlternateIcon style={{position:'absolute', bottom:'15px',right:'10px', color:'black', background:'white', cursor:'pointer', zIndex:'99'}}/>
                    </label>
                    <input type="file" name='file' id='file' accept="image/*" hidden onChange={handleFile}  />
                    </div>
                <Row className='mb-3'>
                    <Form.Group as={Col} sm='4' controlId='validationCustom01'>
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control value={fname} onChange={e => setFname(e.target.value)} required type='text' placeholder='First Name'/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="4" controlId="validationCustom02">
                        <Form.Label>Last name: </Form.Label>
                        <Form.Control value={lname} onChange={e => setLname(e.target.value)}  required type="text"placeholder="Last name"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="4" controlId="validationCustomUsername">
                        <Form.Label>Username</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control value={username} onChange={e => setUsername(e.target.value)}  type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required/>
                            <Form.Control.Feedback type="invalid">
                            Please choose a username.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} sm="5" controlId="validationCustom03">
                    <Form.Label>Address:</Form.Label>
                    <Form.Control type="text" value={address} onChange={e => setAddress(e.target.value)}  placeholder="Address" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide your Address.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="4" controlId="validationCustom04">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)}  placeholder="Email Address" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid  email address.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom05">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" value={mobile} onChange={e => setMobile(e.target.value)}  placeholder="Phone Number" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid Phone number.
                    </Form.Control.Feedback>
                    </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} sm="5" controlId="validationCustom06">
                <Form.Label>Emergency Contact:</Form.Label>
                <Form.Control type="text" value={emergency} onChange={e => setEmergency(e.target.value)}  placeholder="Emergency Contact" required />
                <Form.Control.Feedback type="invalid">
                    Please provide yoor Emergency Contact.
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm="4" controlId="validationCustom07">
                <Form.Label>Employee ID:</Form.Label>
                <Form.Control type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)}  placeholder="Employee ID" required />
                <Form.Control.Feedback type="invalid">
                    Please provide your Employee ID.
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm="3" controlId="validationCustom08">
                <Form.Label>Job Title</Form.Label>
                <Form.Control type="text" value={jobtitle} onChange={e => setJobtitle(e.target.value)}  placeholder="Job Title" required />
                <Form.Control.Feedback type="invalid">
                    Please provide your Job Title.
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            {isLoading && <Loader/>}
            <Button variant='info'  type="submit">Edit Profile</Button>
            </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default EditModal