'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';

import { CreateReservationDto, Reservation, ReservationStatus } from '@contexts/reservation.context';
import { BuildingOfficeIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { addToast, Button, Card, CardBody, CardHeader, Progress } from '@heroui/react';
import { useCreateReservation, useUpdateReservation } from '@hooks/useReservations';
import { createReservationValidator } from '@validators/reservation.validator';

import ConfirmationStep from './ConfirmationStep';
import RoomSelection from './RoomSelection';
import TimeSelection from './TimeSelection';

export default function ReserveForm({ reservation }: { reservation?: Reservation }) {
  const router = useRouter();

  // Mutations
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();

  // Form
  const handleSubmit = async (data: CreateReservationDto) => {
    if (reservation) {
      await updateReservation.mutateAsync({ reservationId: reservation.id, data });
    } else {
      await createReservation.mutateAsync(data);
    }

    router.push('/');
    addToast({
      title: 'Reservation created successfully!',
      description: 'Your reservation has been created successfully.',
      color: 'success',
    });
  };

  const reservationForm = useForm({
    defaultValues: {
      roomId: reservation?.roomId || '',
      date: reservation?.date || '',
      day: reservation?.date || new Date().toISOString(),
      status: reservation?.status || ReservationStatus.PENDING,
      purpose: reservation?.purpose || '',
    },
    validators: {
      onChange: createReservationValidator,
    },
    onSubmit: ({ value }) => handleSubmit(value),
  });

  // Steps
  const [currentStep, setCurrentStep] = useState(0);

  const canProceed = (values: CreateReservationDto) => {
    switch (currentStep) {
      case 0:
        return createReservationValidator.pick({ roomId: true }).safeParse(values).success;
      case 1:
        return createReservationValidator.pick({ date: true }).safeParse(values).success;
      case 2:
        return createReservationValidator.pick({ purpose: true }).safeParse(values).success;
      default:
        return false;
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            {reservation ? 'Edit Reservation' : 'Reserve a Room'}
          </h1>
          <p className="text-lg text-gray-600">
            {reservation ? 'Edit your reservation details' : 'Book your perfect meeting space in just a few steps'}
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <div className="w-full">
              <Progress value={(currentStep + 1) * 33.3} color="danger" className="mb-4" />
              <div className="flex justify-between">
                <div className={`flex flex-col items-center ${currentStep >= 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  <BuildingOfficeIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Room</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
                  <ClockIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Time</span>
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
            {currentStep === 0 && <RoomSelection form={reservationForm} />}

            {/* Step 2: Time Selection */}
            {currentStep === 1 && <TimeSelection form={reservationForm} />}

            {/* Step 3: Confirmation */}
            {currentStep === 2 && <ConfirmationStep form={reservationForm} />}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button onPress={handlePrevious} isDisabled={currentStep === 0} variant="ghost" className="text-gray-600">
                Previous
              </Button>

              <reservationForm.Subscribe>
                {({ values }) =>
                  currentStep < 2 ? (
                    <Button isDisabled={!canProceed(values)} onPress={handleNext} color="danger" className="px-8">
                      Next
                    </Button>
                  ) : (
                    <Button
                      onPress={reservationForm.handleSubmit}
                      isDisabled={!canProceed(values) || createReservation.isPending}
                      color="danger"
                      className="px-8"
                      isLoading={createReservation.isPending}
                    >
                      {createReservation.isPending ? 'Creating Reservation...' : 'Confirm Reservation'}
                    </Button>
                  )
                }
              </reservationForm.Subscribe>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
