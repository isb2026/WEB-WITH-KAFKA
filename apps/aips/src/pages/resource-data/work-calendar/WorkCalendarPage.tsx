import React, { useState } from 'react';
import { FullCalendar } from '@repo/full-calendar';
import { CalendarEvent } from '@repo/full-calendar';
import { toast } from 'sonner';

export const WorkCalendarPage: React.FC = () => {
	const [events, setEvents] = useState<CalendarEvent[]>([
		// All Day Event - August 1 (Friday)
		{
			id: '1',
			title: 'All Day Event',
			start: '2025-08-01',
			allDay: true,
			color: '#3b82f6',
		},
		// Event 2 - August 4-5 (Monday-Tuesday)
		{
			id: '2',
			title: 'Event 2',
			start: '2025-08-04',
			end: '2025-08-06',
			allDay: true,
			color: '#3b82f6',
		},
		// Long Event - August 6-9 (Wednesday-Saturday)
		{
			id: '3',
			title: 'Long Event',
			start: '2025-08-06',
			end: '2025-08-10',
			allDay: true,
			color: '#3b82f6',
		},
		// 4p Repeating Event - August 9 (Saturday)
		{
			id: '4',
			title: '4p Repeating Event',
			start: '2025-08-09T16:00:00',
			color: '#3b82f6',
		},
		// 4p Repeating Event - August 16 (Saturday)
		{
			id: '5',
			title: '4p Repeating Event',
			start: '2025-08-16T16:00:00',
			color: '#3b82f6',
		},
		// Conference - August 20-22 (Tuesday-Thursday)
		{
			id: '6',
			title: 'Conference',
			start: '2025-08-20',
			end: '2025-08-23',
			allDay: true,
			color: '#3b82f6',
		},
		// Multiple events on August 22 (Thursday)
		{
			id: '7',
			title: '10:30a Meeting',
			start: '2025-08-22T10:30:00',
			color: '#3b82f6',
		},
		{
			id: '8',
			title: '12p Lunch',
			start: '2025-08-22T12:00:00',
			color: '#3b82f6',
		},
		{
			id: '9',
			title: '2:30p Meeting',
			start: '2025-08-22T14:30:00',
			color: '#3b82f6',
		},
		{
			id: '10',
			title: 'Team Review',
			start: '2025-08-22T15:00:00',
			color: '#3b82f6',
		},
		{
			id: '11',
			title: 'Planning Session',
			start: '2025-08-22T16:00:00',
			color: '#3b82f6',
		},
		// Birthday Party - August 23 (Friday)
		{
			id: '12',
			title: '7a Birthday Party',
			start: '2025-08-23T07:00:00',
			color: '#3b82f6',
		},
		// Click for Google - August 27-28 (Wednesday-Thursday)
		{
			id: '13',
			title: 'Click for Google',
			start: '2025-08-27',
			end: '2025-08-29',
			allDay: true,
			color: '#3b82f6',
		},
	]);

	const handleEventClick = (arg: any) => {
		console.log('Event clicked:', arg.event);
		toast.message(
			`Event: ${arg.event.title}\nStart: ${arg.event.start}\nEnd: ${arg.event.end || 'N/A'}`
		);
	};

	const handleDateSelect = (arg: any) => {
		const title = prompt('Enter event title:');
		if (title) {
			const newEvent: CalendarEvent = {
				id: Date.now().toString(),
				title,
				start: arg.startStr,
				end: arg.endStr,
				allDay: arg.allDay,
				color: '#3b82f6',
			};
			setEvents([...events, newEvent]);
		}
	};

	const handleEventDrop = (arg: any) => {
		console.log('Event dropped:', arg.event);
		// Update the event in the local state
		setEvents((prevEvents) =>
			prevEvents.map((event) =>
				event.id === arg.event.id
					? { ...event, start: arg.event.start, end: arg.event.end }
					: event
			)
		);
	};

	const handleEventResize = (arg: any) => {
		console.log('Event resized:', arg.event);
		// Update the event in the local state
		setEvents((prevEvents) =>
			prevEvents.map((event) =>
				event.id === arg.event.id
					? { ...event, start: arg.event.start, end: arg.event.end }
					: event
			)
		);
	};

	return (
		<FullCalendar
			events={events}
			selectable={true}
			selectMirror={true}
			dayMaxEvents={true}
			weekends={true}
			editable={true}
			eventClick={handleEventClick}
			select={handleDateSelect}
			eventDrop={handleEventDrop}
			eventResize={handleEventResize}
		/>
	);
};

export default WorkCalendarPage;
