/* eslint-disable @typescript-eslint/no-unused-vars */
export const adminHandler = async (path: string, method: string) => {
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;

  try {
    const response = await fetch(`${TEST_API}/${path}`, {
      method: `${method}`,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin profile");
    }
    const data = await response.json();
    console.log("Teacher profile data:", data);
    // console.log("Teacher profile data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    throw new Error("An error occurred while fetching the teacher profile.");
  }
};
