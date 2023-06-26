import axios from "../api/axios";
import { ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const axiosApiInstance = axios.create({});

axiosApiInstance.interceptors.request.use((config) => {
    let tokensData = JSON.parse(localStorage.getItem("tokens"));
    if(tokensData === null)
    {
        localStorage.clear();
        toast.info("Vui lòng đăng nhập để tiếp tục!", { autoClose: 5000 });
        window.location.href = "/login";
    }
    config.headers = {
      Authorization: `Bearer ${tokensData.data.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    return config;
});


export default axiosApiInstance;


