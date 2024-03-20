export async function getTaskData() {
  const res = await fetch(`http://localhost:9090/api/task`, {
    next: {
      tags: ["task"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task data");
  }

  return res.json();
}
