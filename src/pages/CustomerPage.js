import React, {useState,useEffect} from "react";
import axios from "axios";
import { ListGroup, Container } from "react-bootstrap";
import userLayout from "../user/userLayout";
import { Button, Row,Col, Modal, Form } from "react-bootstrap";
import axiosApiInstance from "../context/interceptor";
import unidecode from "unidecode";
import { toast } from "react-toastify";
import adminLayout from "../admin/adminLayout";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const CustomerPage = () =>{
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [tempListUser, setTempListUser] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalOpenUser, setShowModalOpenUser] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    async function getListUser() 
    {
        const result = await axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL + `/api/user/getAll`
        );
        setLoad(true);
        setListUser(result?.data?.data);
        setTempListUser(result?.data?.data);
    }

    useEffect(() => {
        getListUser();
    }, []);


    const handleSearch = (event) => {
      const searchText = event.target.value;
      setSearchText(searchText);
      if (searchText === "") {
        setTempListUser(listUser);
      } else {
        const filteredList = listUser.filter((user) => {
          const username = unidecode(user.accountModel.username).toLowerCase();
          const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
          return username.includes(searchTextNoDiacritics);
        });
        setTempListUser(filteredList);
      }
    };

    const blockAccount = async(id) => {
        try {
          const result = await axiosApiInstance.put(
            axiosApiInstance.defaults.baseURL + `/api/user/delete/${id}`
          );
          if (result?.data?.status === 101) {
            toast.error(result?.data?.message);
            setShowModalDelete(false);
          } else {
            toast.success("Tài khoản đã bị khóa");
            getListUser();
            setShowModalDelete(false);
          }
        } catch (error) {
          toast.error("Lỗi! Vui lòng thử lại");
        }
    }

    const openAccount = async(id) => {
        try {
          const result = await axiosApiInstance.put(
            axiosApiInstance.defaults.baseURL + `/api/user/open/${id}`
          );
          if (result?.data?.status === 101) {
            toast.error(result?.data?.message);
            setShowModalOpenUser(false);
          } else {
            toast.success("Tài khoản đã được mở khóa");
            getListUser();
            setShowModalOpenUser(false);
          }
        } catch (error) {
          toast.error("Lỗi! Vui lòng thử lại");
        }
    }

    return (
      <>
        {load ? (
          <div className="container-fluid mx-auto" style={{ width: "140%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h3>Danh sách người dùng</h3>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Form.Control
                style={{
                  width: "200px",
                  heigh: "10px",
                  marginRight: "auto",
                }}
                type="text"
                placeholder="Tìm kiếm tài khoản"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div style={{ marginBottom: "1em" }}></div>
            <Row>
              <Col md={2}>
                <h5>Username</h5>
              </Col>
              <Col md={3}>
                <h5>Email</h5>
              </Col>
              <Col md={1}>
                <h5>Họ</h5>
              </Col>
              <Col md={2}>
                <h5>Tên</h5>
              </Col>
              <Col md={1}>
                <h5>Role</h5>
              </Col>
              <Col md={2}>
                <h5>Activity</h5>
              </Col>
            </Row>
            <hr />
            <ListGroup>
              {tempListUser.map((user) => (
                <>
                  <ListGroup.Item key={user.id}>
                    <Row>
                      <Col md={2}>{user.accountModel.username}</Col>
                      <Col md={3}>{user.accountModel.email}</Col>
                      <Col md={1}>{user.firstname}</Col>
                      <Col md={2}>{user.lastname}</Col>
                      <Col md={1}>{user.accountModel.roleModel.name}</Col>
                      <Col md={2}>
                        {user.accountModel.activity === true
                          ? "Hoạt động"
                          : "Khóa"}
                      </Col>
                      <Col md={1} className="d-flex justify-content-end">
                        <Button
                          variant="warning"
                          style={{ marginRight: "10px" }}
                          onClick={() => {
                            setSelectedAccountId(user.accountModel.id);
                            setShowModalOpenUser(true);
                          }}
                        >
                          Mở
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedAccountId(user.accountModel.id);
                            setShowModalDelete(true);
                          }}
                        >
                          Khóa
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </>
              ))}
            </ListGroup>
          </div>
        ) : (
          <p>Loading......</p>
        )}

        <Modal
          show={showModalDelete}
          onHide={() => setShowModalDelete(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Khóa tài khoản</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn khóa người dùng này?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalDelete(false)}
            >
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => blockAccount(selectedAccountId)}
            >
              Khóa
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalOpenUser}
          onHide={() => setShowModalOpenUser(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Mở khóa tài khoản</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn mở khóa tài khoản này?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalOpenUser(false)}
            >
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => openAccount(selectedAccountId)}
            >
              Mở khóa
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
};

export default adminLayout(CustomerPage);