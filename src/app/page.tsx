"use client";

import { CalendarDashboard } from "@/components/CalendarDashboard/CalendarDashboard";

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
