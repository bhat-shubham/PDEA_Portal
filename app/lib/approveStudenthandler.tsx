const TEST_API = process.env.TEST_API || "http://localhost:3001";

export const approveStudentHandler = async (
  path: string,
  method: string,
  studentData?: unknown
) => {
  try {
    const res = await fetch(`${TEST_API}/teacher/${path}`, {
      method,
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: studentData ? JSON.stringify(studentData) : null,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
