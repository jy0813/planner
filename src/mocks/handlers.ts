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
        text: "박호영 원장 휴진으로 인한 진료를 보지않음, 김영희 원장이 진료 예정",
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
      {
        id: 2,
        text: "삼철수 실장 휴무",
      },
      {
        id: 3,
        text: "사철수 실장 휴무",
      },
      {
        id: 4,
        text: "오철수 실장 휴무",
      },
      {
        id: 5,
        text: "육철수 실장 휴무",
      },
      {
        id: 6,
        text: "칠철수 실장 휴무",
      },
    ],
  },
  {
    id: 2,
    date: "2024-03-04",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    memo: [],
  },
  {
    id: 3,
    date: "2024-03-05",
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
      {
        id: 2,
        text: "이수현 실장 휴무",
      },
    ],
  },
  {
    id: 4,
    date: "2024-03-06",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    memo: [],
  },
  {
    id: 5,
    date: "2024-03-08",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    memo: [
      {
        id: 0,
        text: "당일 메모 영역, 예약 취소 노쇼 노출 영역 따로임. 예약은 있을 시 파랑색 숫자, 취소랑 노쇼는 있을 시 빨강색 숫자. 숫자 0일 시에는 검정색. 당일 메모 영역 글씨 초과 시, 아래쪽으로 .... 달아줌",
      },
    ],
  },
  {
    id: 30,
    date: "2024-03-29",
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
  http.get("/api/calendar", ({}) => {
    return HttpResponse.json(CalendarData);
  }),
];
