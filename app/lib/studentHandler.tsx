/* eslint-disable @typescript-eslint/no-unused-vars */
export const studentHandler = async (
  path: string,
  method: string,
  studentdata?: Record<string, unknown>
) => {
  const TEST_API = process.env.TEST_API || "http://localhost:3001";

  try {
    const response = await fetch(`${TEST_API}/student/${path}`, {
      method: `${method}`,
      headers: {
        "content-type": "application/json",
      },
      //   credentials: "include",
      body: studentdata ? JSON.stringify(studentdata) : null,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching  student login:", error);
    throw new Error("An error occurred while  student login .");
  }
};
