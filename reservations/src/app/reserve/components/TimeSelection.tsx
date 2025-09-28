import { Badge, Card, CardBody, Chip, Skeleton } from '@heroui/react';
import { useStore, AnyFormApi } from '@tanstack/react-form';
import { DatePicker } from '@heroui/react';
import { getLocalTimeZone, parseDate } from '@internationalized/date';
import { formatDate, formatTime } from '@utils/date';
import { useTimeSlots } from '@hooks/useReservations';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function TimeSelection({ form }: { form: AnyFormApi }) {
  const { day, date, roomId } = useStore(form.store, (state) => state.values);

  const { data: timeSlots = [], isLoading: isLoadingTimeSlots } = useTimeSlots(
    roomId,
    day
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Select Date
          </h3>
          <DatePicker
            label="Select Date"
            value={parseDate(formatDate(day))}
            onChange={(value) =>
              value &&
              form.setFieldValue(
                'day',
                value.toDate(getLocalTimeZone()).toISOString()
              )
            }
            minValue={parseDate(formatDate(new Date()))}
            variant="bordered"
            size="lg"
            classNames={{
              input: 'text-gray-700',
              inputWrapper:
                'border-gray-300 hover:border-red-400 focus-within:border-red-500',
            }}
          />
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Available Time Slots
          </h3>
          <div className="max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-2 px-1">
            {isLoadingTimeSlots && (
              <>
                <Skeleton className="w-full h-12 shrink-0" />
                <Skeleton className="w-full h-12 shrink-0" />
                <Skeleton className="w-full h-12 shrink-0" />
              </>
            )}

            {timeSlots.map((slot) => (
              <section
                key={slot.id}
                onClick={() =>
                  slot.available && form.setFieldValue('date', slot.start)
                }
                className={`cursor-pointer transition-all duration-200 h-fit shrink-0 border border-gray-300 rounded-md ${
                  !slot.available
                    ? 'opacity-50 cursor-not-allowed'
                    : date === slot.start
                    ? 'ring-2 ring-red-500 bg-red-50'
                    : 'hover:shadow-md hover:scale-102'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </span>
                    {!slot.available ? (
                      <Badge
                        placement="top-left"
                        content="Booked"
                        color="danger"
                        size="sm"
                      >
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                      </Badge>
                    ) : date === slot.start ? (
                      <Chip color="danger" size="sm">
                        Selected
                      </Chip>
                    ) : (
                      <ClockIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
