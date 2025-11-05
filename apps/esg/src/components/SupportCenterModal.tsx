import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import supportData from '../data/support-content.json';

interface ContactMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: string;
  availability: string;
  responseTime: string;
}

interface SupportCenterModalProps {
  show: boolean;
  onHide: () => void;
  onCheckFAQ: () => void;
}

export const SupportCenterModal: React.FC<SupportCenterModalProps> = ({ show, onHide, onCheckFAQ }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleContactMethod = (method: ContactMethod) => {
    if (method.action === 'chat') {
      // For live chat, we could open a chat widget or show a message
      alert('Live chat feature will be available soon!');
      return;
    }
    
    // For external links (email, phone, whatsapp)
    if (method.action.startsWith('mailto:') || method.action.startsWith('tel:') || method.action.startsWith('http')) {
      window.open(method.action, '_blank');
    }
  };

  const isBusinessHours = () => {
    const now = new Date();
    const kstHour = now.getUTCHours() + 9; // KST is UTC+9
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return dayOfWeek >= 1 && dayOfWeek <= 5 && kstHour >= 9 && kstHour < 18;
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="support-center-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="me-2">🆘</span>
          Support Center
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Business Hours Alert */}
        {!isBusinessHours() && (
          <Alert variant="info" className="mb-4">
            <strong>Outside Business Hours:</strong> We're currently outside our regular business hours. 
            For urgent issues, please use our emergency contact or email support.
          </Alert>
        )}

        {/* Contact Methods */}
        <div className="mb-4">
          <h5 className="mb-3">Contact Methods</h5>
          <Row>
            {supportData.contactMethods.map((method) => (
              <Col key={method.id} md={6} className="mb-3">
                <Card 
                  className={`h-100 contact-method-card ${selectedMethod === method.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <Card.Body className="text-center">
                    <div className="mb-2">
                      <span className="fs-1">{method.icon}</span>
                    </div>
                    <h6 className="card-title">{method.name}</h6>
                    <p className="card-text text-muted small">{method.description}</p>
                    <div className="mb-2">
                      <Badge bg="light" text="dark" className="me-1">
                        {method.availability}
                      </Badge>
                      <Badge bg="info" text="white">
                        {method.responseTime}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactMethod(method);
                      }}
                    >
                      {method.action === 'chat' ? 'Start Chat' : 'Contact'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Office Information */}
        <div className="mb-4">
          <h5 className="mb-3">Office Information</h5>
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Address:</strong>
                    <p className="text-muted mb-0">{supportData.officeInfo.address}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong>
                    <p className="text-muted mb-0">{supportData.officeInfo.phone}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Email:</strong>
                    <p className="text-muted mb-0">{supportData.officeInfo.email}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Business Hours:</strong>
                    <p className="text-muted mb-0">{supportData.officeInfo.businessHours}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        {/* Emergency Contact */}
        {supportData.emergencyContact.available && (
          <div className="mb-4">
            <h5 className="mb-3">Emergency Contact</h5>
            <Alert variant="warning">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>24/7 Emergency Support</strong>
                  <p className="mb-0 text-muted">{supportData.emergencyContact.description}</p>
                  <small className="text-muted">
                    Phone: {supportData.emergencyContact.phone} | 
                    Email: {supportData.emergencyContact.email}
                  </small>
                </div>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => window.open(`tel:${supportData.emergencyContact.phone}`, '_blank')}
                >
                  Emergency Call
                </Button>
              </div>
            </Alert>
          </div>
        )}

        {/* Quick Tips */}
        <div>
          <h5 className="mb-3">Quick Tips</h5>
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>📧 Email Support:</strong>
                <p className="text-muted small mb-0">Best for non-urgent issues and detailed questions</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>📞 Phone Support:</strong>
                <p className="text-muted small mb-0">Best for urgent issues and complex problems</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>💬 Live Chat:</strong>
                <p className="text-muted small mb-0">Best for quick questions and real-time assistance</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>📱 WhatsApp:</strong>
                <p className="text-muted small mb-0">Best for mobile users and file sharing</p>
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <small className="text-muted">
            Need help with something specific? 
            <Button variant="link" size="sm" className="p-0 ms-1" onClick={onCheckFAQ}>
              Check our FAQ
            </Button>
          </small>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}; 