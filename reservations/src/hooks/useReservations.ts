import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Reservation {
  id: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  purpose: string;
  roomId: string | null;
  userId: string | null;
  roomName: string | null;
  roomIcon: string | null;
  userName: string | null;
  userEmail: string | null;
}

export interface CreateReservationData {
  roomId: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  purpose: string;
}

// Hook to fetch all reservations
export function useReservations() {
  return useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await fetch('/api/reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      return response.json();
    },
  });
}

// Hook to fetch a single reservation
export function useReservation(reservationId: string) {
  return useQuery<Reservation>({
    queryKey: ['reservation', reservationId],
    queryFn: async () => {
      const response = await fetch(`/api/reservations/${reservationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservation');
      }
      return response.json();
    },
  });
}

// Hook to create a new reservation
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationData) => {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch reservations after successful creation
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// Export both hooks for convenience
export function useReservationsWithCreate() {
  const reservations = useReservations();
  const createReservation = useCreateReservation();

  return {
    ...reservations,
    createReservation,
  };
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
      data: CreateReservationData;
    }) => {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }

      return response.json();
    },
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
    mutationFn: async (reservationId: string) => {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }
      return response.json();
    },
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

    mutationFn: async (reservationId: string) => {
      const response = await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }
      return response.json();
    },
  });
}
