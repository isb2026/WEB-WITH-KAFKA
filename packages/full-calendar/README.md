# @repo/full-calendar

A React wrapper for FullCalendar with TypeScript support, featuring interactive events, multiple views, and custom styling.

## Installation

```bash
pnpm add @repo/full-calendar
```

## Features

✅ **Interactive Events**: Drag & drop, resize, click  
✅ **Multiple Views**: Month, Week, Day, List  
✅ **Event Management**: Create, edit, delete events  
✅ **Custom Styling**: Tailwind CSS compatible  
✅ **TypeScript Support**: Full type definitions  
✅ **Responsive Design**: Mobile-friendly layout  

## Usage

```tsx
import React, { useState } from 'react';
import { FullCalendar } from '@repo/full-calendar';
import { CalendarEvent } from '@repo/full-calendar';

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: '2025-08-15T10:00:00',
      end: '2025-08-15T11:00:00',
      color: '#3b82f6'
    }
  ]);

  const handleEventClick = (arg: any) => {
    console.log('Event clicked:', arg.event);
  };

  const handleEventDrop = (arg: any) => {
    console.log('Event dropped:', arg.event);
    // Update your events state here
  };

  const handleEventResize = (arg: any) => {
    console.log('Event resized:', arg.event);
    // Update your events state here
  };

  return (
    <FullCalendar
      events={events}
      selectable={true}
      editable={true}
      eventClick={handleEventClick}
      eventDrop={handleEventDrop}
      eventResize={handleEventResize}
    />
  );
};
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `events` | `CalendarEvent[]` | Array of calendar events |
| `editable` | `boolean` | Enable drag & drop and resizing |
| `selectable` | `boolean` | Enable date selection |
| `selectMirror` | `boolean` | Show selection preview |
| `dayMaxEvents` | `boolean \| number` | Limit events per day |
| `weekends` | `boolean` | Show/hide weekends |
| `eventClick` | `function` | Event click handler |
| `select` | `function` | Date selection handler |
| `eventDrop` | `function` | Event drag & drop handler |
| `eventResize` | `function` | Event resize handler |
| `className` | `string` | Additional CSS classes |

## Event Object

```tsx
interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  color?: string;
  extendedProps?: Record<string, any>;
}
```

## Event Handlers

### Event Click
```tsx
const handleEventClick = (arg: any) => {
  console.log('Event:', arg.event.title);
  console.log('Start:', arg.event.start);
  console.log('End:', arg.event.end);
};
```

### Event Drop (Drag & Drop)
```tsx
const handleEventDrop = (arg: any) => {
  // Update event position in your state
  setEvents(prevEvents => 
    prevEvents.map(event => 
      event.id === arg.event.id 
        ? { ...event, start: arg.event.start, end: arg.event.end }
        : event
    )
  );
};
```

### Event Resize
```tsx
const handleEventResize = (arg: any) => {
  // Update event duration in your state
  setEvents(prevEvents => 
    prevEvents.map(event => 
      event.id === arg.event.id 
        ? { ...event, start: arg.event.start, end: arg.event.end }
        : event
    )
  );
};
```

### Date Selection
```tsx
const handleDateSelect = (arg: any) => {
  const title = prompt('Enter event title:');
  if (title) {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      start: arg.startStr,
      end: arg.endStr,
      allDay: arg.allDay,
    };
    setEvents([...events, newEvent]);
  }
};
```

## Views

The calendar supports multiple view types:
- **Month View**: `dayGridMonth` (default)
- **Week View**: `dayGridWeek`
- **Day View**: `dayGridDay`
- **List View**: `listWeek`

## Dependencies

- @fullcalendar/core
- @fullcalendar/react  
- @fullcalendar/daygrid
- @fullcalendar/interaction
- React 18+

## Customization

The calendar can be styled using CSS classes or Tailwind CSS. All FullCalendar CSS classes are available for customization.

## Example Implementation

See `apps/aips/src/pages/resource-data/work-calendar/WorkCalendarPage.tsx` for a complete working example with all features enabled.
