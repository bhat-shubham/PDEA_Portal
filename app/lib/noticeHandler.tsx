const TEST_API = process.env.TEST_API || "http://localhost:3001";

export const noticeHandler = async (path: string, method: string) => {
  const res = await fetch(`${TEST_API}/admin/${path}`, {
    method: `${method}`,
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();
  return data;
};

export const noticeHandlerPost = async (path: string, method: string, data: unknown) => {
  const res = await fetch(`${TEST_API}/admin/${path}`, {
    method: `${method}`,
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
     body: JSON.stringify(data)
  });

  return res.json();
};
