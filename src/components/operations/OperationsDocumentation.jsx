import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Modal, Badge, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './OperationsDocumentation.scss';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const OperationsDocumentation = ({ userInfo, onCreateDocument, onUpdateDocument, onDeleteDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentForm, setDocumentForm] = useState({
    title: '',
    category: 'procedures',
    content: '',
    tags: '',
    isPublic: true,
    attachments: []
  });

  // Document categories
  const categories = [
    { key: 'procedures', label: 'Standard Procedures', icon: <MenuBookIcon />, color: 'primary' },
    { key: 'guidelines', label: 'Guidelines', icon: <ArticleIcon />, color: 'info' },
    { key: 'training', label: 'Training Materials', icon: <VideoLibraryIcon />, color: 'success' },
    { key: 'forms', label: 'Forms & Templates', icon: <PictureAsPdfIcon />, color: 'warning' },
    { key: 'policies', label: 'Policies', icon: <FolderIcon />, color: 'danger' },
    { key: 'troubleshooting', label: 'Troubleshooting', icon: <MenuBookIcon />, color: 'secondary' }
  ];

  // Sample documentation data
  const sampleDocuments = [
    {
      _id: '1',
      title: 'Shipment Tracking Procedures',
      category: 'procedures',
      content: `
# Shipment Tracking Procedures

## Overview
This document outlines the standard procedures for tracking shipments from initial order to final delivery.

## ETA Management
1. **Setting Initial ETA**
   - Review transport method and route
   - Consider weather conditions and seasonal factors
   - Set confidence level (High/Medium/Low)
   - Input tracking number and carrier information

2. **Updating ETA**
   - Monitor shipment progress daily
   - Update location and status
   - Notify customers of significant delays
   - Document delay reasons

## Progress Stages
- **Initial**: Order approved and processing begun
- **On Transit**: Shipment departed origin
- **Arrived**: Shipment reached destination port/airport
- **Clearance**: Customs clearance in progress
- **Delivery**: Out for final delivery
- **Delivered**: Successfully delivered to customer

## Notification Requirements
- Notify operations team of all status changes
- Send customer updates for major milestones
- Alert management of delays exceeding 24 hours
- Document all communications in order history
      `,
      tags: ['tracking', 'eta', 'procedures'],
      createdBy: { name: 'Operations Manager' },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isPublic: true,
      views: 45
    },
    {
      _id: '2',
      title: 'Delay Management Guidelines',
      category: 'guidelines',
      content: `
# Delay Management Guidelines

## Immediate Actions for Delays
1. **Assess Impact**
   - Determine delay duration
   - Identify affected customers
   - Evaluate cost implications

2. **Communication Protocol**
   - Notify operations team within 1 hour
   - Contact customers within 2 hours
   - Update ETA in system immediately

3. **Mitigation Strategies**
   - Explore alternative routes
   - Consider expedited shipping options
   - Negotiate with carriers for priority handling

## Documentation Requirements
- Record delay reason and duration
- Document all communication attempts
- Update customer satisfaction metrics
- File incident report if delay exceeds 48 hours
      `,
      tags: ['delays', 'communication', 'guidelines'],
      createdBy: { name: 'Operations Supervisor' },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      isPublic: true,
      views: 32
    },
    {
      _id: '3',
      title: 'Customer Notification Templates',
      category: 'forms',
      content: `
# Customer Notification Templates

## Progress Update Template
Subject: Shipment Update - [Consignment Number]

Dear [Customer Name],

We wanted to update you on the status of your shipment [Consignment Number].

Current Status: [Status]
Current Location: [Location]
Estimated Arrival: [ETA]

[Additional Details]

Thank you for choosing our services.

Best regards,
Operations Team

## Delay Notification Template
Subject: Important Update - Shipment Delay - [Consignment Number]

Dear [Customer Name],

We regret to inform you that your shipment [Consignment Number] has experienced a delay.

Original ETA: [Original ETA]
Revised ETA: [New ETA]
Delay Reason: [Reason]

We sincerely apologize for any inconvenience and are working to minimize further delays.

Best regards,
Operations Team
      `,
      tags: ['templates', 'communication', 'customer'],
      createdBy: { name: 'Customer Service Manager' },
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-16'),
      isPublic: true,
      views: 28
    }
  ];

  useEffect(() => {
    // Load documents (in real app, this would be an API call)
    setDocuments(sampleDocuments);
    setFilteredDocuments(sampleDocuments);
  }, []);

  // Filter documents
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategory, documents]);

  // Get category info
  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || categories[0];
  };

  // Handle create document
  const handleCreateDocument = async () => {
    try {
      const newDocument = {
        ...documentForm,
        tags: documentForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdBy: userInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0
      };

      await onCreateDocument(newDocument);
      setDocuments(prev => [newDocument, ...prev]);
      toast.success('Document created successfully');
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create document');
    }
  };

  // Handle edit document
  const handleEditDocument = async () => {
    try {
      const updatedDocument = {
        ...selectedDocument,
        ...documentForm,
        tags: documentForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updatedAt: new Date()
      };

      await onUpdateDocument(updatedDocument);
      setDocuments(prev => prev.map(doc => 
        doc._id === selectedDocument._id ? updatedDocument : doc
      ));
      toast.success('Document updated successfully');
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  // Handle delete document
  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await onDeleteDocument(documentId);
        setDocuments(prev => prev.filter(doc => doc._id !== documentId));
        toast.success('Document deleted successfully');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  // Open edit modal
  const openEditModal = (document) => {
    setSelectedDocument(document);
    setDocumentForm({
      title: document.title,
      category: document.category,
      content: document.content,
      tags: document.tags.join(', '),
      isPublic: document.isPublic,
      attachments: document.attachments || []
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setDocumentForm({
      title: '',
      category: 'procedures',
      content: '',
      tags: '',
      isPublic: true,
      attachments: []
    });
    setSelectedDocument(null);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="operations-documentation">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="section-title">
              <MenuBookIcon className="me-2" />
              Operations Documentation
            </h4>
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
            >
              <AddIcon className="me-1" />
              New Document
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <SearchIcon />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Category Overview */}
      <Row className="mb-4">
        {categories.map(category => {
          const categoryDocs = documents.filter(doc => doc.category === category.key);
          return (
            <Col md={4} lg={2} key={category.key} className="mb-3">
              <Card 
                className={`category-card ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <Card.Body className="text-center">
                  <div className={`category-icon bg-${category.color}`}>
                    {category.icon}
                  </div>
                  <h6 className="category-title">{category.label}</h6>
                  <Badge bg={category.color}>{categoryDocs.length}</Badge>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Documents List */}
      <Row>
        {filteredDocuments.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <MenuBookIcon className="empty-icon mb-3" />
                <h5>No documents found</h5>
                <p className="text-muted">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Create your first document to get started'
                  }
                </p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filteredDocuments.map(document => {
            const categoryInfo = getCategoryInfo(document.category);
            return (
              <Col md={6} lg={4} key={document._id} className="mb-4">
                <Card className="document-card h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className={`category-icon small bg-${categoryInfo.color} me-2`}>
                        {categoryInfo.icon}
                      </div>
                      <Badge bg={categoryInfo.color}>{categoryInfo.label}</Badge>
                    </div>
                    <div className="document-actions">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => openEditModal(document)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => handleDeleteDocument(document._id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <h6 className="document-title">{document.title}</h6>
                    <p className="document-preview">
                      {document.content.substring(0, 150)}...
                    </p>
                    <div className="document-tags mb-2">
                      {document.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} bg="light" text="dark" className="me-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    <small>
                      Updated {formatDate(document.updatedAt)} • {document.views} views
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      {/* Create Document Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter document title..."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={documentForm.category}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(category => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={documentForm.content}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter document content (Markdown supported)..."
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentForm.tags}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., procedures, tracking, guidelines"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Public (visible to all team members)"
                    checked={documentForm.isPublic}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateDocument}>
            Create Document
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Document Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={documentForm.category}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(category => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={documentForm.content}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, content: e.target.value }))}
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentForm.tags}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Public (visible to all team members)"
                    checked={documentForm.isPublic}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditDocument}>
            Update Document
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OperationsDocumentation;
