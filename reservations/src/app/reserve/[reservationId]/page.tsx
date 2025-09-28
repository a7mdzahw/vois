'use client';

import { ReservationStatus } from '@contexts/reservation.context';
import { BuildingOfficeIcon, CheckCircleIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';
import {
  addToast,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DatePicker,
  Divider,
  Progress,
  Skeleton,
  Spinner,
  Textarea,
} from '@heroui/react';
import { useReservation, useUpdateReservation } from '@hooks/useReservations';
import { useRooms } from '@hooks/useRooms';
import { CalendarDate, getLocalTimeZone, parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatTime } from '@utils/date';
import { addMinutes } from 'date-fns';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Room {
  id: string;
  name: string;
  icon?: string;
  capacity?: number;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

export default function EditReservationPage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = params?.reservationId as string;

  const { data: rooms = [], isLoading: isLoadingRooms } = useRooms();
  const updateReservation = useUpdateReservation();
  const today = formatDate(new Date());

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log({
    selectedTimeSlot,
  });
  // Find the current reservation
  const { data: currentReservation } = useReservation(reservationId);

  const { data: timeSlots = [], isLoading: isLoadingTimeSlots } = useQuery({
    enabled: !!selectedRoom?.id && !!selectedDate,
    queryKey: ['time-slots', selectedRoom?.id, selectedDate],
    queryFn: () =>
      fetch(`/api/reservations/available?roomId=${selectedRoom!.id}&date=${selectedDate}`).then((res) => res.json()),
  });

  // Load reservation data when component mounts
  useEffect(() => {
    if (currentReservation && rooms.length > 0) {
      const room = rooms.find((r) => r.id === currentReservation.roomId);
      if (room) {
        setSelectedRoom(room);
      }

      const reservationDate = new Date(currentReservation.date);
      setSelectedDate(parseDate(formatDate(reservationDate)));
      setPurpose(currentReservation.purpose);

      // Create a time slot from the reservation date
      setSelectedTimeSlot({
        id: currentReservation.id,
        start: currentReservation.date,
        end: addMinutes(currentReservation.date, 30).toISOString(),
        available: true,
      });

      setIsLoading(false);
    }
  }, [currentReservation, rooms]);

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
      await updateReservation.mutateAsync({
        reservationId,
        data: {
          roomId: selectedRoom.id,
          date: selectedTimeSlot.start,
          status: ReservationStatus.CONFIRMED,
          purpose: purpose,
        },
      });

      addToast({
        title: 'Reservation updated successfully!',
        description: 'Your reservation has been updated successfully.',
        color: 'success',
      });

      router.push('/');
    } catch (error) {
      console.error('Error updating reservation:', error);
      addToast({
        title: 'Failed to update reservation',
        description: 'Please try again.',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedRoom !== null;
      case 1:
        return selectedTimeSlot !== null && selectedDate !== null;
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
        return 'Confirm Changes';
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
        return 'Review your changes and confirm the update';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <PencilIcon className="w-10 h-10 text-red-600" />
            Edit Reservation
          </h1>
          <p className="text-lg text-gray-600">Update your room reservation details</p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <div className="w-full">
              <Progress value={(currentStep + 1) * 33.33} color="danger" className="mb-4" />
              <div className="flex justify-between">
                <div className={`flex flex-col items-center ${currentStep >= 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  <BuildingOfficeIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Choose Room</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
                  <ClockIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Select Time</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
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
                  {isLoadingRooms && (
                    <>
                      <Skeleton className="w-full h-40" />
                      <Skeleton className="w-full h-40" />
                      <Skeleton className="w-full h-40" />
                    </>
                  )}

                  {rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;

                    return (
                      <Card
                        key={room.id}
                        isPressable
                        onPress={() => setSelectedRoom(room)}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        <CardBody className="p-6 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-sm ${isSelected ? 'bg-red-100' : 'bg-gray-100'}`}>
                              <Image
                                width={32}
                                height={32}
                                src={room.icon || ''}
                                alt={room.name}
                                className={`w-8 h-8 ${isSelected ? 'text-red-600' : 'text-gray-600'}`}
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                Capacity: <b>{room.capacity || 'N/A'}</b> People
                              </p>
                            </div>
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
                <div className="grid grid-cols-1 gap-6">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Date</h3>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      minValue={parseDate(today)}
                      variant="bordered"
                      size="lg"
                      classNames={{
                        input: 'text-gray-700',
                        inputWrapper: 'border-gray-300 hover:border-red-400 focus-within:border-red-500',
                      }}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Available Time Slots ( Select New Time Slot )
                    </h3>
                    <div className="h-40 flex flex-col gap-2 overflow-y-auto">
                      {isLoadingTimeSlots && (
                        <>
                          <Skeleton className="w-full h-12 mx-8 my-2 shrink-0" />
                          <Skeleton className="w-full h-12 mx-8 my-2 shrink-0" />
                          <Skeleton className="w-full h-12 mx-8 my-2 shrink-0" />
                        </>
                      )}

                      {timeSlots.map((slot: { id: string; start: string; end: string; available: boolean }) => (
                        <Card
                          key={slot.start}
                          isPressable={slot.available}
                          onPress={() => slot.available && setSelectedTimeSlot(slot)}
                          className={`cursor-pointer transition-all duration-200 h-fit shrink-0 mx-8 my-2 ${
                            !slot.available
                              ? 'opacity-50 cursor-not-allowed'
                              : selectedTimeSlot?.start === slot.start
                                ? 'ring-2 ring-red-500 bg-red-50'
                                : 'hover:shadow-md hover:scale-102'
                          }`}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium">
                                {formatTime(slot.start)} - {formatTime(slot.end)}
                              </span>
                              {!slot.available ? (
                                <Badge placement="top-left" content="Booked" color="danger" size="sm">
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
                {/* Current vs New Reservation Comparison */}
                <div className="bg-gray-50 rounded-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Reservation Changes</h3>

                  {/* Current Reservation */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-sm">
                    <h4 className="font-medium text-blue-800 mb-2">Current Reservation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span className="font-medium">{currentReservation.roomName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(new Date(currentReservation.date))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formatTime(currentReservation.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purpose:</span>
                        <span className="font-medium">{currentReservation.purpose}</span>
                      </div>
                    </div>
                  </div>

                  {/* New Reservation */}
                  <div className="p-4 bg-green-50 rounded-sm">
                    <h4 className="font-medium text-green-800 mb-2">Updated Reservation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span className="font-medium">{selectedRoom?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {selectedDate ? formatDate(selectedDate.toDate(getLocalTimeZone())) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {selectedTimeSlot
                            ? `${formatTime(selectedTimeSlot.start)} - ${formatTime(selectedTimeSlot.end)}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purpose:</span>
                        <span className="font-medium">{purpose}</span>
                      </div>
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
                    onChange={(e) => setPurpose(e.target.value)}
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
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button onPress={handlePrevious} isDisabled={currentStep === 0} variant="ghost" className="text-gray-600">
                Previous
              </Button>

              {currentStep < 2 ? (
                <Button onPress={handleNext} isDisabled={!canProceed()} color="danger" className="px-8">
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
                  {isSubmitting ? 'Updating Reservation...' : 'Update Reservation'}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
