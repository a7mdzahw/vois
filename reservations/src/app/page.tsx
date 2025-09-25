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
} from '@heroui/react';

// Mock data for reservations
const reservations = [
  {
    id: 'RES-001',
    room: 'Auditorium',
    date: '2024-01-15',
    time: '09:00 - 11:00',
    status: 'confirmed',
    user: 'Ahmed Hassan',
    purpose: 'Team Meeting',
  },
  {
    id: 'RES-002',
    room: 'Meeting Room',
    date: '2024-01-16',
    time: '14:00 - 16:00',
    status: 'pending',
    user: 'Sarah Mohamed',
    purpose: 'Client Presentation',
  },
  {
    id: 'RES-003',
    room: 'Conference Room',
    date: '2024-01-17',
    time: '10:00 - 12:00',
    status: 'confirmed',
    user: 'Omar Ali',
    purpose: 'Project Review',
  },
  {
    id: 'RES-004',
    room: 'Relaxing Room',
    date: '2024-01-18',
    time: '15:00 - 17:00',
    status: 'cancelled',
    user: 'Fatma Ibrahim',
    purpose: 'Team Building',
  },
];

// const statusColorMap = {
//   confirmed: 'success',
//   pending: 'warning',
//   cancelled: 'danger',
// } as const;

export default function ReservationsPage() {
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

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
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

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <h2 className="text-2xl font-semibold">All Reservations</h2>
          </CardHeader>
          <CardBody className="p-0">
            <Table aria-label="Reservations table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>ROOM</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>TIME</TableColumn>
                <TableColumn>USER</TableColumn>
                <TableColumn>PURPOSE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-mono text-sm">
                      {reservation.id}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {reservation.room}
                    </TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.user}</TableCell>
                    <TableCell>{reservation.purpose}</TableCell>
                    <TableCell>
                      <Chip
                        variant="flat"
                        size="sm"
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
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Showing {reservations.length} reservations
          </p>
        </div>
      </div>
    </div>
  );
}
