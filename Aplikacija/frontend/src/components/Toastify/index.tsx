import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toastify = () => {
  return (
    <ToastContainer
      position="top-right"
      theme="dark"
      autoClose={2000}
      limit={3}
      pauseOnHover
    />
  );
};

export default Toastify;
