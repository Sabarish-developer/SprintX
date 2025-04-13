import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded; // { username, email, role, ... }
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
