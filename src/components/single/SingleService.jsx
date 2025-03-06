import React, { useState, useEffect } from 'react';
import './style.scss';
import Sidebar from '../sidebar/Sidebar';
import Navigation from '../navbar/Navigation';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { useDeleteOrAbortQuoteMutation, useGetSingleOrderQuery, useSendQuoteMutation, useUploadQuoteDocumentMutation, useUpdateServiceMutation, useGetExchangeRatesQuery, useAssignDriverMutation} from '../../state/servicesApiSlice'; 
import { useGetDriversQuery } from '../../state/usersApiSlice';
import { Button, Dropdown, Form, Row, Col } from 'react-bootstrap';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import {toast} from 'react-toastify'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useSelector} from 'react-redux'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import ReportsModal from '../modals/ReportsModal';




const SingleService = () => {
    const {userInfo} = useSelector(state => state.auth)
    const params = useParams();
    const [validated, setValidated] = useState(false);
    const { id } = params;

    const { data, isLoading, refetch } = useGetSingleOrderQuery(id);
    const [sendQuote] = useSendQuoteMutation();
    const [uploadDocument] = useUploadQuoteDocumentMutation()
    const [deleteOrAbortQuote] = useDeleteOrAbortQuoteMutation()
    const navigate = useNavigate()
    const [showMenu2, setShowMenu2] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [reportMessage, setReportMessage] = useState('');
    const [revenue, setRevenue] = useState('');
    const [operationalExpense, setOperationalExpense] = useState('');
    const [nonOperationalExpense, setNonOperationalExpense] = useState('');
    const [updateService] = useUpdateServiceMutation()
    const { data:ExchangeRateData, isLoading:Loading, refetch: updating} = useGetExchangeRatesQuery();
    const [exchangeRates, setExchangeRates] = useState({});
    const [driver, setDriver] = useState('')
    const {data:drivers, refetch:RefetchingDriver} = useGetDriversQuery()
    const [assignDriver] = useAssignDriverMutation()


    const formatDateTime = (dateString) => {
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const timeString = new Date(dateString).toLocaleTimeString(undefined, optionsTime);
        const dateStringFormatted = new Date(dateString).toLocaleDateString(undefined, optionsDate);
    
        return (
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '9px' }}>
            <span>{timeString}</span>
            <span>{dateStringFormatted}</span>
          </div>
        );
      };

    useEffect(()=>{
        refetch()
        RefetchingDriver()
        if(data){
            setRevenue(data?.revenue)
            setOperationalExpense(data?.operationalExpense)
            setNonOperationalExpense(data?.nonOperationalExpense)
            if(ExchangeRateData?.length > 0){
                const formattedExchangeRates = {
                  USD: ExchangeRateData[0]?.USD || 0,
                  EUR: ExchangeRateData[0]?.EUR || 0,
                  Pound: ExchangeRateData[0]?.Pound || 0,
                };
                setExchangeRates(formattedExchangeRates);
              }
        }
    },[data])

  

    if (isLoading || !data) {
        return <Loader />;
    }
    const CreatedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        
      });
    const formattedDate = new Date(data.updatedAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        
      });

      const ToggleMenu = () =>{
        setShowMenu(!showMenu)
      }
      const ToggleMenu2 = () =>{
        setShowMenu2(!showMenu2)
      }
      
      const handleDocument = (e, documentName) => {
        e.preventDefault();
        const file = e.target.files[0];
        console.log(file); 
        const formData = new FormData();
        formData.append('document', file); 
        formData.append('id', id); 
        formData.append('documentName', documentName); 
        
        uploadDocument(formData)
            .unwrap()
            .then(res => {
                toast.success(res?.message);
            })
            .catch(err => {
                console.log(err);
                toast.error(err?.data?.message || err?.message);
            });
    }

//   const sendQuoteAction = async (e) => {
//     e.preventDefault();

//     try {
//         const response = await sendQuote({id}).unwrap();
//         toast.success(response.message)
//     } catch (err) {
//         console.log('Error sending quote:', err);
//         toast.error(err?.data?.message || err?.message)
//     }
// };

