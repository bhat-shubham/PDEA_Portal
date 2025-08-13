export const teacherClass = async(method: string, path: string, data?: unknown) => {

    const TEST_API = process.env.TEST_API || "http://localhost:3001";
    // const NEXT_PUBLIC_SEVELLA_API = process.env.NEXT_PUBLIC_SEVELLA_API;
    
    try {
        const response = await fetch(`${TEST_API}/teacher/${path}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Includes cookies (e.g., auth session)
        body: data ? JSON.stringify(data) : null,
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        console.error("Request failed:", errorData);
        throw new Error(errorData.message || "Request failed");
        }
    
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.error("Error during request:", error);
        throw new Error("An error occurred during the request. Please try again.");
    }       

}