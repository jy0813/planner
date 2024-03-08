export interface Memo {
  id: number;
  text: string;
}

export interface CalendarData {
  id: number;
  date: string;
  reservation: number;
  canceled: number;
  noShow: number;
  memo: Memo[];
}
