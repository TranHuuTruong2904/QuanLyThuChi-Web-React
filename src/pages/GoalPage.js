import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import { toast } from "react-toastify";
import userLayout from "../user/userLayout";
import { FormGroup, ProgressBar } from "react-bootstrap";
import { Button, Row, Col, Modal, Form } from "react-bootstrap";
import { ListGroup, Container } from "react-bootstrap";
import Loading from "react-loading";
import unidecode from "unidecode";
import ReactDatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/css/goal.css"

 
const GoalPage = () => {
    const [load, setLoad] = useState(false);
    const [listGoal, setListGoal] = useState([]);
    const [listTempGoal, setListTempGoal] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalAddDeposit, setShowModalAddDeposit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [newGoal, setNewGoal] = useState({
      name: "",
      balance: "",
      amount: "",
      deadline: "",
    });

    async function getListGoal()
    {
        const result = await axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL + `/api/goal/all`
        );
        setLoad(true);
        if(result?.data?.data.length === 0)
        {
            toast.error("Bạn chưa có mục tiêu nào. Hãy thêm mục tiêu để cố gắng nhé!");
        }
        else
        {
            setListGoal(result?.data?.data);
            setListTempGoal(result?.data?.data);
        }
    }

    const addNewGoal = async () => {
      try {
        const result = await axiosApiInstance.post(
            axiosApiInstance.defaults.baseURL + `/api/goal/add`, newGoal
        );
        if(result?.data?.message.includes("Mục tiêu đã tồn tại"))
        {
          toast.error(result?.data?.message);
        }
        else if(result?.data?.message.includes("Số tiền bắt đầu mục tiêu không thể lớn hơn hoặc bằng số tiền mục tiêu"))
        {
          toast.error(result?.data?.message);
        }
        else if(result?.data?.message.includes("Ngày mục tiêu phải lớn hơn ngày hiện tại!"))
        {
          toast.error(result?.data?.message);
        }
        else
        {
          setListGoal([...listGoal, result?.data?.data]);
          setListTempGoal([...listGoal, result?.data?.data]);
          toast.success("Thêm mục tiêu thành công!");
          setShowModalAdd(false);
        }
      }
      catch(error)
      {
        toast.error("Lỗi. Vui lòng thử lại!");
      }
    }

    const updateDeposit = async (id) => {
      try{
        const payload = {
          deposit : selectedGoal.deposit,
        };
        const result = await axiosApiInstance.put(
          axiosApiInstance.defaults.baseURL + `/api/goal/update-deposit/${id}`, payload
        );
        if(result?.data?.status === 200)
        {
          toast.success(result?.data?.message);
          getListGoal();
          setShowModalAddDeposit(false);
        }
        }
        catch(error)
        {
          toast.error("Lỗi! Vui lòng thử lại");
        }
    }


    const updateGoal = async (id) => {
      try {
        const payload = {
          name: selectedGoal.name,
          balance: selectedGoal.balance,
          amount: selectedGoal.amount,
          deadline: selectedGoal.deadline,
        };
        console.log(selectedGoal.name);
        console.log(selectedGoal.balance);
        console.log(selectedGoal.amount);
        console.log(selectedGoal.deadline);
        const result = await axiosApiInstance.put(
          axiosApiInstance.defaults.baseURL + `/api/goal/update/${id}`, payload
        );
        if(result?.data?.message.includes("Số tiền bắt đầu mục tiêu không thể lớn hơn hoặc bằng số tiền mục tiêu"))
        {
          toast.error(result?.data?.message);
        }
        else if(result?.data?.message.includes("Ngày mục tiêu phải lớn hơn ngày hiện tại"))
        {
          toast.error(result?.data?.message);
        }
        else{
          toast.success(result?.data?.message);
          getListGoal();
          setShowModalUpdate(false);
        }
      } catch (error) {
        toast.error("Lỗi! Vui lòng thử lại");
      }
    }

    async function deleteGoal(id){
      try{
        const result = await axiosApiInstance.delete(
          axiosApiInstance.defaults.baseURL + `/api/goal/delete/${id}`
        );
        if(result?.data?.status === 200)
        {
          toast.success("Mục tiêu đã được xóa thành công!");
          const newListGoal = listGoal.filter((goal) => goal.id !== id);
          setListGoal(newListGoal);
          setListTempGoal(newListGoal);
          setShowModalDelete(false);
        }
      }
      catch(error)
      {
        toast.error("Lỗi! Vui lòng thử lại");
      }
    }

    useEffect(() => {
        getListGoal();
    }, []);

    const handleSearch = (event) => {
      const searchText = event.target.value;
      setSearchText(searchText);
      if (searchText === "") {
        setListTempGoal(listGoal);
      } else {
        const filteredList = listGoal.filter((goal) => {
          const categoryName = unidecode(goal.name).toLowerCase();
          const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
          return categoryName.includes(searchTextNoDiacritics);
        });
        setListTempGoal(filteredList);
      }
    };

    return (
      <>
        {load ? (
          <div className="container-fluid mx-auto" style={{ width: "95%" }}>
            <Form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h4>Danh sách mục tiêu</h4>
              </div>
              <div className="d-flex align-items-center mb-3">
                <Form.Control
                  style={{
                    width: "200px",
                    marginRight: "auto",
                  }}
                  type="text"
                  placeholder="Tìm kiếm mục tiêu"
                  value={searchText}
                  onChange={handleSearch}
                />
                <Button
                  variant="primary"
                  style={{
                    width: "150px",
                    marginLeft: "auto",
                  }}
                  onClick={() => {
                    setShowModalAdd(true);
                  }}
                >
                  Thêm mục tiêu
                </Button>
              </div>
              <div style={{ marginBottom: "1em" }}></div>
              <Row>
                <Col md={3}>
                  <b style={{ fontWeight: "bold" }}>Tên</b>
                </Col>
                <Col md={1}>
                  <b style={{ fontWeight: "bold" }}>Khởi đầu</b>
                </Col>
                <Col md={2}>
                  <b style={{ fontWeight: "bold" }}>Mục tiêu</b>
                </Col>
                <Col md={3}>
                  <b style={{ fontWeight: "bold" }}>Theo dõi</b>
                </Col>
                <Col md={1}>
                  <b style={{ fontWeight: "bold" }}>Đến hạn</b>
                </Col>
              </Row>
              <hr />
              <ListGroup>
                {listTempGoal.map((goal) => (
                  <>
                    <ListGroup.Item key={goal.id}>
                      <Row>
                        <Col md={3} xs={2}>
                          <h6>{goal.name}</h6>
                        </Col>
                        <Col md={1}>
                          <h6>
                            {goal.balance?.toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </h6>
                        </Col>
                        <Col md={2}>
                          <h6>
                            {goal.amount?.toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </h6>
                        </Col>
                        <Col md={3}>
                          <h6>
                            <ProgressBar
                              now={
                                ((goal.balance + goal.deposit) / goal.amount) *
                                100
                              }
                            />
                            <div className="progress-label">
                              <h6>
                                {(goal.balance + goal.deposit)?.toLocaleString(
                                  "vi",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                                {"("}
                                {(
                                  ((goal.balance + goal.deposit) /
                                    goal.amount) *
                                  100
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                %{")"}
                              </h6>
                              <h6>
                                {(
                                  goal.amount -
                                  (goal.balance + goal.deposit)
                                )?.toLocaleString("vi", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </h6>
                            </div>
                          </h6>
                        </Col>
                        <Col md={1}>
                          <h6>
                            {new Date(goal.deadline).toLocaleDateString(
                              "en-GB"
                            )}
                          </h6>
                        </Col>

                        <Col md={2} className="d-flex justify-content-end">
                          {goal.status === 2 ? (
                            <h6
                              className="align-self-center"
                              style={{ marginRight: "30px" }}
                            >
                              Done
                            </h6>
                          ) : goal.status === 3 ? (
                            <h6
                              className="text-danger"
                              style={{ marginRight: "20px" }}
                            >
                              Quá hạn
                            </h6>
                          ) : (
                            <Button
                              variant="success"
                              style={{ marginRight: "10px" }}
                              onClick={() => {
                                setSelectedGoal(goal);
                                setShowModalAddDeposit(true);
                              }}
                            >
                              Thêm$$
                            </Button>
                          )}
                          <Button
                            variant="warning"
                            style={{ marginRight: "10px" }}
                            onClick={() => {
                              setSelectedGoal(goal);
                              setShowModalUpdate(true);
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              setShowModalDelete(true);
                              setSelectedGoalId(goal.id);
                            }}
                          >
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </>
                ))}
              </ListGroup>
            </Form>
          </div>
        ) : (
          <p>Loading....</p>
        )}

        <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm mục tiêu mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCGoalName">
                <Form.Label>Tên mục tiêu</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formBalance">
                <Form.Label>Số tiền khởi đầu</Form.Label>
                <Form.Control
                  type="number"
                  name="balance"
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      balance: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>Số tiền mục tiêu</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      amount: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDeadline">
                <Form.Label>Thời hạn của mục tiêu</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const year = selectedDate.getFullYear();
                    const month = ("0" + (selectedDate.getMonth() + 1)).slice(
                      -2
                    );
                    const day = ("0" + selectedDate.getDate()).slice(-2);
                    const formattedDate = `${year}-${month}-${day}`;
                    setNewGoal({
                      ...newGoal,
                      deadline: formattedDate,
                    });
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
              Thoát
            </Button>
            <Button variant="primary" onClick={addNewGoal}>
              Thêm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa mục tiêu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedGoal ? (
              <form>
                <div className="form-group">
                  <Form.Label>Tên mục tiêu</Form.Label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedGoal.name}
                    onChange={(e) =>
                      setSelectedGoal({
                        ...selectedGoal,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <Form.Label>Số tiền khởi đầu</Form.Label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedGoal.balance}
                    onChange={(e) =>
                      setSelectedGoal({
                        ...selectedGoal,
                        balance: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <Form.Label>Số tiền mục tiêu</Form.Label>
                  <input
                    type="number"
                    name="amount"
                    value={selectedGoal.amount}
                    onChange={(e) =>
                      setSelectedGoal({
                        ...selectedGoal,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <Form.Label>Đến hạn</Form.Label>
                  <input
                    type="date"
                    name="number"
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const year = selectedDate.getFullYear();
                      const month = ("0" + (selectedDate.getMonth() + 1)).slice(
                        -2
                      );
                      const day = ("0" + selectedDate.getDate()).slice(-2);
                      const formattedDate = `${year}-${month}-${day}`;
                      console.log(formattedDate);
                      setSelectedGoal({
                        ...selectedGoal,
                        deadline: formattedDate,
                      });
                    }}
                  />
                </div>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowModalUpdate(false);
                    }}
                  >
                    Thoát
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => updateGoal(selectedGoal.id)}
                  >
                    Sửa
                  </Button>
                </Modal.Footer>
              </form>
            ) : (
              <p>Loading...</p>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={showModalAddDeposit}
          onHide={() => setShowModalAddDeposit(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Thêm tiền cho mục tiêu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAddDeposit">
                <Form.Label>Nhập số tiền</Form.Label>
                <Form.Control
                  type="number"
                  name="deposit"
                  onChange={(e) =>
                    setSelectedGoal({
                      ...selectedGoal,
                      deposit: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalAddDeposit(false)}
            >
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => updateDeposit(selectedGoal.id)}
            >
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalDelete}
          onHide={() => setShowModalDelete(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xóa mục tiêu</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa mục tiêu không?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalDelete(false)}
            >
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteGoal(selectedGoalId)}
            >
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
};

export default userLayout(GoalPage);