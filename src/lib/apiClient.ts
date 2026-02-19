import axios from "axios";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        toast.error("Your session has expired. Please log in again.", {
          duration: 5000,
          style: {
            background: "#fee2e2",
            color: "#b91c1c",
            fontWeight: "bold",
          },
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        // Server-side redirect
        redirect("/");
      }
    }

    return Promise.reject(error);
  }
);
