import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import {toast} from 'react-toastify'
import {useAddServiceMutation, useUpdateServiceMutation} from '../../state/servicesApiSlice'
import Loader from '../../components/Loader'
import { useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSingleOrderQuery } from '../../state/servicesApiSlice';
import './new.scss'

const options = [
    'Please select an Action',
    'Call',
    'Chat',
    'Email',
  ];

  const services = [
    'Please select a Service',
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

  const modeOfTransport = [
    'Please select mode of transport',
    'Road',
    'Air',
    'Sea',
    'Courier',
  ]

  const consignmentList = [
    'Please select a consignment',
    'DGR',
    'General Cargo',
  ]

  const specificationconsignmentList= [
    'Specifications',
    '20 Ft',
    '40 Ft',
    'LCL',
    'Air Freight',
  ]

  const weightMeasure = [
    'Measure',
    'Kgs',
    'CBM',
  ]

  const EcotermList = [
    'Ecoterms',
    'DDP',
    'DAP',
    'FOB',
    'CIF',
    'CFR',
    'Ex-Works',
  ]

  const currencyList = [
    'Currency',
    'Ksh',
    'USD',
    'Pound',
    'EUR',
  ]


const NewService = () => {
    const [validated, setValidated] = useState(false);
    const [companyName, setCompanyName] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [town, setTown] = useState('')
    const [country, setCountry] = useState('')
    const [engagementPurpose, setEngagementPurpose] = useState('')
    const [action, setAction] = useState('')
    const [order, setOrder] = useState(null)
    const [transport, setTransport] = useState(null)
    const [packages, setPackages] = useState('')
    const [consignment, setConsignment] = useState('')
    const [specifications, setSpecifications] = useState('')
    const [description, setDescription] = useState('')
    const [dimension, setDimension] = useState('')
    const [measure, setMeasure] = useState('')
    const [weight, setWeight] = useState('')
    const [ecoterm, setEcoterm] = useState('')
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [amount, setAmount] = useState('')
    const [shipperLocation, setShipperLocation] = useState('')
    const [shipperContact, setShipperContact] = useState('')
    const [shipperPhone, setShipperPhone] = useState('')
    const [shipperEmail, setShipperEmail] = useState('')
    const [toggleView, setToggleView] = useState(true);
    const [addService, {isLoading}] =useAddServiceMutation();
    const {userInfo} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const params = useParams()
    const [updateService] = useUpdateServiceMutation()
    const [servicesOpen, setServicesOpen] = useState(false);
    const [amounts, setAmounts] = useState([]);
    const [currencies, setCurrencies] = useState([]);

    const { id } = params;

    const { data, refetch } = useGetSingleOrderQuery(id);

    const handleAmountChange = (e, index) => {
        const newAmounts = [...amounts];
        newAmounts[index] = e.target.value;
        setAmounts(newAmounts);
      };

      const handleCurrencyChange = (e, index) => {
        const newCurrencies = [...currencies];
        newCurrencies[index] = e.target.value;
        setCurrencies(newCurrencies);
      };

useEffect(() => {
    refetch();
    if(data){
        setCompanyName(data.companyName)
        setContactPerson(data.contactPerson)
        setMobile(data.mobile)
        setEmail(data.email)
        setTown(data.town)
        setCountry(data.country)
        setEngagementPurpose(data.engagementPurpose)
        setAction(data.action)
        setOrder(data.order)
        setTransport(data.transport)
        setPackages(data.packages)
        setConsignment(data.consignment)
        setSpecifications(data.specifications)
        setDescription(data.description)
        setDimension(data.dimension)
        setMeasure(data.measure)
        setWeight(data.weight)
        setEcoterm(data.ecoterm)
        setOrigin(data.origin)
        setDestination(data.destination)
        setAmount(data.amount)
        setShipperPhone(data.shipperPhone)
        setShipperContact(data.shipperContact)
        setShipperLocation(data.shipperLocation)
        setShipperEmail(data.shipperEmail)
    }

}, [data]);



    const showtoggleView = () => {
        setToggleView(!toggleView);
      };




    const serviceData = {serviceId:id ,createdBy:userInfo, companyName, shipperLocation, shipperContact, shipperPhone, contactPerson, mobile, email,town, country,
        engagementPurpose, action, order, transport, packages, consignment,shipperEmail, specifications, description, dimension, measure,
       weight, ecoterm, origin, destination, amount:amounts, currency:currencies}


      const handleUpdateService = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          toast.error('Please fill in all the required fields')
        }else{
            setValidated(true);
            console.log(serviceData)

            updateService(serviceData).unwrap().then(res =>{
                toast.success(res?.message)
            }).catch(err =>{
                toast.error(err?.data?.message || err?.message);
            })
     }
        }


      
  return (
    <div className='newItems'>
        <div className="top">
          <h1><CategoryRoundedIcon/> {id ? `Update Quote No. ${id}` : 'Create A New Quotation'}</h1>
        </div>
        <div className="bottom">
          <Form noValidate validated={validated} onSubmit={handleUpdateService } className='form'>
                <Row className='mb-3'>
                    <h2 style={{fontSize:'23px', color:'#6439ff'}}>Client Details:</h2>
                    <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                        <Form.Label>Company name:</Form.Label>
                        <Form.Control value={companyName} onChange={e => setCompanyName(e.target.value)} required className='formInput' type='text' placeholder='Company Name'/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Contact Person:</Form.Label>
                        <Form.Control value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className='formInput' type="text" placeholder="Contact Person"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control value={mobile} onChange={e => setMobile(e.target.value)} required className='formInput' type="text" placeholder="Phone Number"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={email} onChange={e => setEmail(e.target.value)} required className='formInput' type="email" placeholder="Email"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Country</Form.Label>
                        <Form.Control value={country} onChange={e => setCountry(e.target.value)} required className='formInput' type="text" placeholder="Country"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Town</Form.Label>
                        <Form.Control value={town} onChange={e => setTown(e.target.value)} required className='formInput' type="text" placeholder="Town"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='mb-3'>
                    <h2 style={{fontSize:'23px', color:'#6439ff'}}>Shipper Details:</h2>
                    <Form.Group as={Col} sm='3' controlId='validationCustom01'>
                        <Form.Label>Location:</Form.Label>
                        <Form.Control value={shipperLocation} onChange={e => setShipperLocation(e.target.value)} required className='formInput' type='text' placeholder='Location'/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom02">
                        <Form.Label>Contact Person</Form.Label>
                        <Form.Control value={shipperContact} onChange={e => setShipperContact(e.target.value)} required className='formInput' type="text" placeholder="Contact Person"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom02">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control value={shipperPhone} onChange={e => setShipperPhone(e.target.value)} required className='formInput' type="text" placeholder="Phone Number"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom05346">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control value={shipperEmail} onChange={e => setShipperEmail(e.target.value)} required className='formInput' type="email" placeholder="Email Address"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <h2 style={{fontSize:'23px', color:'#6439ff'}}>Other Details:</h2>
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
            {!servicesOpen && <Form.Control onClick={() => setServicesOpen(!servicesOpen)} value={order}  placeholder='Select Atleast one service' className='formInput'/>}
            {servicesOpen && <p onClick={()=>setServicesOpen(!servicesOpen)} style={{cursor:'pointer'}} > Close Services</p>}
            {servicesOpen && services.map((option, index) => (
                <div key={index} className="form-check" style={{}}>
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

                    <Form.Group as={Col} sm="3" controlId="validationCustom04">
                    <Form.Label>Mode of Transport</Form.Label>
                    <Form.Select
                        value={transport} onChange={e => setTransport(e.target.value)}
                        className="formInput"
                        required
                    >
                        {modeOfTransport.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a Service
                    </Form.Control.Feedback>
                    </Form.Group>
                    
            </Row>
            <Row className='mb-3'>
                    <h2 style={{fontSize:'23px', color:'#6439ff'}}>Shipment Particulars:</h2>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>No. of Pkgs:</Form.Label>
                        <Form.Control value={packages} onChange={e => setPackages(e.target.value)}  className='formInput' type="number" placeholder="No. Of Pkgs"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom04">
                    <Form.Label>Consignment</Form.Label>
                    <Form.Select
                        value={consignment} 
                        onChange={e => setConsignment(e.target.value)}
                        className="formInput"
                        required
                    >
                        {consignmentList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a Consignment
                    </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} sm="2" controlId="validationCustom04">
                    <Form.Label>Specification Consignment</Form.Label>
                    <Form.Select
                        value={specifications} 
                        onChange={e => setSpecifications(e.target.value)}
                        className="formInput"
                    >
                        {specificationconsignmentList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                        Please select a specification
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom02">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control value={description} onChange={e => setDescription(e.target.value)} required className='formInput' as="textarea" type="text" placeholder="Description"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="3" controlId="validationCustom02">
                        <Form.Label>Dimension:</Form.Label>
                        <Form.Control value={dimension} onChange={e => setDimension(e.target.value)}  className='formInput' as="textarea"  type="text" placeholder="Dimension"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='mb-3'>
                    <Form.Group as={Col} sm="1" controlId="validationCustom04">
                    <Form.Label>Measure</Form.Label>
                    <Form.Select
                        value={measure}
                        onChange={e => setMeasure(e.target.value)}
                        className="formInput"
                        required
                    >
                        {weightMeasure.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a Service
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                        <Form.Label>Weight: <span style={{fontSize:'11px', color:'gray'}}>(Total Weight!)</span></Form.Label>
                        <Form.Control value={weight} onChange={e => setWeight(e.target.value)} required className='formInput' type='number' placeholder='Weight'/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    {(transport === 'Air' || transport === 'Sea') && (
                        <Form.Group as={Col} sm='2' controlId='validationCustom01'>
                        <Form.Label>Ecoterm: </Form.Label>
                        <Form.Select
                        value={ecoterm}
                        onChange={(e) => setEcoterm(e.target.value)}
                        className="formInput"
                    >
                        {EcotermList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a Service
                    </Form.Control.Feedback>
                    </Form.Group>
                    )}
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Origin:</Form.Label>
                        <Form.Control value={origin} onChange={e => setOrigin(e.target.value)} required className='formInput' type="text" placeholder="Origin"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="2" controlId="validationCustom02">
                        <Form.Label>Destination:</Form.Label>
                        <Form.Control value={destination} onChange={e => setDestination(e.target.value)} required className='formInput' type="text" placeholder="Destination"/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='my-4'>
                {data && order?.map((orderItem, index) => (
                    <Row key={index}>
                        <Form.Group as={Col} sm="2" controlId={`order-currency-${index}`}>
                        <Form.Label>Currency</Form.Label>
                        <Form.Select
                            value={currencies[index] || ''}
                            onChange={(e) => handleCurrencyChange(e, index)}
                            className="formInput"
                            required
                        >
                            {currencyList.map((option, currencyIndex) => (
                            <option key={currencyIndex} value={option}>
                                {option}
                            </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select a Currency
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} sm="3" controlId={`order-amount-${index}`}>
                        <Form.Label>Amount for {orderItem}:</Form.Label>
                        <Form.Control
                            value={amounts[index] || ''}
                            onChange={(e) => handleAmountChange(e, index)}
                            required
                            className="formInput"
                            type="number"
                            placeholder="Amount"
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    ))}
                </Row>
                {isLoading && <Loader/> }
            <Button variant='info'  type="submit">{id ? 'Update Quote' : 'Create Quote'}</Button>
            </Form>
        </div>
    </div>
  )
}

export default NewService