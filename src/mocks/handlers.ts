import { http, HttpResponse } from "msw";

const CalendarData = [
  {
    id: 0,
    date: "2024-03-01",
    reservation: 3,
    canceled: 0,
    noShow: 1,
    memo: [
      {
        id: 0,
        text: "박호영 원장 휴진",
      },
      {
        id: 1,
        text: "박진희 실장 휴무",
      },
    ],
  },
  {
    id: 1,
    date: "2024-03-02",
    reservation: 4,
    canceled: 1,
    noShow: 0,
    memo: [
      {
        id: 0,
        text: "김영희 원장 휴진",
      },
      {
        id: 1,
        text: "이철수 실장 휴무",
      },
    ],
  },
  {
    id: 2,
    date: "2024-03-03",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    memo: [],
  },
  {
    id: 3,
    date: "2024-03-04",
    reservation: 5,
    canceled: 2,
    noShow: 1,
    memo: [
      {
        id: 0,
        text: "이민호 원장 휴진",
      },
      {
        id: 1,
        text: "김수현 실장 휴무",
      },
    ],
  },
  {
    id: 4,
    date: "2024-03-05",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    memo: [],
  },
  {
    id: 30,
    date: "2024-03-31",
    reservation: 2,
    canceled: 0,
    noShow: 1,
    memo: [
      {
        id: 0,
        text: "최준호 원장 휴진",
      },
      {
        id: 1,
        text: "박지성 실장 휴무",
      },
    ],
  },
];

export const handlers = [
  http.get("/api/calendar", ({ request }) => {
    return HttpResponse.json(CalendarData);
  }),
];
