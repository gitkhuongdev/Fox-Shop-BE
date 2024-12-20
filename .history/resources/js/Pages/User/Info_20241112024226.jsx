import React, { useEffect, useState } from "react";
import axios from "axios";

function Info() {
    const [user, setUser] = useState({ name: "", phone: "", avatar: "" });
    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: "", phone: "", avatar: null });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setUpdatedUser(parsedUser);
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
            const formData = new FormData();
            formData.append("name", updatedUser.name);
            formData.append("phone", updatedUser.phone);
            if (updatedUser.avatar instanceof File) {
                formData.append("avatar", updatedUser.avatar);
            }

            const response = await axios.put(
                "/api/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUser(response.data);
            setEditMode(false);
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            console.error("Update failed:", error.response?.data || error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        setUpdatedUser((prevUser) => ({ ...prevUser, avatar: e.target.files[0] }));
    };

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>Phone: {user.phone}</p>
            {user.avatar && (
                <img
                    src={`/${user.avatar}`}
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
                        type="file"
                        name="avatar"
                        onChange={handleAvatarChange}
                        placeholder="Avatar"
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
