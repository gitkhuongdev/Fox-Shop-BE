import React, { useEffect, useState } from "react";
import axios from "axios";

function Info() {
    const [user, setUser] = useState({ name: "", phone: "", avatar: "" });
    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: "", phone: "", avatar: "" });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setUpdatedUser(parsedUser);  // Set updatedUser to the current user data
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
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    const handleUpdate = async () => {
        try {
            const response = await axios.put(
                "/api/user/update",
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setUser(response.data);  // Update user state with new data
            setEditMode(false);
            localStorage.setItem("user", JSON.stringify(response.data));  // Update local storage
        } catch (error) {
            console.error("Update failed:", error.response?.data || error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>Phone: {user.phone}</p>
            {user.avatar && (
                <img
                    src={user.avatar}
                    alt="User Avatar"
                />
            )}
            <button onClick={handleLogout}>Logout</button>

            {editMode ? (
                <div>
                    <h2>Update User Information</h2>
                    <input
                        type="text"
                        name="name"
                        value={updatedUser.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={updatedUser.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                    />
                    <input
                        type="text"
                        name="avatar"
                        value={updatedUser.avatar}
                        onChange={handleChange}
                        placeholder="Avatar URL"
                    />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </div>
            ) : (
                <button onClick={() => setEditMode(true)}>Update user</button>
            )}
        </div>
    );
}

export default Info;
