// src/data/mockData.js

export const initialContestants = [
  {
    id: 1,
    name: "علي محمد",
    batch: "دفعة 020",
    badges: {
      starOfCreativity: true,
      medalOfParticipation: true,
      medalOfCreativity: false,
    },
    pointsHistory: [
      { points: 10, reason: "مشاركة فعالة في الجلسة", date: "2025-08-01" },
      { points: 15, reason: "إكمال التحدي الأسبوعي", date: "2025-08-03" },
      { points: 5, reason: "مساعدة زميل", date: "2025-08-08" },
    ],
  },
  {
    id: 2,
    name: "فاطمة الزهراء",
    batch: "دفعة 019",
    badges: {
      starOfCreativity: false,
      medalOfParticipation: true,
      medalOfCreativity: true,
    },
    pointsHistory: [
      { points: 20, reason: "الفوز في مسابقة اليوم", date: "2025-08-02" },
      { points: 10, reason: "تقديم فكرة مبتكرة", date: "2025-08-09" },
    ],
  },
  {
    id: 3,
    name: "خالد عبدالله",
    batch: "دفعة 020",
    badges: {
      starOfCreativity: false,
      medalOfParticipation: false,
      medalOfCreativity: false,
    },
    pointsHistory: [
      { points: 5, reason: "حضور جميع الجلسات", date: "2025-08-05" },
    ],
  },
];
