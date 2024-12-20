import React from "react";
import { ClipLoader } from "react-spinners";
function Loading() {
    return (
        <div className="loading-container">
            <ClipLoader color="#3498db" size={50} />
            <p>Đang tải, vui lòng chờ...</p>
        </div>
    );
}

export default Loading;
