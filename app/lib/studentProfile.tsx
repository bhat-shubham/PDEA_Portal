/* eslint-disable @typescript-eslint/no-unused-vars */

export const studentProfile = async () => {
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;

  try {
   
    const response = await fetch(`${TEST_API}/student/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student profile");
    }
    const data = await response.json();
    console.log("student profile data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    throw new Error("An error occurred while fetching the student profile.");
  }
};
