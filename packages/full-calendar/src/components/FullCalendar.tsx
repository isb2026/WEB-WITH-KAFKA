import React from 'react';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, CalendarEvent } from '../types';
import './../styles.css';

interface FullCalendarProps extends CalendarOptions {
	events?: CalendarEvent[];
	className?: string;
}

const FullCalendar: React.FC<FullCalendarProps> = ({
	events = [],
	className = '',
	...options
}) => {
	return (
		<div
			className={`p-4 border ${className}`}
			style={{ borderTop: '10px solid #4F3B8AFF' }}
		>
			<FullCalendarComponent
				plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
				initialView="dayGridMonth"
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek',
				}}
				height="auto"
				events={events}
				editable={true}
				selectable={true}
				selectMirror={true}
				dayMaxEvents={3}
				weekends={true}
				select={options.select}
				eventDrop={options.eventDrop}
				eventResize={options.eventResize}
				{...options}
			/>
		</div>
	);
};

export default FullCalendar;
