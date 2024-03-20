import { http, HttpResponse } from "msw";

const CalendarData = [
  {
    id: 0,
    date: "2024-03-01",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    isClosed: true,
    memo: [
      {
        id: 0,
        text: "삼일절 공휴일 휴무",
      },
    ],
  },
  {
    id: 1,
    date: "2024-03-02",
    reservation: 4,
    canceled: 1,
    noShow: 0,
    isClosed: false,
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
    isClosed: false,
    memo: [],
  },
  {
    id: 3,
    date: "2024-03-05",
    reservation: 5,
    canceled: 2,
    noShow: 1,
    isClosed: false,
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
    isClosed: false,
    memo: [],
  },
  {
    id: 5,
    date: "2024-03-08",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    isClosed: false,
    memo: [
      {
        id: 0,
        text: "당일 메모 영역, 예약 취소 노쇼 노출 영역 따로임. 예약은 있을 시 파랑색 숫자, 취소랑 노쇼는 있을 시 빨강색 숫자. 숫자 0일 시에는 검정색. 당일 메모 영역 글씨 초과 시, 아래쪽으로 .... 달아줌",
      },
    ],
  },
  {
    id: 6,
    date: "2024-03-09",
    reservation: 0,
    canceled: 0,
    noShow: 0,
    isClosed: false,
    memo: [
      {
        id: 0,
        text: "당일 메모 영역, 예약 취소 노쇼 노출 영역 따로임. 예약은 있을 시 파랑색 숫자, 취소랑 노쇼는 있을 시 빨강색 숫자. 숫자 0일 시에는 검정색. 당일 메모 영역 글씨 초과 시, 아래쪽으로 .... 달아줌",
      },
    ],
  },
  {
    id: 7,
    date: "2024-03-12",
    reservation: 3,
    canceled: 2,
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
    id: 30,
    date: "2024-03-29",
    reservation: 2,
    canceled: 0,
    noShow: 1,
    isClosed: false,
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

const reservationData = [
  {
    id: 0,
    reservations: [
      {
        id: 0,
        time: "09:00",
        name: "홍길동",
        status: "RESERVATION",
        adminMemo: "예약 메모",
      },
      {
        id: 1,
        time: "09:30",
        name: "김철수",
        status: "RESERVATION",
        adminMemo: "메가 인플루언서 잘 해줘야함",
      },
      {
        id: 2,
        time: "09:30",
        name: "이철수",
        status: "RESERVATION",
        adminMemo: "메가 인플루언서 잘 해줘야함",
      },
    ],
    registers: [
      {
        id: 0,
        time: "09:30",
        name: "홍길동",
        status: "REGISTER",
        adminMemo: "예약 메모",
      },
      {
        id: 1,
        time: "10:00",
        name: "이철수",
        status: "REGISTER",
        adminMemo: "메가 인플루언서 잘 해줘야함",
      },
      {
        id: 2,
        time: "10:00",
        name: "김철수",
        status: "REGISTER",
        adminMemo: "메가 인플루언서 잘 해줘야함",
      },
    ],
    inspections: [
      {
        id: 0,
        time: "10:00",
        name: "홍길동",
        status: "INSPECTION",
        adminMemo: "예약 메모",
      },
      {
        id: 1,
        time: "10:30",
        name: "김철수",
        status: "INSPECTION",
        adminMemo: "메가 인플루언서 잘 해줘야함",
      },
      {
        id: 2,
        time: "10:30",
        name: "이철수",
        status: "INSPECTION",
        adminMemo: "메가 인플루언서 잘 해줘야함",
      },
    ],
    clinics: [
      {
        id: 0,
        name: "의사1",
        clinics: [
          {
            id: 0,
            time: "10:30",
            name: "홍길동",
            status: "CLIINIC",
            adminMemo: "예약 메모",
          },
          {
            id: 1,
            time: "11:00",
            name: "김철수",
            status: "CLIINIC",
            adminMemo: "메가 인플루언서 잘 해줘야함",
          },
        ],
      },
      {
        id: 1,
        name: "의사2",
        clinics: [
          {
            id: 2,
            time: "11:30",
            name: "이철수",
            status: "CLIINIC",
            adminMemo: "메가 인플루언서 잘 해줘야함",
          },
        ],
      },
    ],
    treatments: [
      {
        id: 0,
        name: "원적외선",
        tretments: [
          {
            id: 0,
            time: "11:00",
            name: "홍길동",
            status: "TREATMENT",
            adminMemo: "예약 메모",
          },
        ],
      },
      {
        id: 1,
        name: "온열",
        treatments: [
          {
            id: 1,
            time: "11:30",
            name: "김철수",
            status: "TREATMENT",
            adminMemo: "메가 인플루언서 잘 해줘야함",
          },
        ],
      },
      {
        id: 2,
        name: "VIP 1",
        treatments: [
          {
            id: 2,
            time: "12:00",
            name: "이철수",
            status: "TREATMENT",
            adminMemo: "메가 인플루언서 잘 해줘야함",
          },
        ],
      },
      {
        id: 3,
        name: "VIP 2",
        treatments: [],
      },
      {
        id: 4,
        name: "VIP 3",
        treatments: [],
      },
      {
        id: 5,
        name: "VIP 4",
        treatments: [],
      },
    ],
  },
];

const taskData = [
  {
    id: 0,
    name: "예약",
    subTask: [],
  },
  {
    id: 1,
    name: "접수",
    subTask: [],
  },
  {
    id: 2,
    name: "검사",
    subTask: [],
  },
  {
    id: 3,
    name: "진료",
    subTask: [
      {
        id: 0,
        name: "의사1",
      },
      {
        id: 1,
        name: "의사1",
      },
    ],
  },
  {
    id: 4,
    name: "치료",
    subTask: [
      {
        id: 0,
        name: "원적외선",
      },
      {
        id: 1,
        name: "온열",
      },
      {
        id: 2,
        name: "VIP 1",
      },
      {
        id: 3,
        name: "VIP 2",
      },
      {
        id: 4,
        name: "VIP 3",
      },
      {
        id: 5,
        name: "VIP 4",
      },
    ],
  },
];

const clinicBusinessTimeData = {
  businessStartTime: "09:00",
  businessEndTime: "21:00",
};

const clinicScheduleData = [
  {
    workDate: "2024-03-01",
    isClosed: true,
    memo: "삼일절 공휴일 휴무",
  },
  {
    workDate: "2024-03-20",
    isClosed: true,
    memo: "그냥 휴무",
  },
];

export const handlers = [
  http.get("/api/calendar", ({}) => {
    return HttpResponse.json(CalendarData);
  }),
  http.get("/api/reservation", ({}) => {
    return HttpResponse.json(reservationData);
  }),
  http.get("/api/task", ({}) => {
    return HttpResponse.json(taskData);
  }),
  http.get("/api/schedule", ({}) => {
    return HttpResponse.json(clinicScheduleData);
  }),
  http.get("/api/business", ({}) => {
    return HttpResponse.json(clinicBusinessTimeData);
  }),
];
