/* eslint-disable @typescript-eslint/no-unused-vars */
export const teacherLogout = async () => {
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;

  try {
    const response = await fetch(`${TEST_API}/teacher/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Includes cookies (e.g., auth session)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Logout failed:", errorData);
      throw new Error(errorData.message || "Logout failed");
    }

    console.log("Logout successful");
    return { message: "Logout successful" };
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout. Please try again.");
  }
};
