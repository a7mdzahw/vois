'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Input,
  Spinner,
} from '@heroui/react';
import { useReservations } from './hooks/useReservations';
import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

const statusColorMap = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'danger',
} as const;

export default function ReservationsPage() {
  const { data: reservations, isLoading, error } = useReservations();

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-96">
          <Spinner size="lg" label="Loading reservations..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardBody className="text-center py-8">
              <p className="text-red-600 text-lg">
                Error loading reservations: {error.message}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Reservations
          </h1>
          <p className="text-lg text-gray-600">
            Manage and view all room reservations
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search reservations..."
              className="max-w-xs"
              startContent={
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
            <Button color="primary" className="bg-red-600 hover:bg-red-700">
              Filter
            </Button>
          </div>

          <Button as={Link} href="/reserve" color="primary" className="bg-red-600 hover:bg-red-700 rounded-sm" startContent={<PlusIcon className="w-4 h-4" />}>
            Reserve a Room
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-sm">
            <h2 className="text-2xl font-semibold">All Reservations</h2>
          </CardHeader>
          <CardBody className="p-0">
            <Table aria-label="Reservations table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>ROOM</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>USER</TableColumn>
                <TableColumn>PURPOSE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {reservations && reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <TableRow key={reservation.id} className='h-20 border-b border-gray-200 hover:bg-gray-50 cursor-pointer'>
                      <TableCell className="font-mono text-sm">
                        {reservation.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-semibold">
                         <div className="flex items-center gap-2">  <Image
                          src={reservation.roomIcon || ''}
                          alt={reservation.roomName || 'Unknown Room'}
                          width={20}
                          height={20}
                        />
                        {reservation.roomName || 'Unknown Room'}
                        </div>
                      </TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.userName || 'Unknown User'}</TableCell>
                      <TableCell>{reservation.purpose}</TableCell>
                      <TableCell>
                        <Chip
                          variant="flat"
                          size="sm"
                          color={statusColorMap[reservation.status]}
                        >
                          {reservation.status.charAt(0).toUpperCase() +
                           reservation.status.slice(1)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            color="primary"
                            className="text-red-600 hover:text-red-700"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">No reservations found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Showing {reservations?.length || 0} reservations
          </p>
        </div>
      </div>
    </div>
  );
}
