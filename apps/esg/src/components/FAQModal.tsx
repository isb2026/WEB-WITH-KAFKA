import React, { useState, useMemo } from 'react';
import { Modal, Form, InputGroup, Button, Nav, Tab, Card, Accordion, Row, Col } from 'react-bootstrap';
import faqData from '../data/faq-content.json';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  items: FAQItem[];
}

interface FAQModalProps {
  show: boolean;
  onHide: () => void;
  onContactSupport: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ show, onHide, onContactSupport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  // Filter FAQ items based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return faqData.categories;
    }

    const searchLower = searchTerm.toLowerCase();
    return faqData.categories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    })).filter(category => category.items.length > 0);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="faq-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="me-2">❓</span>
          FAQ - Help Center
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Search Bar */}
        <div className="mb-4">
          <InputGroup>
            <InputGroup.Text>
              🔍
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={clearSearch}
                size="sm"
              >
                ✕
              </Button>
            )}
          </InputGroup>
        </div>

        {/* Categories and Content */}
        {searchTerm ? (
          // Search Results View
          <div>
            <h6 className="mb-3">
              Search Results for "{searchTerm}" ({filteredData.reduce((acc, cat) => acc + cat.items.length, 0)} results)
            </h6>
            {filteredData.map(category => (
              <div key={category.id} className="mb-4">
                <h6 className="text-muted mb-2">
                  {category.icon} {category.name}
                </h6>
                <Accordion>
                  {category.items.map((item, index) => (
                    <Accordion.Item key={item.id} eventKey={`${category.id}-${index}`}>
                      <Accordion.Header>
                        <div className="fw-bold">{item.question}</div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="mb-0">{item.answer}</p>
                        <div className="mt-2">
                          {item.tags.map(tag => (
                            <span key={tag} className="badge bg-light text-dark me-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          // Category View
          <Tab.Container activeKey={activeCategory} onSelect={(k) => setActiveCategory(k || 'getting-started')}>
            <Row>
              <Col md={3}>
                <Nav variant="pills" className="flex-column">
                  {faqData.categories.map(category => (
                    <Nav.Item key={category.id}>
                      <Nav.Link eventKey={category.id} className="d-flex align-items-center">
                        <span className="me-2">{category.icon}</span>
                        {category.name}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col md={9}>
                <Tab.Content>
                  {faqData.categories.map(category => (
                    <Tab.Pane key={category.id} eventKey={category.id}>
                      <h5 className="mb-3">{category.icon} {category.name}</h5>
                      <Accordion>
                        {category.items.map((item, index) => (
                          <Accordion.Item key={item.id} eventKey={`${category.id}-${index}`}>
                            <Accordion.Header>
                              <div className="fw-bold">{item.question}</div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <p className="mb-0">{item.answer}</p>
                              <div className="mt-2">
                                {item.tags.map(tag => (
                                  <span key={tag} className="badge bg-light text-dark me-1">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <small className="text-muted">
            Can't find what you're looking for? 
            <Button variant="link" size="sm" className="p-0 ms-1" onClick={onContactSupport}>
              Contact Support
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