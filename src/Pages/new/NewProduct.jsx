import React, { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useAddImageMutation, useAddProductMutation } from '../../state/productsApiSlice';
import {toast} from 'react-toastify'
import Loader from '../../components/Loader'
import './new.scss';


const NewProduct = () => {
    const [validated, setValidated] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [imagePreview, setImagePreview] = useState(null)
    const [addImage] =useAddImageMutation();
    const [addProduct, {isLoading}] =useAddProductMutation();
    const [image, setImage] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState('')
    const [price, setPrice] = useState('')
    const [expense,setExpense] = useState('')


    const handleFile = (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      const data = new FormData();
      data.append('photo', file);
  
      addImage(data)
        .unwrap()
        .then((res) => {
          setImage(res);
          setImageUploaded(true); // Set the flag to true when the image is uploaded
        })
        .catch((err) => {
          toast.error(err?.data?.message || err?.message);
        });
    };
    
    const handleSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setValidated(true);
  
      // Check if the image is uploaded before submitting the form
      if (!imageUploaded) {
        toast.error('Add Product Image');
      } else {
        const productData = { image, title, description, category, stock, price, expense };
        addProduct(productData)
          .unwrap()
          .then((res) => {
            toast.success(res?.message)
          })
          .catch((err) => {
            toast.error(err?.data?.message || err?.message);
          });
      }
    };
  return (
    <div className='newItems'>
        <div className="top">
          <h1><CategoryRoundedIcon/> Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <div style={{width:'150px', height:'150px', margin:'0 auto', position:'relative'}} className="signup-profile-pic__container">
            <img style={{width:'150px', height:'150px', borderRadius:"15px", border:'2px solid gray', objectFit:'cover'}} src={imagePreview || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}  />
            <label htmlFor="file" className="image-upload-label">
            <AddPhotoAlternateIcon style={{position:'absolute', bottom:'-2px',right:'-3px', color:'black', background:'white', cursor:'pointer', zIndex:'99'}}/>
            </label>
            <input type="file"  name='file' id='file' hidden onChange={handleFile}  />
            </div>
          </div>
          <div className="right">
          <Form noValidate validated={validated} onSubmit={handleSubmit} className='form'>
                <Row className='mb-3'>
                    <Form.Group as={Col} sm='6' controlId='validationCustom01'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={title} onChange={e => setTitle(e.target.value)} required className='formInput' type='text' placeholder='Title'/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" controlId="validationCustom02">
                        <Form.Label>Description</Form.Label>
                        <Form.Control value={description} onChange={e => setDescription(e.target.value)} required className='formInput' type="text" placeholder="Description"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} sm="3" controlId="validationCustom03">
                    <Form.Label>Category</Form.Label>
                    <Form.Control value={category} onChange={e => setCategory(e.target.value)} className='formInput' type="text" placeholder="Category" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide valid Category.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom04">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control value={stock} onChange={e => setStock(e.target.value)} className='formInput' type="text" placeholder="Stock" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide product Quantity.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom05">
                    <Form.Label>Price</Form.Label>
                    <Form.Control value={price} onChange={e => setPrice(e.target.value)} className='formInput' type="text" placeholder="Price" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide Product Price.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom05">
                    <Form.Label>Expense</Form.Label>
                    <Form.Control className='formInput' value={expense} onChange={e => setExpense(e.target.value)} type="text" placeholder="Expense" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide Amount spent on the Product.
                    </Form.Control.Feedback>
                    </Form.Group>
            </Row>
            {isLoading && <Loader/>}
            <Button variant='info'  type="submit">Add Product</Button>
            </Form>
          </div>
        </div>
    </div>
  )
}

export default NewProduct