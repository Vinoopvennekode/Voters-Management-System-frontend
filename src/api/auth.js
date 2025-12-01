// src/api/auth.js
import api from "./axiosInstance";
export const verifyToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
        const res = await api.get('auth/verify-token')

        return res.data.valid === true;
    } catch (error) {
        return false;
    }
};
