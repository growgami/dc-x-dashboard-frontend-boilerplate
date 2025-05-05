import { forwardRef, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Badge } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers';
import Card from '../Card';
import { CalendarModal } from '@/components/modals';

interface BadgeData {
  date: Date;
  count: number;
  events: string[];
}

const sampleBadgeData: BadgeData[] = [
  { 
    date: new Date(2024, 4, 2), 
    count: 3,
    events: ['Team Meeting', 'Product Launch', 'Social Media Post']
  },
  { 
    date: new Date(2024, 4, 7), 
    count: 2,
    events: ['Blog Post Review', 'Newsletter Draft']
  },
  { 
    date: new Date(2024, 4, 13), 
    count: 5,
    events: ['Marketing Campaign', 'Content Planning', 'Team Sync', 'Client Meeting', 'Analytics Review']
  },
  { 
    date: new Date(2024, 4, 15), 
    count: 1,
    events: ['Quarterly Review']
  },
  { 
    date: new Date(2024, 4, 21), 
    count: 4,
    events: ['Website Update', 'Social Media Strategy', 'Content Creation', 'Team Training']
  },
  { 
    date: new Date(2024, 4, 25), 
    count: 2,
    events: ['Monthly Report', 'Team Feedback Session']
  },
  { 
    date: new Date(2024, 4, 28), 
    count: 3,
    events: ['Content Review', 'Social Media Audit', 'Planning Session']
  },
];

const Grid6Card = forwardRef<HTMLDivElement>((props, ref) => {
  const [value, setValue] = useState<Date | null>(new Date(2024, 4, 1));
  const [openModal, setOpenModal] = useState(false);
  const [, setSelectedEvents] = useState<string[]>([]);
  const [, setSelectedDate] = useState<Date | null>(null);

  const getBadgeContent = (day: Date) => {
    const badge = sampleBadgeData.find(
      (item) => item.date.toDateString() === day.toDateString()
    );
    return badge ? badge.count : 0;
  };

  const getEvents = (day: Date) => {
    const badge = sampleBadgeData.find(
      (item) => item.date.toDateString() === day.toDateString()
    );
    return badge?.events || [];
  };

  const handleDateClick = (day: Date) => {
    const events = getEvents(day);
    if (events.length > 0) {
      setSelectedEvents(events);
      setSelectedDate(day);
      setOpenModal(true);
    }
  };

  const ServerDay = (props: PickersDayProps) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const badgeContent = getBadgeContent(day);

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={badgeContent || undefined}
        color="primary"
        variant="dot"
        invisible={!badgeContent || outsideCurrentMonth}
      >
        <PickersDay 
          {...other} 
          outsideCurrentMonth={outsideCurrentMonth} 
          day={day}
          selected={false}
          onDaySelect={() => handleDateClick(day)}
        />
      </Badge>
    );
  };

  return (
    <>
      <Card ref={ref} className="col-start-5 row-start-1 row-span-3 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Content Calendar</h3>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slots={{ day: ServerDay }}
              views={['day']}
              sx={{
                width: '100%',
                '.MuiPickersDay-root': {
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: 'rgb(17, 24, 39)',
                  fontWeight: 500
                },
                '.MuiDayCalendar-weekDayLabel': {
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600
                },
                '.MuiPickersDay-today': {
                  backgroundColor: 'rgba(17, 24, 39, 0.1) !important',
                  color: 'rgb(17, 24, 39) !important',
                  fontWeight: 600
                },
                '.Mui-selected': {
                  backgroundColor: 'rgb(17, 24, 39) !important',
                  color: 'white !important',
                  fontWeight: 600
                }
              }}
            />
          </LocalizationProvider>
        </div>
      </Card>

      <CalendarModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
});

Grid6Card.displayName = 'Grid6Card';

export default Grid6Card; 