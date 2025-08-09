/* eslint-disable @typescript-eslint/no-unused-vars */
export const teacherLogin = async (email: string, password: string) => {
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;
  try {
    const response = await fetch(`${NEXT_PUBLIC_SEVELLA_API}/teacher/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    // console.log("Login response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("An error occurred during login. Please try again.");
  }
};
