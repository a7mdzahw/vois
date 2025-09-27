'use client';

import { useUser } from '@clerk/nextjs';
import { useConfirm } from '@components/ConfirmDialog';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import {
  addToast,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Spinner,
} from '@heroui/react';
import { formatDate, formatDateTime, formatTime } from '@utils/date';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDeleteReservation, useReservation } from '../../../hooks/useReservations';

const statusColorMap = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'danger',
} as const;

const statusIconMap = {
  confirmed: '✅',
  pending: '⏳',
  cancelled: '❌',
} as const;

export default function ViewReservationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const reservationId = params?.reservationId as string;
  const confirm = useConfirm();


  const deleteReservation = useDeleteReservation();


  // Find the current reservation
  const {data: currentReservation, isLoading: isLoadingReservation} = useReservation(reservationId);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  const handleDelete = async () => {
    if (!currentReservation) return;

        const confirmed = await confirm({
          title: 'Delete Reservation',
          message: `Are you sure you want to delete this reservation for ${currentReservation.roomName}? This action cannot be undone.`,
          confirmLabel: 'Delete',
          rejectLabel: 'Cancel',
          confirmButtonProps: { color: 'danger' },
        });

    if (!confirmed) return;

    try {
      await deleteReservation.mutateAsync(reservationId);

      addToast({
        title: 'Reservation deleted successfully!',
        description: 'The reservation has been permanently deleted.',
        color: 'success',
      });

      router.push('/');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      addToast({
        title: 'Failed to delete reservation',
        description: 'Please try again.',
        color: 'danger',
      });
    }
  };

  if (!isLoaded || isLoadingReservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" label="Loading reservation..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!currentReservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Reservation Not Found</h1>
          <p className="text-gray-600 mb-6">The reservation you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <Button
            color="danger"
            onPress={() => router.push('/')}
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const reservationDate = new Date(currentReservation.date);
  const isPastReservation = reservationDate < new Date();
  const canEdit = !isPastReservation && currentReservation.status !== 'cancelled';
  const canCancel = !isPastReservation && currentReservation.status !== 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            as={Link}
            href="/"
            variant="light"
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
            className="mb-4"
          >
            Back to Reservations
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Reservation Details
              </h1>
              <p className="text-lg text-gray-600">
                View and manage your room reservation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Chip
                variant="flat"
                size="lg"
                color={statusColorMap[currentReservation.status]}
                startContent={statusIconMap[currentReservation.status]}
              >
                {currentReservation.status.charAt(0).toUpperCase() +
                 currentReservation.status.slice(1)}
              </Chip>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Information */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Room Information</h2>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                  {currentReservation.roomIcon && <Image
                      src={currentReservation.roomIcon}
                      alt={currentReservation.roomName || 'Room'}
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {currentReservation.roomName || 'Unknown Room'}
                    </h3>
                    <p className="text-gray-600">
                      Reservation ID: <span className="font-mono text-sm">{currentReservation.id}</span>
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Date & Time Information */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Date & Time</h2>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="w-5 h-5" />
                      <span className="font-medium">Date</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-800">
                      {formatDate(reservationDate)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ClockIcon className="w-5 h-5" />
                      <span className="font-medium">Time</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-800">
                      {formatTime(reservationDate.toISOString())}
                    </p>
                  </div>
                </div>

                {isPastReservation && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span className="font-medium">Past Reservation</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      This reservation has already passed and cannot be modified.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Purpose & Details */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Purpose & Details</h2>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Meeting Purpose</h3>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                      {currentReservation.purpose}
                    </p>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Reservation Status</h3>
                      <Chip
                        variant="flat"
                        color={statusColorMap[currentReservation.status]}
                        startContent={statusIconMap[currentReservation.status]}
                        size="lg"
                      >
                        {currentReservation.status.charAt(0).toUpperCase() +
                         currentReservation.status.slice(1)}
                      </Chip>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Created</h3>
                      <p className="text-gray-800">
                        {formatDateTime(reservationDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                <h2 className="text-xl font-semibold">Actions</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-3">
                  {canEdit && (
                    <Button
                      as={Link}
                      href={`/reserve/${reservationId}`}
                      color="primary"
                      className="w-full"
                      startContent={<PencilIcon className="w-4 h-4" />}
                    >
                      Edit Reservation
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      color="warning"
                      variant="flat"
                      className="w-full"
                      startContent={<ExclamationTriangleIcon className="w-4 h-4" />}
                    >
                      Cancel Reservation
                    </Button>
                  )}

                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    onPress={handleDelete}
                    isLoading={deleteReservation.isPending}
                    isDisabled={deleteReservation.isPending}
                  >
                    {deleteReservation.isPending ? 'Deleting...' : 'Delete Reservation'}
                  </Button>

                  <Button
                    as={Link}
                    href="/"
                    variant="light"
                    className="w-full"
                    startContent={<ArrowLeftIcon className="w-4 h-4" />}
                  >
                    Back to List
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <h2 className="text-xl font-semibold">Quick Info</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      color={statusColorMap[currentReservation.status]}
                      variant="flat"
                    >
                      {currentReservation.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{currentReservation.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(reservationDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTime(reservationDate.toISOString())}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
