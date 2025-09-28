'use client';

import { Button, Spinner } from '@heroui/react';
import { useReservation } from '@hooks/useReservations';
import { useParams, useRouter } from 'next/navigation';
import ReservePage from '../page';

export default function EditReservationPage() {
  const router = useRouter();

  const params = useParams();
  const reservationId = params?.reservationId as string;

  const { data: currentReservation, isLoading } = useReservation(reservationId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" label="Loading..." />
        </div>
      </div>
    );
  }

  if (!currentReservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Reservation Not Found</h1>
          <p className="text-gray-600 mb-6">The reservation you&apos;re looking for doesn&apos;t exist.</p>
          <Button color="danger" onPress={() => router.push('/')}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return <ReservePage reservation={currentReservation} />;
}
