import { useState } from 'react';
import { Container, Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAddInventoryMutation } from '../../state/servicesApiSlice';
import StoreIcon from "@mui/icons-material/Store";
import './new.scss';
import { useSelector } from 'react-redux';

const Warehouse = () => {
    const [validated, setValidated] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemMeasurement, setItemMeasurement] = useState('');
    const [itemDimensions, setItemDimensions] = useState('');
    const [itemPackaging, setItemPackaging] = useState('');
    const [itemValue, setItemValue] = useState('');
    const [itemHandling, setItemHandling] = useState('');
    const [itemStorage, setItemStorage] = useState('');
    const [exitDate, setExitDate] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [sellerMobile, setSellerMobile] = useState('');
    const [priceTotal, setPriceTotal] = useState('');

    const [addInventory] = useAddInventoryMutation();
    const { userInfo } = useSelector(state => state.auth);

    const handleInventory = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setValidated(true);
            const inventoryData = {
                createdBy: userInfo,
                itemName,
                itemDescription,
                itemCategory,
                itemQuantity,
                itemMeasurement,
                itemDimensions,
                itemPackaging,
                itemValue,
                itemHandling,
                itemStorage,
                exitDate,
                sellerName,
                sellerEmail,
                sellerMobile,
                priceTotal
            };

            try {
                await addInventory(inventoryData).unwrap();
                toast.success('Inventory added successfully');
            } catch (err) {
                toast.error(err?.data?.message || err?.message || 'An error occurred');
            }
        }
    };

    return (
        <div className='newItems'>
            <div className="top">
                <h1><StoreIcon /> Add Inventory</h1>
            </div>
            <div className="bottom ">
                <Container>
                    <Form className='form' noValidate validated={validated} onSubmit={handleInventory}>
                        <Row className='mb-3'>
                            <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control value={itemName} onChange={e => setItemName(e.target.value)} required className='formInput' type='text' placeholder='Item Name' />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="3" controlId="validationCustom02">
                                <Form.Label> Item Description</Form.Label>
                                <Form.Control value={itemDescription} onChange={e => setItemDescription(e.target.value)} required className='formInput' type="text" placeholder="Description" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                                <Form.Label>Item Category</Form.Label>
                                <Form.Control value={itemCategory} onChange={e => setItemCategory(e.target.value)} required className='formInput' type='text' placeholder='Category' />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                                <Form.Label>Item Quantity</Form.Label>
                                <Form.Control value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} required className='formInput' type='text' placeholder='Quantity' />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="1" controlId="validationCustom02">
                                <Form.Label> Measurement</Form.Label>
                                <Form.Control value={itemMeasurement} onChange={e => setItemMeasurement(e.target.value)} required className='formInput' type="text" placeholder="E.g.., Kilogram/ pieces" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                                <Form.Label>Item Dimensions</Form.Label>
                                <Form.Control value={itemDimensions} onChange={e => setItemDimensions(e.target.value)} required className='formInput' type='text' placeholder='Dimensions' />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className='mb-3'>
                            <Form.Group as={Col} sm='3' controlId='validationCustom01'>
                                <Form.Label>Packaging Type</Form.Label>
                                <Form.Control value={itemPackaging} onChange={e => setItemPackaging(e.target.value)} required className='formInput' type='text' placeholder="E.g.., box, pallet, container" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="3" controlId="validationCustom02">
                                <Form.Label> Item Value</Form.Label>
                                <Form.Control value={itemValue} onChange={e => setItemValue(e.target.value)} required className='formInput' type="text" placeholder="Value" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm='3' controlId='validationCustom01'>
                                <Form.Label>Special Handling Instructions</Form.Label>
                                <Form.Control value={itemHandling} onChange={e => setItemHandling(e.target.value)} required className='formInput' type='text' placeholder="Special Handling Instructions" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="3" controlId="validationCustom02">
                                <Form.Label> Storage Location</Form.Label>
                                <Form.Control value={itemStorage} onChange={e => setItemStorage(e.target.value)} required className='formInput' type="text" placeholder="E.g Shelf Number, Rack Number, Aisle Number, Bin Number" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className='mb-3'>
                            <Form.Group as={Col} sm='3' controlId='validationCustom01'>
                                <Form.Label>Date of Exit</Form.Label>
                                <Form.Control value={exitDate} min={new Date().toISOString().split('T')[0]} onChange={e => setExitDate(e.target.value)} required className='formInput' type='date' placeholder="Date of Exit" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="3" controlId="validationCustom02">
                                <Form.Label> Seller Name</Form.Label>
                                <Form.Control value={sellerName} onChange={e => setSellerName(e.target.value)} required className='formInput' type="text" placeholder="Seller Name" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm='3' controlId='validationCustom01'>
                                <Form.Label>Seller Email</Form.Label>
                                <Form.Control value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} required className='formInput' type='text' placeholder="Seller Email" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="3" controlId="validationCustom02">
                                <Form.Label> Seller Phone Number</Form.Label>
                                <Form.Control value={sellerMobile} onChange={e => setSellerMobile(e.target.value)} required className='formInput' type="text" placeholder="Seller Phone Number" />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Form.Group as={Col} sm='3' className='my-3' controlId='validationCustom01'>
                            <Form.Label>Service Price</Form.Label>
                            <Form.Control value={priceTotal} onChange={e => setPriceTotal(e.target.value)} required className='formInput' type='text' placeholder="Total Service Price" />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="success" type='submit'>
                            Add Inventory
                        </Button>
                    </Form>
                </Container>
            </div>
        </div>
    );
};

export default Warehouse;