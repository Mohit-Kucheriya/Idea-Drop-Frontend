import api from "@/lib/axios";

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to Register";
    throw new Error(message);
  }
};

export const loginUser = async (credential: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("auth/login", credential);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to Login";
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    await api.post("auth/logout");
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to Logout";
    throw new Error(message);
  }
};

export const refreshAccessToken = async () => {
  try {
    const res = await api.post("auth/refresh");
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Failed to refresh access token";
    throw new Error(message);
  }
};
