const prefix = "http://localhost:8080/backend/api/v1/platform";

export const sendOtp = async () => {
  return await fetch(`${prefix}/otp/create`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "tusharepc205@gmail.com" }),
    method: "POST",
    mode: "cors",
  });
};

export const verifyOtp = async (otp: string) => {
  return await fetch(`${prefix}/otp/verify`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "tusharepc205@gmail.com", otp }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
};

export const getUser = async () => {
  const response = await fetch(`${prefix}/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'TCookie': document.cookie,
    },
    mode: "cors",
  });
  console.log(document.cookie);
  console.log("USER RESPONSE >>>>>>>>>", response);
};
