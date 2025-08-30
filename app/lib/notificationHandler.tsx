const TEST_API = process.env.TEST_API || "http://localhost:3001";

export const notificationHandler = async (path: string, method: string) => {
  try {
    const res = await fetch(`${TEST_API}/teacher/${path}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
