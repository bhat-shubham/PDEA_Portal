/* eslint-disable @typescript-eslint/no-unused-vars */
export const adminLogin = async (email: string, password: string) => {
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  try {
    const response = await fetch(`${TEST_API}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Remove this unless you're using cookies:
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("Admin login response status:", response.status);
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error during admin login:", error);
    throw new Error("An error occurred during admin login. Please try again.");
  }
};
