import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@utils/http';
import {
  CreateReservationDto,
  Reservation,
} from '@contexts/reservation.context';

// Hook to fetch all reservations
export function useReservations() {
  return useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: () =>
      client('/api/reservations', {
        errorMessage: 'Failed to fetch reservations',
      }),
  });
}

// Hook to fetch a single reservation
export function useReservation(reservationId: string) {
  return useQuery<Reservation>({
    queryKey: ['reservation', reservationId],
    queryFn: () =>
      client(`/api/reservations/${reservationId}`, {
        errorMessage: 'Failed to fetch reservation',
      }),
  });
}

// Hook to create a new reservation
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationDto) =>
      client('/api/reservations', {
        method: 'POST',
        errorMessage: 'Failed to create reservation',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      // Invalidate and refetch reservations after successful creation
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// Hook to update a reservation
export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: CreateReservationDto;
    }) =>
      client(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        errorMessage: 'Failed to update reservation',
      }),
    onSuccess: () => {
      // Invalidate and refetch reservations after successful update
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// Hook to delete a reservation
export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) =>
      client(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        errorMessage: 'Failed to delete reservation',
      }),
    onSuccess: () => {
      // Invalidate and refetch reservations after successful deletion
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// Hook to cancel a reservation
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },

    mutationFn: async (reservationId: string) =>
      client('/api/reservations/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId }),
        errorMessage: 'Failed to cancel reservation',
      }),
  });
}
