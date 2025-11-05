import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Card, Dropdown, ListGroup } from 'react-bootstrap';
// import {
//   rawEarlierNotifications,
//   rawNewNotifications
// } from 'data/notification/notification';
import { isIterableArray } from '@repo/utils';
// import useFakeFetch from 'hooks/useFakeFetch';
import { FalconCardHeader } from '../../../components/common';
// import FalconCardHeader from 'components/libraryommon/FalconCardHeader';
// import Notification from 'components/notification/Notification';
import SimpleBar from 'simplebar-react';

// 알림 데이터 타입 정의
interface NotificationItem {
	id: string | number;
	unread?: boolean;
	[key: string]: any; // 기타 속성 허용
}

export const NotificationDropdown: React.FC = () => {
	// State
	// const { data: newNotifications, setData: setNewNotifications } =
	// 	useFakeFetch<NotificationItem[]>(rawNewNotifications);
	// const { data: earlierNotifications, setData: setEarlierNotifications } =
	// 	useFakeFetch<NotificationItem[]>(rawEarlierNotifications);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isAllRead, setIsAllRead] = useState<boolean>(false);

	// Handler
	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerWidth < 1200) {
				setIsOpen(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// const markAsRead = (e: React.MouseEvent<HTMLAnchorElement>) => {
	// 	e.preventDefault();

	// 	const updatedNewNotifications = newNotifications.map((notification) =>
	// 		Object.prototype.hasOwnProperty.call(notification, 'unread')
	// 			? { ...notification, unread: false }
	// 			: notification
	// 	);

	// 	const updatedEarlierNotifications = earlierNotifications.map(
	// 		(notification) =>
	// 			Object.prototype.hasOwnProperty.call(notification, 'unread')
	// 				? { ...notification, unread: false }
	// 				: notification
	// 	);

	// 	setIsAllRead(true);
	// 	// setNewNotifications(updatedNewNotifications);
	// 	setEarlierNotifications(updatedEarlierNotifications);
	// };

	return (
		<Dropdown navbar as="li" show={isOpen} onToggle={handleToggle}>
			<Dropdown.Toggle
				bsPrefix="toggle"
				as={Link}
				to="#!"
				className={classNames('px-0 nav-link', {
					'notification-indicator notification-indicator-primary':
						!isAllRead,
				})}
			>
				<FontAwesomeIcon
					icon="bell"
					transform="shrink-6"
					className="fs-5"
				/>
			</Dropdown.Toggle>

			<Dropdown.Menu className="dropdown-menu-card dropdown-menu-end dropdown-caret dropdown-caret-bg">
				<Card
					className="dropdown-menu-notification dropdown-menu-end shadow-none"
					style={{ maxWidth: '20rem' }}
				>
					<FalconCardHeader
						className="card-header"
						title="Notifications"
						titleTag="h6"
						light={false}
						endEl={
							<Link
								className="card-link fw-normal"
								to="#!"
								// onClick={markAsRead}
							>
								Mark all as read
							</Link>
						}
					/>
					<SimpleBar style={{ maxHeight: '19rem' }}>
						<ListGroup variant="flush" className="fw-normal fs-10">
							<div className="list-group-title">NEW</div>
							{/* {isIterableArray(newNotifications) &&
								newNotifications.map((notification) => (
									<ListGroup.Item
										key={notification.id}
										onClick={handleToggle}
									>
										<Notification {...notification} flush />
									</ListGroup.Item>
								))} */}
							<div className="list-group-title">EARLIER</div>
							{/* {isIterableArray(earlierNotifications) &&
								earlierNotifications.map((notification) => (
									<ListGroup.Item
										key={notification.id}
										onClick={handleToggle}
									>
										<Notification {...notification} flush />
									</ListGroup.Item>
								))} */}
						</ListGroup>
					</SimpleBar>
					<div
						className="card-footer text-center border-top"
						onClick={handleToggle}
					>
						<Link className="card-link d-block" to="#!">
							View all
						</Link>
					</div>
				</Card>
			</Dropdown.Menu>
		</Dropdown>
	);
};
