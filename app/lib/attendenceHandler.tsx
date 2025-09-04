const TEST_API = process.env.TEST_API || "http://localhost:3001";
export const attendenceHandler = async (
  path: string,
  method: string,
  data?: unknown
) => {
  const res = await fetch(`${TEST_API}/teacher/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify({ records: data }) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  return res.json();
};
