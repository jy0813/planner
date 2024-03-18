export interface ReservationData {
  id: number;
  reservations: Reservation[];
  register: Reservation[];
}

interface Reservation {
  id: number;
  time: string;
  name: string;
  status: string;
  adminMemo: string;
}
