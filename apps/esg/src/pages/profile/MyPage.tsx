import React, { useState } from 'react';
import {
	StyledContainer,
	PaperComponent,
} from '@repo/moornmo-ui/components';
import { Row, Col, Card, Form, Button, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { FAQModal } from '../../components/FAQModal';
import { SupportCenterModal } from '../../components/SupportCenterModal';

interface UserProfile {
	id: string;
	username: string;
	email: string;
	fullName: string;
	position: string;
	phone: string;
	avatar?: string;
	company: string;
}

interface ActivityLog {
	id: string;
	action: string;
	timestamp: string;
	ip: string;
	device: string;
}

interface SecuritySession {
	id: string;
	device: string;
	location: string;
	lastActive: string;
	isCurrent: boolean;
}

export const MyPage: React.FC = () => {
	const { showSnackbar } = useSnackbarNotifier();
	
	const [userProfile, setUserProfile] = useState<UserProfile>({
		id: '1',
		username: 'amir',
		email: 'amir@ilts.co.kr',
		fullName: 'Amir Khan',
		position: 'Software Engineer',
		phone: '+82 10-1234-5678',
		company: 'Moornmo',
	});

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<UserProfile>(userProfile);
	const [showFAQModal, setShowFAQModal] = useState(false);
	const [showSupportModal, setShowSupportModal] = useState(false);

	// Mock activity data
	const [activityLog] = useState<ActivityLog[]>([
		{
			id: '1',
			action: 'Logged in',
			timestamp: '2024-01-15 09:30:00',
			ip: '192.168.1.100',
			device: 'Chrome on Windows'
		},
		{
			id: '2',
			action: 'Updated profile',
			timestamp: '2024-01-14 15:45:00',
			ip: '192.168.1.100',
			device: 'Chrome on Windows'
		},
		{
			id: '3',
			action: 'Changed password',
			timestamp: '2024-01-13 11:20:00',
			ip: '192.168.1.100',
			device: 'Chrome on Windows'
		}
	]);

	// Mock security sessions
	const [securitySessions] = useState<SecuritySession[]>([
		{
			id: '1',
			device: 'Chrome on Windows',
			location: 'Seoul, South Korea',
			lastActive: '2 minutes ago',
			isCurrent: true
		},
		{
			id: '2',
			device: 'Safari on iPhone',
			location: 'Seoul, South Korea',
			lastActive: '1 day ago',
			isCurrent: false
		}
	]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSave = () => {
		setUserProfile(formData);
		setIsEditing(false);
		showSnackbar({
			message: 'Successfully updated',
			severity: 'success',
			duration: 3000,
		});
	};

	const handleCancel = () => {
		setFormData(userProfile);
		setIsEditing(false);
	};

	const handleTerminateSession = (sessionId: string) => {
		showSnackbar({
			message: 'Session terminated successfully',
			severity: 'info',
			duration: 3000,
		});
	};

	const handleContactSupport = () => {
		setShowFAQModal(false);
		setShowSupportModal(true);
	};

	const handleCheckFAQ = () => {
		setShowSupportModal(false);
		setShowFAQModal(true);
	};

	return (
		<StyledContainer>
			<div className="mb-4">
				<h2 className="mb-2">My page</h2>
				<p className="text-muted">Profile and account information</p>
			</div>

			<Row>
				{/* Profile Information */}
				<Col lg={8}>
					<Card>
						<Card.Header>
							<div className="d-flex justify-content-between align-items-center">
								<h5 className="mb-0">Profile Information</h5>
								{!isEditing ? (
									<Button 
										variant="outline-primary" 
										size="sm"
										onClick={() => setIsEditing(true)}
									>
										Edit
									</Button>
								) : (
									<div>
										<Button 
											variant="success" 
											size="sm" 
											className="me-2"
											onClick={handleSave}
										>
											Save
										</Button>
										<Button 
											variant="secondary" 
											size="sm"
											onClick={handleCancel}
										>
											Cancel
										</Button>
									</div>
								)}
							</div>
						</Card.Header>
						<Card.Body>
							<Row>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Full Name</Form.Label>
										<Form.Control
											type="text"
											name="fullName"
											value={formData.fullName}
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Profile Name</Form.Label>
										<Form.Control
											type="text"
											name="username"
											value={formData.username}
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Email</Form.Label>
										<Form.Control
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Phone Number</Form.Label>
										<Form.Control
											type="tel"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Position</Form.Label>
										<Form.Control
											type="text"
											name="position"
											value={formData.position}
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Department</Form.Label>
										<Form.Control
											type="text"
											name="department"
											// value={formData.department}
											value="Engineering"
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</Form.Group>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					{/* Activity Log */}
					<Card className="mt-3">
						<Card.Header>
							<h5 className="mb-0">Recent Activity</h5>
						</Card.Header>
						<Card.Body>
							<ListGroup variant="flush">
								{activityLog.map((activity) => (
									<ListGroup.Item key={activity.id} className="d-flex justify-content-between align-items-start">
										<div>
											<div className="fw-bold">{activity.action}</div>
											<small className="text-muted">{activity.device} • {activity.ip}</small>
										</div>
										<small className="text-muted">{activity.timestamp}</small>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Card.Body>
					</Card>

					{/* Security Sessions */}
					<Card className="mt-3">
						<Card.Header>
							<h5 className="mb-0">Active Sessions</h5>
						</Card.Header>
						<Card.Body>
							{securitySessions.map((session) => (
								<div key={session.id} className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
									<div>
										<div className="fw-bold">
											{session.device}
											{session.isCurrent && <Badge bg="success" className="ms-2">Current</Badge>}
										</div>
										<small className="text-muted">{session.location} • Last active: {session.lastActive}</small>
									</div>
									{!session.isCurrent && (
										<Button 
											variant="outline-danger" 
											size="sm"
											onClick={() => handleTerminateSession(session.id)}
										>
											Terminate
										</Button>
									)}
								</div>
							))}
						</Card.Body>
					</Card>
				</Col>

				{/* Account Settings */}
                <Col xs={12} sm={6} md={4} lg={3} xl={2} >

					<Card>
						<Card.Header>
							<h6 className="mb-0">Settings</h6>
						</Card.Header>
						<Card.Body>
							<div className="mb-3">
								<strong>Company:</strong>
								<p className="text-muted mb-0">{userProfile.company}</p>
							</div>
							<div className="mb-3">
								<strong>ID:</strong>
								<p className="text-muted mb-0">{userProfile.id}</p>
							</div>
							<hr />
							<Button variant="outline-warning" size="sm" className="w-100 mb-2">
								Change Password
							</Button>
							
							
						</Card.Body>
					</Card>

					{/* Quick Actions */}
					<Card className="mt-3">
						<Card.Header>
							<h5 className="mb-0">Quick Actions</h5>
						</Card.Header>
						<Card.Body>
							<Button variant="outline-primary" size="sm" className="w-100 mb-2" onClick={() => setShowFAQModal(true)}>
								FAQ
							</Button>
							<Button variant="outline-success" size="sm" className="w-100 mb-2" onClick={() => setShowSupportModal(true)}>
								Support Center
							</Button>
							<Button variant="outline-danger" size="sm" className="w-100">
								Logout
							</Button>
						</Card.Body>
					</Card>

					{/* Notification Preferences */}
					<Card className="mt-3">
						<Card.Header>
							<h6 className="mb-0">Notifications</h6>
						</Card.Header>
						<Card.Body>
							<Form.Check 
								type="switch"
								id="email-notifications"
								label="Email notifications"
								defaultChecked
								className="mb-2"
							/>
							<Form.Check 
								type="switch"
								id="push-notifications"
								label="Push notifications"
								defaultChecked
								className="mb-2"
							/>
							<Form.Check 
								type="switch"
								id="security-alerts"
								label="Security alerts"
								defaultChecked
							/>
						</Card.Body>
					</Card>

					{/* Data & Privacy */}
					<Card className="mt-3">
						<Card.Header>
							<h6 className="mb-0">Data & Privacy</h6>
						</Card.Header>
						<Card.Body>
							<Button variant="outline-info" size="sm" className="w-100 mb-2">
								Export My Data
							</Button>
							<Button variant="outline-secondary" size="sm" className="w-100 mb-2">
								Privacy Settings
							</Button>
							<Button variant="outline-warning" size="sm" className="w-100">
								Delete Account
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* FAQ Modal */}
			<FAQModal 
				show={showFAQModal} 
				onHide={() => setShowFAQModal(false)} 
				onContactSupport={handleContactSupport}
			/>

			{/* Support Center Modal */}
			<SupportCenterModal 
				show={showSupportModal} 
				onHide={() => setShowSupportModal(false)} 
				onCheckFAQ={handleCheckFAQ}
			/>
		</StyledContainer>
	);
}; 