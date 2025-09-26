'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Divider,
  Chip,
  Badge,
  Progress,
  addToast,
} from '@heroui/react';
import {
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useRooms } from '../hooks/useRooms';
import { useReservationsWithCreate } from '../hooks/useReservations';

interface Room {
  id: string;
  name: string;
  icon?: string;
  capacity?: number;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { id: '9-10', time: '9:00 AM - 10:00 AM', available: true },
  { id: '10-11', time: '10:00 AM - 11:00 AM', available: true },
  { id: '11-12', time: '11:00 AM - 12:00 PM', available: false },
  { id: '12-1', time: '12:00 PM - 1:00 PM', available: true },
  { id: '1-2', time: '1:00 PM - 2:00 PM', available: true },
  { id: '2-3', time: '2:00 PM - 3:00 PM', available: false },
  { id: '3-4', time: '3:00 PM - 4:00 PM', available: true },
  { id: '4-5', time: '4:00 PM - 5:00 PM', available: true },
  { id: '5-6', time: '5:00 PM - 6:00 PM', available: true },
];

export default function ReservePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { data: rooms = [] } = useRooms();
  const { createReservation } = useReservationsWithCreate();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !selectedTimeSlot || !selectedDate || !purpose) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createReservation.mutateAsync({
        roomId: selectedRoom.id,
        date: selectedDate,
        status: 'confirmed',
        purpose: purpose,
      });

      // Reset form
      setCurrentStep(0);
      setSelectedRoom(null);
      setSelectedTimeSlot(null);
      setSelectedDate('');
      setPurpose('');

      addToast({
        title: 'Reservation created successfully!',
        description: 'Your reservation has been created successfully.',
        color: 'success',
      });

      router.push('/');
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedRoom !== null;
      case 1:
        return selectedTimeSlot !== null && selectedDate !== '';
      case 2:
        return purpose.trim() !== '';
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return 'Choose a Room';
      case 1:
        return 'Select Time & Date';
      case 2:
        return 'Confirm Details';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return 'Select the room that best fits your needs';
      case 1:
        return 'Pick an available time slot and date for your reservation';
      case 2:
        return 'Review your reservation details and add any additional information';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Reserve a Room
          </h1>
          <p className="text-lg text-gray-600">
            Book your perfect meeting space in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <div className="w-full">
              <Progress
                value={(currentStep + 1) * 33.33}
                color="danger"
                className="mb-4"
              />
              <div className="flex justify-between">
                <div
                  className={`flex flex-col items-center ${
                    currentStep >= 0 ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  <BuildingOfficeIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Choose Room</span>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    currentStep >= 1 ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  <ClockIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Select Time</span>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    currentStep >= 2 ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  <CheckCircleIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Confirm</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Step Content */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div>
              <h2 className="text-2xl font-semibold">{getStepTitle()}</h2>
              <p className="text-red-100 mt-1">{getStepDescription()}</p>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            {/* Step 1: Room Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;

                    return (
                      <Card
                        key={room.id}
                        isPressable
                        onPress={() => setSelectedRoom(room)}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-red-500 bg-red-50'
                            : 'hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        <CardBody className="p-6 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div
                              className={`p-4 rounded-full ${
                                isSelected ? 'bg-red-100' : 'bg-gray-100'
                              }`}
                            >
                              <Image
                                width={32}
                                height={32}
                                src={room.icon || ''}
                                alt={room.name}
                                className={`w-8 h-8 ${
                                  isSelected ? 'text-red-600' : 'text-gray-600'
                                }`}
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {room.name}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                Capacity: <b>{(room).capacity || 'N/A'}</b>
                                People
                              </p>
                            </div>
                            {/* {isSelected && (
                              <Chip color="danger" size="sm">
                                Selected
                              </Chip>
                            )} */}
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Time Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Select Date
                    </h3>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
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
                    <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <Card
                          key={slot.id}
                          isPressable={slot.available}
                          onPress={() =>
                            slot.available && setSelectedTimeSlot(slot)
                          }
                          className={`cursor-pointer transition-all duration-200 ${
                            !slot.available
                              ? 'opacity-50 cursor-not-allowed'
                              : selectedTimeSlot?.id === slot.id
                              ? 'ring-2 ring-red-500 bg-red-50'
                              : 'hover:shadow-md hover:scale-102'
                          }`}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium">
                                {slot.time}
                              </span>
                              {!slot.available ? (
                                <Badge
                                  content="Booked"
                                  color="danger"
                                  size="sm"
                                >
                                  <ClockIcon className="w-5 h-5 text-gray-400" />
                                </Badge>
                              ) : selectedTimeSlot?.id === slot.id ? (
                                <Chip color="danger" size="sm">
                                  Selected
                                </Chip>
                              ) : (
                                <ClockIcon className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Reservation Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Reservation Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{selectedRoom?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {selectedTimeSlot?.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">
                        {selectedRoom?.capacity || 'N/A'} people
                      </span>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Additional Information
                  </h3>
                  <Textarea
                    label="Purpose of Meeting"
                    placeholder="Please describe the purpose of your meeting or event..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    variant="bordered"
                    size="lg"
                    minRows={3}
                    maxRows={6}
                    classNames={{
                      input: 'text-gray-700',
                      inputWrapper:
                        'border-gray-300 hover:border-red-400 focus-within:border-red-500',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                onPress={handlePrevious}
                isDisabled={currentStep === 0}
                variant="ghost"
                className="text-gray-600"
              >
                Previous
              </Button>

              {currentStep < 2 ? (
                <Button
                  onPress={handleNext}
                  isDisabled={!canProceed()}
                  color="danger"
                  className="px-8"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onPress={handleSubmit}
                  isDisabled={!canProceed() || isSubmitting}
                  color="danger"
                  className="px-8"
                  isLoading={isSubmitting}
                >
                  {isSubmitting
                    ? 'Creating Reservation...'
                    : 'Confirm Reservation'}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
