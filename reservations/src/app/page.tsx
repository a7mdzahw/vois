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
import { useReservations } from '../hooks/useReservations';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { formatDateTime } from '@utils/date';
import { useRouter } from 'next/navigation';
import CancelReservation from '@components/CancelReservation';
import { useState } from 'react';

const statusColorMap = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'danger',
} as const;

export default function ReservationsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useReservations();

  const reservations = data?.filter((reservation) => {
    return (
      reservation.roomName?.toLowerCase().includes(search.toLowerCase()) ||
      reservation.userName?.toLowerCase().includes(search.toLowerCase()) ||
      reservation.purpose?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const router = useRouter();

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reservations..."
              className="w-72 hover:outline-none focus:outline-none"
              startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
            />
          </div>

          <Button
            as={Link}
            href="/reserve"
            color="primary"
            className="bg-red-600 hover:bg-red-700 rounded-sm"
            startContent={<PlusIcon className="w-4 h-4" />}
          >
            Reserve a Room
          </Button>
        </div>

        <Card className="shadow-lg rounded-sm">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-sm">
            <h2 className="text-2xl font-semibold">All Reservations</h2>
          </CardHeader>
          <CardBody className="p-0 rounded-sm">
            <Table aria-label="Reservations table">
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>ROOM</TableColumn>
                <TableColumn>DATE / TIME</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  STATUS
                </TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {reservations && reservations.length > 0 ? (
                  reservations.map((reservation, index) => (
                    <TableRow
                      key={reservation.id}
                      className="h-20 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        router.push(`/reservations/${reservation.id}`);
                      }}
                    >
                      <TableCell className="font-mono text-sm text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          {reservation.roomIcon && (
                            <Image
                              src={reservation.roomIcon}
                              alt={reservation.roomName || 'Unknown Room'}
                              width={20}
                              height={20}
                            />
                          )}
                          {reservation.roomName || 'Unknown Room'}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatDateTime(reservation.date)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
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
                            startContent={<PencilIcon className="w-4 h-4" />}
                            onPress={() => {
                              router.push(`/reserve/${reservation.id}`);
                            }}
                          />
                          <CancelReservation reservation={reservation} />
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
