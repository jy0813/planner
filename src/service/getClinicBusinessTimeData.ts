export async function getClinicBusinessTimeDate() {
  const res = await fetch(`http://localhost:9090/api/business`, {
    next: {
      tags: ["business"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch business data");
  }

  return res.json();
}
