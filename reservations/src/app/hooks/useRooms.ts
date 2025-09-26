import { useQuery } from '@tanstack/react-query';

export interface Room {
  id: string;
  name: string;
}

// Hook to fetch all rooms
export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      return response.json();
    },
  });
}
