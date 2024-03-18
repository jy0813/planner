export async function getClinicInfoData() {
  const res = await fetch(`http://localhost:9090/api/clinicInfo`, {
    next: {
      tags: ["clinicInfo"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calendar data");
  }

  return res.json();
}
