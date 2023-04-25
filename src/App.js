import "font-awesome/css/font-awesome.min.css";
import "./assets/css/app.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import { AuthContextProvider } from "./context/AuthProvider";
import NotFoundPage from "./NotFoundPage";
import jwt_decode from "jwt-decode";
import ProfilePage from "./pages/profile/ProfilePage";
import UserInfo from "./pages/UserInfo";
import CardPage from "./pages/CardPage";
import ForgotPassword from "./pages/ForgotPassword";
import CategoryPage from "./pages/CategoryPage";
import DashBoard from "./pages/DashBoard";
import CustomerPage from "./pages/CustomerPage";
import GoalPage from "./pages/GoalPage";
import IncomeTransactionPage from "./pages/IncomeTransactionPage";
import ExpenseTransactionPage from "./pages/ExpenseTransactionPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const permission = tokens
    ? jwt_decode(tokens?.data?.accessToken)?.authorities
    : null;
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        {permission === "ADMIN" ? (
          <>
            <Route path="/home" element={<DashBoard />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        ) : (
          <>
            <Route path="/forgot-pass" element={<ForgotPassword />} />
            <Route
              path="/change-pass/verify-code=:code"
              element={<ChangePasswordPage />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/goal" element={<GoalPage />} />
            <Route
              path="/transaction/income"
              element={<IncomeTransactionPage />}
            />
            <Route
              path="/transaction/expense"
              element={<ExpenseTransactionPage />}
            />
            <Route path="/card" element={<CardPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/profile" element={<UserInfo />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} key="not-found" />
            <Route />
          </>
        )}
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
