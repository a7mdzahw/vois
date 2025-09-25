'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
  Divider,
} from '@heroui/react';

// Zod validation schema
const reservationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required'),
  phone: z.string().optional(),
  checkIn: z.date().min(new Date(), 'Check-in date must be today or later'),
  checkOut: z.date().min(new Date(), 'Check-out date must be today or later'),
  roomType: z.string().min(1, 'Please select a room type'),
  guests: z.number().min(1, 'At least 1 guest is required'),
  specialRequests: z.string().optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

// rooms for VOIS Office in Egypt (available in the office)
const roomTypes = [
  { key: 'auditorium', label: 'Auditorium' },
  { key: 'meeting-room', label: 'Meeting Room' },
  { key: 'conference-room', label: 'Conference Room' },
  { key: 'relaxing-room', label: 'Relaxing Room' },
];

// number of guests is number input or 1

export default function ReservePage() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      checkIn: new Date(),
      checkOut: new Date(),
      roomType: '',
      guests: 1,
      specialRequests: '',
    } as ReservationForm,
    validators: {
      onChange: reservationSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value);
      // Here you would typically send the data to your API
      alert('Reservation submitted successfully! (This is just a demo)');
    },
  });

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Reserve a Room
          </h1>
          <p className="text-lg text-gray-600">
            Book your perfect stay with us
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <h2 className="text-2xl font-semibold">Reservation Details</h2>
          </CardHeader>
          <CardBody className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Personal Information Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field name="firstName">
                    {(field) => (
                      <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                      />
                    )}
                  </form.Field>
                  <form.Field name="lastName">
                    {(field) => (
                      <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <form.Field name="email">
                    {(field) => (
                      <Input
                        label="Email Address"
                        type="email"
                        endContent={<p className="text-sm text-gray-500">@vodafone.com</p>}
                        placeholder="Enter your email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                      />
                    )}
                  </form.Field>
                  <form.Field name="phone">
                    {(field) => (
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
              </div>

              <Divider />

              {/* Reservation Details Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Reservation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field name="checkIn">
                    {(field) => (
                      <DatePicker
                        label="Check-in Date"
                        // value={field.state.value}
                        // onChange={(e) => field.handleChange(e)}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                        // minValue={new Date().toISOString().split('T')[0] as unknown as DateValue  }
                      />
                    )}
                  </form.Field>
                  <form.Field name="checkOut">
                    {(field) => (
                      <DatePicker
                        label="Check-out Date"
                        // value={field.state.value}
                        // onChange={(e) => field.handleChange(e)}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                        // minValue={new Date().toISOString().split('T')[0] as unknown as DateValue}
                      />
                    )}
                  </form.Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <form.Field name="roomType">
                    {(field) => (
                      <Select
                        label="Room Type"
                        placeholder="Select a room type"
                        selectedKeys={field.state.value ? [field.state.value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          field.handleChange(selectedKey);
                        }}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          trigger: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                          value: "text-gray-700",
                        }}
                      >
                        {roomTypes.map((room) => (
                          <SelectItem key={room.key}>
                            {room.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </form.Field>
                  <form.Field name="guests">
                    {(field) => (
                      <Input
                        type="number"
                        label="Number of Guests"
                        placeholder="Enter number of guests"
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
                        min={1}
                        onBlur={field.handleBlur}
                        isInvalid={field.state.meta.errors.length > 0}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-300 hover:border-red-400 focus-within:border-red-500",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
              </div>

              <Divider />

              {/* Special Requests Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Additional Information
                </h3>
                <form.Field name="specialRequests">
                  {(field) => (
                    <Textarea
                      label="Special Requests"
                      placeholder="Any special requests or notes for your stay?"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      variant="bordered"
                      size="lg"
                      minRows={3}
                      maxRows={6}
                    />
                  )}
                </form.Field>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="px-12 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white"
                  isLoading={form.state.isSubmitting}
                  isDisabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? 'Processing...' : 'Reserve Room'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
