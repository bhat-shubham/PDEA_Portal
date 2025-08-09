/* eslint-disable @typescript-eslint/no-unused-vars */
export const teacherProfile = async () => {
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;

  try {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // https://pdeaportal-4qhff.sevalla.app/teacher/getTeacher
    const response = await fetch(`${NEXT_PUBLIC_SEVELLA_API}/teacher/info`, {
      method: "GET",
      headers: headers,
      credentials: "include", // Includes cookies (e.g., auth session)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch teacher profile");
    }
    const data = await response.json();
    // console.log("Teacher profile data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    throw new Error("An error occurred while fetching the teacher profile.");
  }
};
