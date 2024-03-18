export async function getReservationData() {
  const res = await fetch(`http://localhost:9090/api/reservation`, {
    next: {
      tags: ["reservation"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calendar data");
  }

  return res.json();
}
