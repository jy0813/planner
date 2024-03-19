import { time } from "console";
import { id } from "date-fns/locale";

export interface ReservationData {
  id: number;
  reservations: Reservation[];
  registers: Reservation[];
  inspections: Reservation[];
  clinics: Clinics[];
  treatments: Treatments[];
}

interface Reservation {
  id: number;
  time: string;
  name: string;
  status: string;
  adminMemo: string;
}

interface Clinics {
  id: number;
  name: string;
  clinics: Reservation[];
}

interface Treatments {
  id: number;
  name: string;
  treatments: Reservation[];
}
