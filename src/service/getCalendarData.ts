export async function getCalendarData() {
  const res = await fetch(`http://localhost:9090/api/calendar`, {
    next: {
      tags: ["calendar"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calendar data");
  }

  return res.json();
}
