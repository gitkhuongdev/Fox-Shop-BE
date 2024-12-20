import { ClipLoader } from "react-spinners";

const Loading = () => (
  <div className="loading-container">
    <ClipLoader color="#3498db" size={50} />
    <p>Đang tải, vui lòng chờ...</p>
  </div>
);
