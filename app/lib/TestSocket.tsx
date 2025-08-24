// import { useEffect } from "react";
import io from "socket.io-client";

// export default function TestSocket() {
//   useEffect(() => {
//     const socket = io("http://localhost:3001", {
//       withCredentials: true, // send cookies (for JWT)
//     });

//     socket.on("connect", () => {
//       console.log("Connected to server:", socket.id);
//     });

//     // socket.on("newNotice", (notice) => {
//     //   console.log("New notice received:", notice);
//     //   alert(`New Notice: ${notice.title}`);
//     // });

//     return () => socket.disconnect();
//   }, []);

//   return <h2>Listening for real-time events...</h2>;
// }

export const TestSocket = () => {
  const socket = io("http://localhost:3001", {
    withCredentials: true, // send cookies (for JWT)
  });

  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });

  // socket.on("newNotice", (notice) => {
  //   console.log("New notice received:", notice);
  //   alert(`New Notice: ${notice.title}`);
  // });

  return socket;
};
