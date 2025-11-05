// src/components/common/ProfileDropdown.tsx
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Avatar from '../../common/Avatar';

export const ProfileDropdown: FC = () => {
	return (
		<Dropdown as="li" navbar>
			<Dropdown.Toggle
				bsPrefix="toggle"
				as={Link}
				to="#!"
				className="pe-0 ps-2 nav-link"
			>
				<Avatar icon={'user'} />
			</Dropdown.Toggle>

			<Dropdown.Menu className="dropdown-caret dropdown-menu-card dropdown-menu-end">
				<div className="bg-white rounded-2 py-2 dark__bg-1000">
					<Dropdown.Item className="fw-bold text-warning" href="#!">
						{/* <FontAwesomeIcon icon={['fas', 'crown']} className="me-1" /> */}
						{/* <span>Go Pro</span> */}
					</Dropdown.Item>
					{/* <Dropdown.Divider />  */}
					{/* <Dropdown.Item href="#!">Set status</Dropdown.Item> */}
					<Dropdown.Item as={Link} to="/profile/my">
						Profile &amp; account
					</Dropdown.Item>
					{/* <Dropdown.Item href="#!">Feedback</Dropdown.Item> */}
					<Dropdown.Divider />
					<Dropdown.Item as={Link} to="/settings">
						Settings
					</Dropdown.Item>
					{/* <Dropdown.Item as="button" onClick={logout}>
						Logout
					</Dropdown.Item> */}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
};
