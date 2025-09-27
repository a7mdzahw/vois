'use client';

import { Button } from '@heroui/react';
import { useCancelReservation } from '@hooks/useReservations';
import { Reservation } from '@contexts/reservation.context';
import { useConfirm } from './ConfirmDialog';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CancelReservation({
  reservation,
}: {
  reservation: Reservation;
}) {
  const confirm = useConfirm();
  const { mutateAsync: cancelReservation, isPending: isCancelling } =
    useCancelReservation();

  return (
    <Button
      isLoading={isCancelling}
      isDisabled={isCancelling || reservation.status === 'cancelled'}
      onPress={async () => {
        const confirmed = await confirm({
          title: 'Cancel Reservation',
          message: `Are you sure you want to cancel this reservation for ${reservation.roomName}? This action cannot be undone.`,
          confirmLabel: 'Cancel',
          rejectLabel: 'Close',
          confirmButtonProps: { color: 'danger' },
        });
        if (!confirmed) return;
        await cancelReservation(reservation.id);
      }}
      startContent={<TrashIcon className="w-4 h-4" />}
      variant="light"
      color="danger"
      size="sm"
      className="text-red-600 hover:text-red-700"
    />

  );
}
