import { useQuery } from '@tanstack/react-query';
import { client } from '@utils/http';
import { Room } from '@contexts/room.context';

// Hook to fetch all rooms
export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () =>
      client('/api/rooms', {
        errorMessage: 'Failed to fetch rooms',
      }),
  });
}
