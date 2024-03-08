"use client";

import { CalendarDashboard } from "@/components/CalendarDashboard/CalendarDashboard";
import { getCalendarData } from "@/service/getCalendarData";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  return (
    <main>
      <CalendarDashboard>
        <CalendarDashboard.Header />
        <CalendarDashboard.Days />
        <CalendarDashboard.Body />
      </CalendarDashboard>
    </main>
  );
}
