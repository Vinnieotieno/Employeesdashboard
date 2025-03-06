import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import './modal.scss'; 
import Loader from '../Loader';

const ReportsModal = ({ data }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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


  return (
    <div>
      <p style={{ cursor: 'pointer', color: '#6439ff' }} onClick={handleShow}>
        <InventoryRoundedIcon />
        Reports
      </p>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <InventoryRoundedIcon /> Reports
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '450px', overflow: 'scroll', overflowX: 'hidden' }}>
          {data?.reports?.map((report, index) => (
            <div key={index} style={{ WebkitBoxShadow: '2px 4px 10px 1px rgba(0, 0, 0, 0.47)', boxShadow: '2px 4px 10px 1px rgba(201, 201, 201, 0.47)', padding: ' 1px 10px', marginBottom: '10px', width: '95%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {report?.issuedBy?.image ? (
                    <img src={`http://localhost:3000/${report?.issuedBy?.image}`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} alt="" />
                  ) : (
                    <img src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" style={{ width: '50px', height: '50px', borderRadius: '50%' }} alt="" />
                  )}
                  <div style={{ padding: '0 15px' }}>
                    <p>
                      {report?.issuedBy?.fname || report?.issuedBy?.lname ? (
                        <p style={{ fontSize: '15px' }}>
                          <b>Name:</b> {report?.issuedBy?.fname || ''} {report?.issuedBy?.lname || ''} <br /> <b>Department:</b> {report?.issuedBy?.department || ''}
                        </p>
                      ) : (
                        <p style={{ fontSize: '15px' }}>
                          <b>Name:</b> {report?.issuedBy?.name || ''} <br /> <b>Department:</b> {report?.issuedBy?.department || ''}
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <p style={{ width: '80%', fontSize: '14px' }}>{report?.message} </p>
                <span style={{ width: '20%' }}>{formatDateTime(report?.createdAt)}</span>
              </div>
              <hr />
            </div>
          ))}
          {data?.reports?.length === 0 ? <p>No Reports for this Order</p> : null}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReportsModal;
