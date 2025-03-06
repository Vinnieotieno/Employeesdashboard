import { useState, useEffect } from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { usePostExchangeRatesMutation, useGetExchangeRatesQuery } from '../../state/servicesApiSlice';
import {toast} from 'react-toastify'
import Loader from '../Loader';

const ExchangeRates = () => {
    const [show, setShow] = useState(false);
    const [USD, setUSD] = useState('')
    const [Pound, setPound] = useState('')
    const [EUR, setEUR] = useState('')
    const [validated, setValidated] = useState(false);
    const [postExchangeRates, ] = usePostExchangeRatesMutation()
    const {data, isLoading, refetch} = useGetExchangeRatesQuery()

    if(isLoading || !data){
        <Loader/>
    }

    useEffect(() => {
        refetch();
        if (data?.length > 0) {
            setUSD(data[0]?.USD);
            setPound(data[0]?.Pound);
            setEUR(data[0]?.EUR);
          }
      }, [data]);

      

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }else{
            setValidated(true);
            postExchangeRates({USD,EUR,Pound}).unwrap().then(res =>{
                toast.success(res?.message)
            }).catch(err =>{
                toast.error(err?.message || err?.data?.message)
            })

        }
      };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
        <p style={{color:'#6439ff', cursor:'pointer'}} onClick={handleShow}>
        <CurrencyExchangeIcon/> Exchange Rates
      </p>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Exchange Rates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="container">
            When inputting an amount, remember it will be converted to our local currency equivalent; e.g., 1 USD becomes 150 Ksh.
            </p>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="validationCustom01">
          <Form.Label>USD</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="USD"
            value={USD}
            onChange={(e) => setUSD(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mt-3' controlId="validationCustom01">
          <Form.Label>Pound</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Pound"
            value={Pound}
            onChange={(e) => setPound(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mt-3' controlId="validationCustom01">
          <Form.Label>EUR</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="EUR"
            value={EUR}
            onChange={(e) => setEUR(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ExchangeRates