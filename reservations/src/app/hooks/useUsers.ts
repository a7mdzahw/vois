import { useQuery } from '@tanstack/react-query';

export interface User {
  id: string;
}

// Hook to fetch all users
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
}

export function useMe() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await fetch('/api/users/me');
      return response.json();
    },
  });
}
