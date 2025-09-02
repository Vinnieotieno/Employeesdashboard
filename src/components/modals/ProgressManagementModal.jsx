import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useChangeProgressMutation, useUploadQuoteDocumentMutation } from '../../state/servicesApiSlice';
import { useSelector } from 'react-redux';
import './ProgressManagementModal.scss';

const ProgressManagementModal = ({ show, onHide, orderData, onProgressUpdate }) => {
  const [selectedProgress, setSelectedProgress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [validated, setValidated] = useState(false);
  
  const [changeProgress, { isLoading: isUpdatingProgress }] = useChangeProgressMutation();
  const [uploadDocument, { isLoading: isUploadingDocument }] = useUploadQuoteDocumentMutation();
  const { userInfo } = useSelector(state => state.auth);

  // Progress workflow definitions
  const progressSteps = [
    { key: 'Initial', label: 'Initial', color: 'danger', description: 'Order approved and ready to start' },
    { key: 'On Transit', label: 'On Transit', color: 'warning', description: 'Shipment in transit' },
    { key: 'Arrived', label: 'Arrived', color: 'info', description: 'Shipment arrived at destination' },
    { key: 'Clearance', label: 'Clearance', color: 'primary', description: 'Customs clearance in progress' },
    { key: 'Delivery', label: 'Delivery', color: 'success', description: 'Ready for final delivery' }
  ];

  // Get next allowed progress steps based on current progress
  const getNextSteps = (currentProgress) => {
    const currentIndex = progressSteps.findIndex(step => step.key === currentProgress);
    if (currentIndex === -1) return progressSteps;
    return progressSteps.slice(currentIndex + 1);
  };

  // Get required documents for each progress step
  const getRequiredDocuments = (progress) => {
    const documentRequirements = {
      'On Transit': ['Airway Bill', 'Bill of Lading', 'Commercial Invoice'],
      'Arrived': ['Arrival Notice', 'Delivery Order'],
      'Clearance': ['Customs Declaration', 'Import Permit'],
      'Delivery': ['Delivery Receipt', 'Proof of Delivery']
    };
    return documentRequirements[progress] || [];
  };

  useEffect(() => {
    if (orderData) {
      setSelectedProgress('');
      setNotes('');
      setSelectedFile(null);
      setDocumentType('');
      setValidated(false);
    }
  }, [orderData, show]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Update progress
      if (selectedProgress) {
        await changeProgress({
          Progress: selectedProgress,
          id: orderData._id,
          notes: notes,
          updatedBy: userInfo
        }).unwrap();
        
        toast.success(`Order progress updated to ${selectedProgress}`);
      }

      // Upload document if provided
      if (selectedFile && documentType) {
        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('documentName', documentType);
        formData.append('serviceId', orderData._id);
        
        await uploadDocument(formData).unwrap();
        toast.success('Document uploaded successfully');
      }

      // Callback to refresh parent component
      if (onProgressUpdate) {
        onProgressUpdate();
      }

      onHide();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to update progress');
    }
  };

  const getCurrentStepIndex = () => {
    return progressSteps.findIndex(step => step.key === orderData?.progress) || 0;
  };

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / progressSteps.length) * 100;
  };

  if (!orderData) return null;

  const nextSteps = getNextSteps(orderData.progress);
  const requiredDocs = selectedProgress ? getRequiredDocuments(selectedProgress) : [];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            <span className="me-3">Manage Order Progress</span>
            <small className="text-muted">#{orderData._id?.slice(-8)}</small>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Current Progress Display */}
        <div className="current-progress-section mb-4">
          <h6>Current Status: <span className={`badge bg-${progressSteps[getCurrentStepIndex()]?.color}`}>
            {orderData.progress || 'Not Set'}
          </span></h6>
          
          <div className="progress-timeline mt-3">
            <ProgressBar 
              now={getProgressPercentage()} 
              variant={progressSteps[getCurrentStepIndex()]?.color}
              label={`${Math.round(getProgressPercentage())}%`}
            />
            <div className="progress-steps mt-2">
              {progressSteps.map((step, index) => (
                <div 
                  key={step.key} 
                  className={`progress-step ${index <= getCurrentStepIndex() ? 'completed' : ''}`}
                >
                  <small>{step.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Update Progress To</Form.Label>
                <Form.Select
                  value={selectedProgress}
                  onChange={(e) => setSelectedProgress(e.target.value)}
                  required
                >
                  <option value="">Select next progress step...</option>
                  {nextSteps.map(step => (
                    <option key={step.key} value={step.key}>
                      {step.label} - {step.description}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a progress step.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Document Type (Optional)</Form.Label>
                <Form.Select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="">Select document type...</option>
                  {requiredDocs.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {documentType && (
            <Form.Group className="mb-3">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Form.Text className="text-muted">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this progress update..."
            />
          </Form.Group>

          {selectedProgress && (
            <Alert variant="info">
              <strong>Next Step:</strong> {progressSteps.find(s => s.key === selectedProgress)?.description}
              {requiredDocs.length > 0 && (
                <div className="mt-2">
                  <strong>Recommended Documents:</strong> {requiredDocs.join(', ')}
                </div>
              )}
            </Alert>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isUpdatingProgress || isUploadingDocument}
            >
              {isUpdatingProgress || isUploadingDocument ? 'Updating...' : 'Update Progress'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProgressManagementModal;
