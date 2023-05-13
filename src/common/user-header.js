import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import AuthContext from "../context/AuthProvider";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../assets/images/logo.png";
import Form from "react-bootstrap/Form";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import "../assets/css/notification.css"
import { colors } from "@mui/material";
import { toast } from "react-toastify";


const UserHeader = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
   
  const handleChange = (e) => {
    setQuery(e.currentTarget.value);
  };
  const handleBlur = (e) => {
    setOpen(!isOpen);
  };

  const handleMouseEnter = (id) => {
    const updatedNotifications = notification.map((n) =>
      n.id === id ? { ...n, hovered: true } : n
    );
    setNotification(updatedNotifications);
  };

  const handleMouseLeave = (id) => {
    const updatedNotifications = notification.map((n) =>
      n.id === id ? { ...n, hovered: false } : n
    );
    setNotification(updatedNotifications);
  };

  async function handleClickNotifi() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/notification/all`
    );
    if(result?.data?.status === 101)
        {
           setShowNotification(!showNotification);
        }
    else
    {
      setNotification(result?.data?.data);
      setShowNotification(!showNotification);
    }
  }


  const handleNotificationClick = async (id) => {
    const result = await axiosApiInstance.put(
      axiosApiInstance.defaults.baseURL + `/api/notification/update/${id}`
    );
    if(result?.data?.status === 200)
    {
      toast.success("Cảm ơn bạn đã đọc thông báo!");
    }
  }

  useEffect(() => {
    handleClickNotifi();
  }, []);

  return (
    <nav class="navbar header nav-light navbar-expand-lg navbar-light shadow fixed-top">
      <div class="container container-navbar my-nav d-flex justify-content-between align-items-center">
        <div className="nav-header">
          <Link
            class="navbar-brand text-success logo-size h2 align-self-center "
            to="/home"
          >
            <img
              src={logo}
              alt="Logo"
              href="/home"
              className="logo-image"
              style={{ width: "50px", height: "45px", borderRadius: "40%" }}
            />
            FINANCE
          </Link>
          <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#templatemo_main_nav"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div
          class="align-self-center mgt-16 user-header mgd-16 collapse navbar-collapse flex-fill  d-lg-flex justify-content-lg-between"
          id="templatemo_main_nav"
        >
          <div class="flex-fill">
            <ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">
              <li class="nav-item">
                <a class="nav-link" href="/home">
                  Trang chủ
                </a>
              </li>
              <li class="nav-item nav-parent">
                <a class="nav-link" href="/category">
                  Danh mục
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/card">
                  Thẻ
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/goal">
                  Mục tiêu
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/budget">
                  Ngân sách
                </a>
              </li>
              <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                  <a>Giao dịch</a>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/transaction/income">
                    Giao dịch thu nhập
                  </Dropdown.Item>
                  <Dropdown.Item href="/transaction/expense">
                    Giao dịch chi tiêu
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                  <a>Thống kê</a>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/statistical">Giao dịch trong tháng</Dropdown.Item>
                  <Dropdown.Item href="/statistical/card">Giao dịch theo thẻ</Dropdown.Item>
                  <Dropdown.Item href="/statistical/category">Giao dịch theo danh mục</Dropdown.Item>
                  <Dropdown.Item href="/statistical/time">Giao dịch theo khoảng thời gian</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <i className="fa fa-fw fa-user text-white mr-3"></i>
              <i className="fa fa-angle-down text-white"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/profile">Thông tin tài khoản</Dropdown.Item>
              <Dropdown.Item href="/change-pass">Đổi mật khẩu</Dropdown.Item>
              <Dropdown.Item onClick={() => logout()}>Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div style={{ marginLeft: "30px" }}>
            <button onClick={handleClickNotifi}>
              <i className="fa fa-bell"></i>
              {!!notification.length && (
                <span className="notification-count">
                  {notification.length}
                </span>
              )}
              {!showNotification && (
                <div className="notification-box">
                  <h4
                    style={{
                      marginTop: "10px",
                      marginBottom: "20px",
                      colors: "red",
                    }}
                  >
                    Thông báo
                  </h4>
                  {notification.length === 0 ? (
                    <p>Không có thông báo mới.</p>
                  ) : (
                    <p>
                      {notification.map((notification) => (
                        <div
                          className="notification-item"
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                          onMouseEnter={() => handleMouseEnter(notification.id)}
                          onMouseLeave={() => handleMouseLeave(notification.id)}
                        >
                          <div key={notification.id}>
                            <p>
                              {notification.content} --- Time:{" "}
                              {new Date(
                                notification.created_at
                              ).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </p>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserHeader;
