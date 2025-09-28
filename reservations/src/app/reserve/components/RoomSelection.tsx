import { Card, CardBody, Skeleton } from '@heroui/react';
import { useRooms } from '@hooks/useRooms';
import { useStore, AnyFormApi } from '@tanstack/react-form';
import Image from 'next/image';

export default function RoomSelection({ form }: { form: AnyFormApi }) {
  const roomId = useStore(form.store, (state) => state.values.roomId);
  const { data: rooms = [], isLoading: isLoadingRooms } = useRooms();

  return (
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
          const isSelected = roomId === room.id;

          return (
            <Card
              key={room.id}
              isPressable
              onPress={() => form.setFieldValue('roomId', room.id)}
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
                      Capacity: <b>{room.capacity || 'N/A'}</b>
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
  );
}
