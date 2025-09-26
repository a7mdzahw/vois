'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { useCreateReservation } from '../hooks/useReservations';
import { useRooms } from '../hooks/useRooms';

export default function CreateReservationForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: rooms } = useRooms();
  const createReservation = useCreateReservation();

  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    status: 'pending' as 'confirmed' | 'pending' | 'cancelled',
    purpose: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomId || !formData.date || !formData.purpose) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createReservation.mutateAsync({ ...formData });
      setFormData({
        roomId: '',
        date: '',
        status: 'pending',
        purpose: '',
      });
      onOpenChange();
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation');
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        className="bg-red-600 hover:bg-red-700"
      >
        Create Reservation
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Reservation
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Select
                      label="Room"
                      placeholder="Select a room"
                      selectedKeys={formData.roomId ? [formData.roomId] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setFormData(prev => ({ ...prev, roomId: selectedKey }));
                      }}
                      isRequired
                      items={rooms}
                    >
                      {(room) => (
                        <SelectItem>
                          {room.name}
                        </SelectItem>
                      )}
                    </Select>

                    <Input
                      type="date"
                      label="Date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      isRequired
                    />

                    <Select
                      label="Status"
                      placeholder="Select status"
                      selectedKeys={[formData.status]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setFormData(prev => ({ ...prev, status: selectedKey as 'confirmed' | 'pending' | 'cancelled' }));
                      }}
                      isRequired
                    >
                      <SelectItem key="pending">Pending</SelectItem>
                      <SelectItem key="confirmed">Confirmed</SelectItem>
                      <SelectItem key="cancelled">Cancelled</SelectItem>
                    </Select>

                    <Input
                      label="Purpose"
                      placeholder="Enter purpose of reservation"
                      value={formData.purpose}
                      onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                      isRequired
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={createReservation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Create Reservation
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
