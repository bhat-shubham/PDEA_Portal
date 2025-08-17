/* eslint-disable @typescript-eslint/no-unused-vars */
export const adminRegister = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  phone: string
) => {
  const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;
  const TEST_API = process.env.TEST_API || "http://localhost:3001";
  // ${TEST_API}/admin/register
  try {
    const response = await fetch(`${TEST_API}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email, password, firstname, lastname, phone }),
    });

    console.log("Admin registration response status:", response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during admin registration:", error);
    throw new Error(
      "An error occurred during admin registration. Please try again."
    );
  }
};
