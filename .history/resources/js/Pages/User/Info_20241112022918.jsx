import React, { useEffect, useState } from "react";
import axios from "axios";

function Info() {
    const [user, setUser] = useState({ name: "", email: "", avatar: "" });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                "/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/api/loginform";
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error);
        }
    };

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>
            {user.avatar && (
                <img
                    src={user.avatar}
                    alt="User Avatar"
                />
            )}
            <button onClick={handleLogout}>Logout</button>
            <button>Update user</button>

        </div>
    );
}

export default Info;
