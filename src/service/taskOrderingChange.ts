export const taskOrderingChange = async (
  oldOrder: number,
  newOrder: number
) => {
  const response = await fetch("http://localhost:9090/api/task/order", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldOrder, newOrder }),
    next: {
      tags: ["taskOrder"],
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to change task order");
  }
};
