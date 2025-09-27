import { RoomService } from '@services/room.service';
import { trial } from '@utils/http';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/rooms - Get all rooms
export async function GET(request: NextRequest) {
  return trial(request, async () => {
    const roomService = new RoomService();
    return NextResponse.json(await roomService.getAllRooms());
  });
}
