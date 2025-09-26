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