const handleDeleteAbort = async(e) =>{
    e.preventDefault()
    let data = {
        id,
        command:"Abort"
    }
    try {
        const response = await deleteOrAbortQuote(data).unwrap();
        toast.success(response.message)

        setTimeout(() => {
            navigate('/sales/orders');
        }, 7000)

    } catch (err) {
        console.log('Error sending quote:', err);
        toast.error(err?.data?.message || err?.message)
    }
}
const handleDelete = async(e) =>{
    e.preventDefault()
    let data = {
        id,
        command:"Delete"
    }
    try {
        const response = await deleteOrAbortQuote(data).unwrap();
        toast.success(response.message)

        setTimeout(() => {
            navigate('/sales/orders');
        }, 7000)

    } catch (err) {
        console.log('Error sending quote:', err);
        toast.error(err?.data?.message || err?.message)
    }
}
const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{
        setValidated(true);
        event.preventDefault();
        updateService({serviceId:id, reports:[{issuedBy:userInfo, message:reportMessage}]}).unwrap().then(res =>{
            toast.success(res?.message)
            setReportMessage('')
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
            console.log(err?.message || err?.data?.message)
        })

    }
  };

  const handleFinances = e =>{
    e.preventDefault()
    updateService({serviceId:id, revenue,operationalExpense, nonOperationalExpense}).unwrap().then(res =>{
        toast.success(res?.message)
        setReportMessage('')
    }).catch(err =>{
        toast.error(err?.message || err?.data?.message)
        console.log(err?.message || err?.data?.message)
    })
  }

  const equivalentAmountsInKshArray = data?.amount?.map((amount, index) => {
    const currency = data.currency[index];
    const exchangeRate = exchangeRates[currency] || 1;
    return amount * exchangeRate;
  });
  
  const sumEquivalentAmountsInKsh = equivalentAmountsInKshArray.reduce((total, amount) => total + amount, 0);

  const assignDriverFunction = async(e) =>{
    e.preventDefault()
    assignDriver({serviceId:id, driver}).unwrap().then(res => {
        toast.success(res?.message)
    }).catch(err =>{
        toast.error(err?.message || err?.data?.message)
    })
    
  }

    return (
        <div className="singleservice">
            <Sidebar />
            <div className="singleserviceDetails">
                <Navigation />


                <div className='newItems'>
                <div className="top">
                <h1>{data?.amount?.length !== 0 ?  'Quotation': 'Dump'} number {data?._id}</h1>
                {data?.amount?.length !== 0 && <ul style ={{display:'flex'}}>
                <li style={{listStyle:'none', color:'#6439ff'}}>
                <div onClick={ToggleMenu} style={{ cursor: 'pointer' }}>
                    <span>Documents</span>
                    {showMenu ? <ArrowDropUpRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/> : <ArrowDropDownRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/>}
                </div>
                {showMenu && (
                    <ul className='dropDown'>
                        {data?.document && data?.document?.length > 0 &&
                        data?.document?.map((doc, index) => {
                        const parts = doc?.split(":"); // Split the string at ":"
                        const documentName = parts[0]?.trim(); // Get the name before ":"
                        const documentUrl = parts[1] ? parts[1]?.trim() : ""; // Get the name after ":" (if present)

                        return (
                        <li key={index}>
                        <a href={`https://globeflightapi.onrender.com/uploads/${documentUrl}`} style={{ textDecoration: 'none' }}>
                        <span>{documentName}</span>
                        </a>
                        </li>
                        );
                        })}
                    {data?.document?.length === 0  && <li>
                        No Document
                        </li>}
                    </ul>
                )}
                </li>
                <li  style={{listStyle:'none', padding:'5px 20px', cursor: 'pointer', color: '#6439ff'}}><ReportsModal data={data} /></li> 
                </ul>}
                </div>
                <div className="bottom">
                    {data.createdBy.fname ? <h1>Created By: {data.createdBy.fname} {data.createdBy.lname}</h1> :  <h1>Created By: {data.createdBy.name} </h1>}
                    <p><b>Created Date:</b> {CreatedDate} <br /> <b>Updated Date:</b> {formattedDate}</p>
                </div>
                <div className="bottom">
                        <div className="clientDetails">
                        <div>
                        <h1>Client Details</h1>
                            <ul>
                                <li>Name: <b>{data.contactPerson}</b></li>
                                <li>Company: <b>{data.companyName}</b></li>
                                <li>Email: <b>{data.email}</b></li>
                                <li>Country: <b>{data.country}</b></li>
                                <li>Town: <b>{data.town}</b></li>
                                <li>Contact: <b>{data.mobile}</b></li>
                                <li>Service: <b>{data.order.join(', ')}</b></li>
                                <li>Quote Amount: <b>{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(sumEquivalentAmountsInKsh)}</b></li>
                            </ul>
                        </div>
                        <div>
                        <h1>Shipper Details</h1>
                        <ul>
                                <li>Location: <b>{data.shipperLocation}</b></li>
                                <li>Contact Person: <b>{data.shipperContact}</b></li>
                                <li> Number: <b>{data.shipperPhone}</b></li>
                            </ul>
                        </div>
                        </div>
                        <div className="shipmentDetails">
                        <h1>Shipment Details</h1>
                            <ul>
                                <li>Consignment: <b>{data.consignment}</b></li>
                                <li>Ecoterm: <b>{data.ecoterm}</b></li>
                                <li>Description: <b>{data.description}</b></li>
                                <li>Dimension: <b>{data.dimension}</b></li>
                                <li>Weight: <b> {data.weight} {data.measure}</b></li>
                                <li>Specifications: <b>{data.specifications}</b></li>
                                <li>Origin: <b>{data.origin}</b></li>
                                <li>Destination: <b>{data.destination}</b></li>
                                <li>Mode of Transport: <b>{data.transport}</b></li>
                                <li>Status: <b>{data.status}</b></li>
                                <li>Progress: <b>{data.progress}</b></li>
                            </ul>
                            {data?.progress === 'Delivery' ? <div className="mt-5">
                        <h1 className="text-center">Assign Driver <small style={{fontSize:'14px', color:'#666'}}>(If Applicable)</small></h1>
                        <Form onSubmit={assignDriverFunction}>
                        <Form.Group controlId="validationCustom03">
                        <Form.Label>Assign Driver</Form.Label>
                        <Form.Select
                            value={driver}
                            onChange={(e) => setDriver(e.target.value)}
                            className="formInput"
                            required
                        >
                            <option value="">Select a Driver</option>
                            {drivers?.map((driver) => (
                            <option key={driver._id} value={driver._id}>
                                {driver.name}
                            </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select a Driver
                        </Form.Control.Feedback>
                        </Form.Group>
                            <Button type={'submit'} className="mt-4" variant={'warning'}>Assign</Button>
                        </Form>
                    </div> : null}
                        </div>
                        {(userInfo.department === 'Customer Care' && data?.amount.length !== 0 ) &&
                        <div className="documentsUploads">
                            <h1>Documents</h1>
                            <ul>
                                <li>
                                <label htmlFor="file"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    Airway Bill
                                    <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file" id="file" hidden onChange={(e) => handleDocument(e, 'Airway Bill')} />
                                    {data.document[0]?.includes('Airway Bill') && <input type="checkbox" className='checkboxes' checked />}
                                    </label>
                                </li>
                                <li>
                                <label htmlFor="file1"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    COC
                                    <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file1" id="file1" hidden onChange={(e) => handleDocument(e, 'COC')} />
                                    {data.document[0]?.includes('COC') && <input type="checkbox" checked />}
                                    </label>
                                </li>
                                <li>
                                <label htmlFor="file2"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    Commercial Invoice
                                    <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.[0]" name="file2" id="file2" hidden onChange={(e) => handleDocument(e, 'Commercial Invoice')} />
                                    {data.document[0]?.includes('Commercial Invoice') && <input type="checkbox" checked />}
                                    </label>
                                </li>
                                <li>
                                <label htmlFor="file3"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    BL
                                    <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file3" id="file3" hidden onChange={(e) => handleDocument(e, 'BL')} />
                                    {data.document[0]?.includes('BL') && <input type="checkbox" checked />}
                                    </label>
                                </li>
                                <li>
                                <label htmlFor="file99"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                 IDF
                            <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file99" id="file99" hidden onChange={(e) => handleDocument(e, 'IDF')} />
                            {data.document[0]?.includes('IDF') && <input type="checkbox" checked />}
                            </label>
                                </li>
                                <li>
                                <label htmlFor="file4"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    Others
                                    <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file4" id="file4" hidden onChange={(e) => handleDocument(e, 'others')} />
                                    {data.document[0]?.includes('others') && <input type="checkbox" checked />}
                                    </label>
                                </li>

                            </ul>
                        </div>}
                </div>
                 <div className="bottom">
                    {userInfo.department === 'Management' && <>
                    <Button className='my-2'variant='danger' onClick={handleDelete}><DeleteForeverIcon/> Delete Quote</Button>
                    <Button className='my-2'variant='warning' onClick={handleDeleteAbort}><DeleteForeverIcon/> Abort Quote</Button></>}

                    <Link className='my-2' to={`/sales/new/${data._id}`}><Button><EditIcon/> {data?.amount.length !== 0 ? 'Edit Quote' : 'Create Quote'}</Button></Link>
                    
                    {/* <Button className='my-2'variant='info' onClick={sendQuoteAction}> <SendIcon/> Send Quote</Button> */}
                    {data?.amount.length !== 0 && <div className="signup-profile-pic__container my-2">
                    <label htmlFor="file5" className="btn btn-success" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                        <ThumbUpAltIcon />Confirm Quote
                        <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file5" id="file5" hidden onChange={(e) => handleDocument(e, 'Quotation')} />
                    </label>
                    </div>}
                    {data?.amount.length !== 0 && <Dropdown className='my-2'>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic" title="Upload the required documents">
                        Upload Documents
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {userInfo.department === 'Sales' && <><Dropdown.Item href="#/action-1">
                        <label htmlFor="file9"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                            Profoma Invoice
                            <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file9" id="file9" hidden onChange={(e) => handleDocument(e, 'Profoma invoice')} />
                            {data.document[0]?.includes('Profoma invoice') && <input type="checkbox" checked />}
                            </label>
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            <label htmlFor="file0"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                            Packing List
                            <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file0" id="file0" hidden onChange={(e) => handleDocument(e, 'Packing List')} />
                            {data.document[0]?.includes('Packing List') && <input type="checkbox" checked />}
                            </label>
                            </Dropdown.Item> </>}
                            {userInfo.department === 'Operations' && <Dropdown.Item href="#/action-1">
                        <label htmlFor="file99"  style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                            IDF
                            <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file99" id="file99" hidden onChange={(e) => handleDocument(e, 'IDF')} />
                            {data.document[0]?.includes('IDF') && <input type="checkbox" checked />}
                            </label>
                        </Dropdown.Item>}
                    </Dropdown.Menu>
                    </Dropdown>}
                </div>
                {data?.amount.length !== 0 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="" style={{ WebkitBoxShadow: '2px 4px 10px 1px rgba(0, 0, 0, 0.47)', boxShadow: '2px 4px 10px 1px rgba(201, 201, 201, 0.47)', padding: '15px', margin: '20px', width: '80%' }}>
                    {userInfo.department !== 'Finance' &&
                    <Form  onSubmit={handleSubmit}>
                    <Form.Group controlId="validationCustom01">
                    <Form.Label><InventoryRoundedIcon /> Report</Form.Label>
                    <Form.Control
                        style={{ width: '100%' }} 
                        type="text"
                        placeholder="Report"
                        as={'textarea'}
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant='warning' className='mt-4'>Submit Report</Button>
                    </Form>}

                    {userInfo.department === 'Finance' && 
                    <Form onSubmit={handleFinances}>
                    <Row className='mt-4'>
                        <Form.Group as={Col} sm="4" controlId="validationCustom08">
                    <Form.Label><InventoryRoundedIcon /> Revenue</Form.Label>
                    <Form.Control
                        style={{ width: '100%' }} 
                        type="number"
                        placeholder="Revenue"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} sm="4" controlId="validationCustom09">
                    <Form.Label><InventoryRoundedIcon /> Operational Expenses</Form.Label>
                    <Form.Control
                        style={{ width: '100%' }} 
                        type="number"
                        placeholder="Operational Expenses"
                        value={operationalExpense}
                        onChange={(e) => setOperationalExpense(e.target.value)}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} sm="4" controlId="validationCustom11">
                    <Form.Label><InventoryRoundedIcon /> Non-Operational Expenses (KES)</Form.Label>
                    <Form.Control
                        style={{ width: '100%' }} // Set 
                        type="number"
                        placeholder="Non-Operational Expenses"
                        value={nonOperationalExpense}
                        onChange={(e) => setNonOperationalExpense(e.target.value)}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    </Row>
                    <Button type="submit" variant='warning' className='mt-4'>Submit Report</Button>
                    </Form>}
                    </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default SingleService;
