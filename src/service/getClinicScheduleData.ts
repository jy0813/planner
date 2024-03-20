export async function getClinicScheduleDate() {
  const res = await fetch(`http://localhost:9090/api/schedule`, {
    next: {
      tags: ["schedule"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch schedule data");
  }

  return res.json();
}
