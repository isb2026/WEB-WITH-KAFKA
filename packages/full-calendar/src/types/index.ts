export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  color?: string;
  extendedProps?: Record<string, any>;
}

export interface CalendarOptions {
  initialView?: string;
  height?: string | number;
  editable?: boolean;
  selectable?: boolean;
  selectMirror?: boolean;
  dayMaxEvents?: boolean | number;
  weekends?: boolean;
  events?: CalendarEvent[];
  select?: (arg: any) => void;
  eventClick?: (arg: any) => void;
  eventDrop?: (arg: any) => void;
  eventResize?: (arg: any) => void;
}
