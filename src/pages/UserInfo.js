import { useContext, useState, useEffect, useRef } from "react";
import { Checkbox } from "@mui/material";
import React from "react";
import { Button, Form, Modal, Row , Col} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import userLayout from "../user/userLayout";
import axiosApiInstance from "../context/interceptor";
import { toast } from "react-toastify";
import axios from "../api/axios"; 
import "bootstrap/dist/css/bootstrap.css";


const InfoUser = () => {
  const [profile, setProfile] = useState({});
  const [load, setLoad] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [updateUser, setUpdateUser] = useState({
    firstname: "",
    lastname: "",
    avatar: "",
  });


  async function getProfile() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/user/profile`
    );  
    setLoad(true);
    setProfile(result?.data?.userInfoModel);
  }

  useEffect(() => {
    getProfile();
  });

  
  const updateProfile = async () => {
    try {
      
      const result = await axiosApiInstance.put(
        axiosApiInstance.defaults.baseURL + `/api/user/profile`,
        updateUser
      );
      if (result?.data?.status === 200) {
        toast.success("Thông tin đã được cập nhật");
        setShowModalUpdate(false);
        getProfile();
      } else toast.error("Cập nhật thất bại!");
    } catch (error) {
      toast.error("Lỗi! Vui lòng thử lại");
    }
  };


  return (
    <>
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Col xs={12} md={4} className="mt-3">
          <h2 className="text-center mb-4">Hồ sơ của tôi</h2>
          <div className="d-flex justify-content-center">
            <img
              src={profile.avatar ? profile.avatar : ""}
              alt="Avatar"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
          </div>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>Họ</Form.Label>
              <Form.Control
                type="text"
                value={profile.firstname ? profile.firstname : ""}
              />
            </Form.Group>
            <div style={{ marginTop: "20px" }} />
            <Form.Group controlId="formLastName">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                value={profile.lastname ? profile.lastname : ""}
              />
            </Form.Group>
            <div style={{ marginTop: "20px" }} />
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={profile?.accountModel?.email} />
            </Form.Group>

            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="primary"
                onClick={() => setShowModalUpdate(true)}
              >
                Chỉnh sửa thông tin
              </Button>

              <div style={{ marginLeft: "200px", marginRight: "20px" }} />
              <Button variant="info" href="/change-password">
                Đổi mật khẩu
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Các trường thông tin người dùng */}
          <Form.Group controlId="formFirstName">
            <Form.Label>Họ và tên đệm</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập họ và tên đệm"
              defaultValue={profile.firstname ? profile.firstname : ""}
              onChange={(e) =>
                setUpdateUser({
                  ...updateUser,
                  firstname: e.target.value,
                })
              }
            />
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên"
              defaultValue={profile.lastname ? profile.lastname : ""}
              onChange={(e) =>
                setUpdateUser({
                  ...updateUser,
                  lastname: e.target.value,
                })
              }
            />
            <Form.Label>Đường dẫn avatar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Avatar"
              defaultValue={profile.avatar ? profile.avatar : ""}
              onChange={(e) =>
                setUpdateUser({
                  ...updateUser,
                  avatar: e.target.value,
                })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalUpdate(false)}>
            Thoát
          </Button>
          <Button variant="primary" onClick={updateProfile}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default userLayout(InfoUser);
