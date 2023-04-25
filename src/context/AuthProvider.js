import axios from "../api/axios";
import { createContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        if(localStorage.getItem("tokens")) {
            let tokens = JSON.parse(localStorage.getItem("tokens"));
            return tokens.data.userInfoModel.accountModel.username;
        }
        return null;
    });

    const navigate = useNavigate();
    const login = async (payload) => {
        const apiResponse = await axios.post(
            axios.defaults.baseURL + "/api/auth/login",
            payload
        );
        if(apiResponse.data.data.status === true)
        {
            localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
            window.location.href = "/home";
        }
        else
            {
                if(apiResponse.data.data.message.includes("Tài khoản đã bị khóa")) {
                  toast.error("Tài khoản đã bị khóa. Vui lòng liên hệ với chúng tôi!");
                } else if (
                  apiResponse.data.data.message.includes("Tài khoản")
                ) {
                  toast.error(
                    "Sai tên tài khoản hoặc mật khẩu. Vui lòng kiểm tra lại!"
                  );
                } else {
                  toast.error(apiResponse.data.data.message);
                }
            }
    };
    const logout = async () => {
        localStorage.removeItem("tokens");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

