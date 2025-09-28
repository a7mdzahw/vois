'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useReservations } from '@hooks/useReservations';
import { EventContentArg } from '@fullcalendar/core';
import { formatTime } from '@utils/date';
import { addMinutes } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function Calendar() {
  const router = useRouter();
  const { data, isLoading } = useReservations();

  const events = data?.map((reservation) => ({
    id: reservation.id,
    title: reservation.roomName || '',
    start: reservation.date,
    end: addMinutes(reservation.date, 30),
  }));

  const renderEventContent = (event: EventContentArg) => {
    const isWeekView = event.view.type === 'timeGridWeek';
    const isListMonthView = event.view.type === 'listMonth';

    const onClick = () => {
      router.push(`/reservations/${event.event.id}`);
    };

    if (isWeekView || isListMonthView) {
      return (
        <div
          className="text-sm font-semibold rounded-sm w-full cursor-pointer"
          onClick={onClick}
        >
          {event.event.title}
        </div>
      );
    }

    return (
      <div
        className="text-white text-sm font-semibold p-2 rounded-sm bg-sky-600 w-full cursor-pointer"
        onClick={onClick}
      >
        {event.event.title}
        <hr className="my-2 border-gray-400" />
        <section hidden={isWeekView}>
          <p>Start: {formatTime(event.event.start || '')}</p> <p>End: {formatTime(event.event.end || '')} </p>
        </section>
      </div>
    );
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto h-[80vh]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Reservations</h1>
        <p className="text-lg text-gray-600">Manage and view all room reservations</p>
      </div>
      <FullCalendar
        dayHeaderClassNames="bg-primary-600 text-white h-10"
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next',
          end: 'dayGridMonth,timeGridWeek,listMonth',
        }}
        events={events}
        loading={() => isLoading}
        eventContent={renderEventContent}
      />
    </div>
  );
}
