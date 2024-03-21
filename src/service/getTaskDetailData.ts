export const getTaskDetailData = async (id: number) => {
  const res = await fetch(`http://localhost:9090/api/task/${id}`, {
    next: {
      tags: ["taskDetail"],
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task data");
  }

  return res.json();
};
