import { Divider, Textarea } from '@heroui/react';
import { useTimeSlots } from '@hooks/useReservations';
import { useRooms } from '@hooks/useRooms';
import { useStore, AnyFormApi } from '@tanstack/react-form';
import { formatDate, formatTime } from '@utils/date';

export default function ConfirmationStep({ form }: { form: AnyFormApi }) {
  const { roomId, purpose, date, day } = useStore(form.store, (state) => state.values);

  const { data: rooms = [] } = useRooms();
  const { data: timeSlots = [] } = useTimeSlots(roomId, day);
  const selectedRoom = rooms.find((room) => room.id === roomId);

  const selectedTimeSlot = timeSlots.find((slot) => slot.start === date);

  return (
    <div className="space-y-6">
      {/* Reservation Summary */}
      <div className="bg-gray-50 rounded-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Reservation Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Room:</span>
            <span className="font-medium">{selectedRoom?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {formatTime(selectedTimeSlot?.start || '')} - {formatTime(selectedTimeSlot?.end || '')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-medium">{selectedRoom?.capacity || 'N/A'} people</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h3>

        <Textarea
          label="Purpose of Meeting"
          placeholder="Please describe the purpose of your meeting or event..."
          value={purpose}
          onChange={(e) => form.setFieldValue('purpose', e.target.value)}
          variant="bordered"
          size="lg"
          minRows={3}
          maxRows={6}
          classNames={{
            input: 'text-gray-700',
            inputWrapper: 'border-gray-300 hover:border-red-400 focus-within:border-red-500',
          }}
        />
      </div>
    </div>
  );
}
