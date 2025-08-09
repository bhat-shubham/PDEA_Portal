// export const checkAuth = async (): Promise<boolean> => {
//   try {
//     const res = await fetch("http://localhost:3001/teacher/me", {
//       method: "GET",
//       credentials: "include", 
//     });

//     if (res.ok) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false; 
//   }
// };