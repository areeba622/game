import { useEffect, useRef } from 'react';
import { drawRoom, ROOM_W, ROOM_H } from './scenes.js';

// Pixel picture of one challenge room, keyed by challenge id (L, R, W, G, M).
export default function RoomArt({ id }) {
  const ref = useRef(null);
  useEffect(() => {
    drawRoom(ref.current.getContext('2d'), id);
  }, [id]);
  return <canvas ref={ref} className="pi-room" width={ROOM_W} height={ROOM_H} aria-hidden="true" />;
}
