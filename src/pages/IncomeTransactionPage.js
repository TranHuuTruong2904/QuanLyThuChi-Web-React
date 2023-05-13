import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import unidecode from "unidecode";
import { toast } from "react-toastify";
import userLayout from "../user/userLayout";
import { ListGroup } from "react-bootstrap";
import { Button, Row, Col, Modal, Form, Card, Pagination } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import "../assets/css/transaction.css";

const ExpenseTransactionPage = () => {
  const [load, setLoad] = useState(false);
  const [listTempTransaction, setListTempTransaction] = useState([]);
  const [listTransactionIncome, setListTransactionIncome] = useState([]);
  const [listCard, setListCard] = useState([]);
  const [listCategoryIncome, setListCategoryIncome] = useState([]);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    location: "",
    transactiondate: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const pageCount = Math.ceil(listTempTransaction.length / itemsPerPage);
  // tính phần tử đầu và phần tử cuối của trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = listTempTransaction.slice(indexOfFirstItem, indexOfLastItem);

  // Xử lý khi người dùng chọn trang mới
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [totalDay, setTotalDay] = useState(0);
  const [totalWeek, setTotalWeek] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);

  async function getTotalDay() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/gettotalincometoday`
    );
    if(result?.data?.status === 101)
    {
        setTotalDay(0);
    }
    else{
        setTotalDay(result?.data?.data)
    }
  }

  async function getTotalWeek() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/totalincomebyweek`
    );
    if(result?.data?.status === 101)
    {
        setTotalWeek(0);
    }
    else{
        setTotalWeek(result?.data?.data)
    }
  }

  async function getTotalMonth() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL +
        `/api/transaction/totalincome/currentmonth`
    );
    if (result?.data?.status === 101) {
      setTotalMonth(0);
    } else {
      setTotalMonth(result?.data?.data);
    }
  }

  async function getListTransactionIncome() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/income`
    );
    setLoad(true);
    setListTransactionIncome(result?.data?.data);
    setListTempTransaction(result?.data?.data);
  }

  async function getListCard() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/card/all`
    );
    setLoad(true);
    setListCard(result?.data);
  }

  async function getListCategoryIncome() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/category/income`
    );
    setLoad(true);
    setListCategoryIncome(result?.data);
  }

  async function getTransactionDetail(id) {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/${id}`
    );
    setTransactionDetails(result?.data);
    setShowModalDetail(true);
  }

  const addTransaction = async (idCategory, idCard) => {
    try {
      const result = await axiosApiInstance.post(
        axiosApiInstance.defaults.baseURL +
          `/api/transaction/add/income/${idCategory}/${idCard}`,
        newTransaction
      );
        setListTransactionIncome([
          ...listTransactionIncome,
          result?.data?.data,
        ]);
        setListTempTransaction([...listTransactionIncome, result?.data?.data]);
        toast.success("Thêm giao dịch thành công!");
        setShowModalAdd(false);
        getTotalDay();
        getTotalWeek();
        getTotalMonth();
    } catch (error) {
      toast.error("Lỗi! Vui lòng kiếm tra lại!");
    }
  };

  async function deleteTransaction(id) {
    try {
      const result = await axiosApiInstance.delete(
        axiosApiInstance.defaults.baseURL + `/api/transaction/delete/${id}`
      );
      if (result?.data?.status === 200) {
        toast.success("Giao dịch đã được xóa thành công!");
        const newListTransaction = listTransactionIncome.filter(
          (transaction) => transaction.id !== id
        );
        setListTransactionIncome(newListTransaction);
        setListTempTransaction(newListTransaction);
        setShowModalDelete(false);
        getTotalDay();
        getTotalWeek();
        getTotalMonth();
      }
    } catch (error) {
      toast.error("Lỗi! Vui lòng thử lại");
    }
  }

  const updateTransaction = async(idCategory, idTransaction) => {
    try{
        const payload = {
          name: selectedTransaction.name,
          amount: selectedTransaction.amount,
          location: selectedTransaction.location,
          transactiondate: selectedTransaction.transactiondate,
          description: selectedTransaction.description,
        };
        const result = await axiosApiInstance.put(
            axiosApiInstance.defaults.baseURL + `/api/transaction/update/${idCategory}/${idTransaction}`, payload
        );
        if(result?.data?.status === 200)
        {
            toast.success(result?.data?.message);
            getListTransactionIncome();
            setShowModalUpdate(false);
            getTotalDay();
            getTotalWeek();
            getTotalMonth();
        }
    }
    catch(error)
      {
        toast.error("Lỗi! Vui lòng thử lại");
      }
  }

  const handleSearch = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);
    if (searchText === "") {
      setListTempTransaction(listTransactionIncome);
      setCurrentPage(1);
    } else {
      const filteredList = listTransactionIncome.filter((transaction) => {
        const transactionName = unidecode(transaction.name).toLowerCase();
        const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
        return transactionName.includes(searchTextNoDiacritics);
      });
      setListTempTransaction(filteredList);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    getListTransactionIncome();
    getListCard();
    getListCategoryIncome();
  }, []);

  useEffect(() => {
    if (listCategoryIncome.length > 0) {
      setSelectedCategory(listCategoryIncome[0].id);
    }
  }, [listCategoryIncome]);

  useEffect(() => {
    if (listCard.length > 0) {
      setSelectedCard(listCard[0].id);
    }
  }, [listCard]);

  useEffect(() => {
    getTotalDay();
    getTotalWeek();
    getTotalMonth();
  }, []);

  return (
    <>
      <div
        className="container-fluid mx-auto"
        style={{ width: "55%", marginBottom: "1rem" }}
      >
        <div className="d-flex">
          <Card
            className="bg-info"
            style={{ width: "18rem", marginRight: "3rem" }}
          >
            <Card.Body>
              <Card.Title>Tổng thu nhập trong ngày</Card.Title>
              <Card.Text>
                + {totalDay?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card
            className="bg-info"
            style={{
              width: "18rem",
              marginRight: "3rem",
            }}
          >
            <Card.Body>
              <Card.Title>Tổng thu nhập trong tuần</Card.Title>
              <Card.Text>
                + {totalWeek?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="bg-info" style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Tổng thu nhập trong tháng</Card.Title>
              <Card.Text>
                + {totalMonth?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      {load ? (
        <div className="container-fluid mx-auto" style={{ width: "95%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h4>Danh sách giao dịch thu nhập</h4>
          </div>
          <div className="d-flex align-items-center mb-3">
            <Form.Control
              style={{
                width: "200px",
                marginRight: "auto",
              }}
              type="text"
              placeholder="Tìm kiếm giao dịch"
              value={searchText}
              onChange={handleSearch}
            />
            <div className="d-flex" style={{ marginLeft: "auto" }}>
              <Button
                variant="primary"
                style={{
                  width: "210px",
                  marginLeft: "auto",
                }}
                onClick={() => {
                  setShowModalAdd(true);
                }}
              >
                Thêm giao dịch thu nhập
              </Button>
            </div>
          </div>
          <Row>
            <Col md={3}>
              <b style={{ fontWeight: "bold" }}>Tên GD</b>
            </Col>
            <Col md={2}>
              <b style={{ fontWeight: "bold" }}>Số tiền GD</b>
            </Col>
            <Col md={1}>
              <b style={{ fontWeight: "bold" }}>Ngày GD</b>
            </Col>
            <Col md={3}>
              <b style={{ fontWeight: "bold" }}>Danh mục DG</b>
            </Col>
            <Col md={1}>
              <b style={{ fontWeight: "bold" }}>Thẻ GD</b>
            </Col>
          </Row>
          <hr />
          <ListGroup>
            {currentItems.map((transaction) => (
              <>
                <ListGroup.Item key={transaction.id}>
                  <Row>
                    <Col md={3}>
                      <h6>{transaction.name}</h6>
                    </Col>
                    <Col md={2}>
                      <h6>
                        {transaction.amount?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h6>
                    </Col>
                    <Col md={1}>
                      <h6>
                        {new Date(
                          transaction.transactiondate
                        ).toLocaleDateString("en-GB")}
                      </h6>
                    </Col>
                    <Col md={3}>
                      <h6>{transaction.categoryModel.name}</h6>
                    </Col>
                    <Col md={1}>
                      <h6 style={{ marginLeft: "10px" }}>
                        {transaction.cardModel.name}
                      </h6>
                    </Col>
                    <Col md={2} className="d-flex justify-content-end">
                      <Button
                        variant="success"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          getTransactionDetail(transaction.id);
                        }}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        variant="warning"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowModalUpdate(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setSelectedTransactionId(transaction.id);
                          setShowModalDelete(true);
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
        </div>
      ) : (
        <p>Loading......</p>
      )}

      <Modal show={showModalDetail} onHide={() => setShowModalDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transactionDetails ? (
            <Form>
              <Form.Group controlId="formCardName">
                <Form.Label>Tên GD</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={transactionDetails.name}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCategory">
                <Form.Label>Danh mục GD</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={transactionDetails?.categoryModel?.name}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formCard">
                <Form.Label>Thẻ GD</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={
                    transactionDetails?.cardModel?.name +
                    " - " +
                    transactionDetails?.cardModel?.description +
                    " - SD : " +
                    transactionDetails?.cardModel?.balance?.toLocaleString(
                      "vi",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )
                  }
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>Số tiền GD</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={transactionDetails.amount?.toLocaleString(
                    "vi",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                  readOnly
                />
                {/* `${cardDetails.balance} VND` */}
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>Địa điểm</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={transactionDetails.location}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formDate">
                <Form.Label>Ngày GD</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={new Date(
                    transactionDetails.transactiondate
                  ).toLocaleDateString("en-GB")}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Chi tiết</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={transactionDetails.description}
                  readOnly
                />
              </Form.Group>
            </Form>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDetail(false)}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm giao dịch thu nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Tên giao dịch</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formAmount">
              <Form.Label>Số tiền GD</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Địa điểm</Form.Label>
              <Form.Control
                type="text"
                name="location"
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    location: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Thời gian GD</Form.Label>
              <Form.Control
                type="date"
                name="date"
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const year = selectedDate.getFullYear();
                  const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2);
                  const day = ("0" + selectedDate.getDate()).slice(-2);
                  const formattedDate = `${year}-${month}-${day}`;
                  setNewTransaction({
                    ...newTransaction,
                    transactiondate: formattedDate,
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="formLocation">
              <Form.Label>Chi tiết</Form.Label>
              <Form.Control
                type="text"
                name="description"
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Danh mục DG</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {listCategoryIncome.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCard">
              <Form.Label>Thẻ GD</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedCard(e.target.value)}
              >
                {listCard.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name} - SD:{" "}
                    {card.balance?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
            Thoát
          </Button>
          <Button
            variant="primary"
            onClick={() => addTransaction(selectedCategory, selectedCard)}
          >
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <form>
              <div className="form-group">
                <Form.Label>Tên giao dịch</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedTransaction.name}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <Form.Label>Số tiền GD</Form.Label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedTransaction.amount}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      amount: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <Form.Label>Địa chỉ</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedTransaction.location}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <Form.Label>Thời gian GD</Form.Label>
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
                    setSelectedTransaction({
                      ...selectedTransaction,
                      transactiondate: formattedDate,
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <Form.Label>Chi tiết</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedTransaction.description}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Form.Label>Danh mục DG</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {listCategoryIncome.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
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
                  onClick={() =>
                    updateTransaction(selectedCategory, selectedTransaction.id)
                  }
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
        show={showModalDelete}
        onHide={() => setShowModalDelete(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xóa giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa giao dịch không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
            Thoát
          </Button>
          <Button
            variant="primary"
            onClick={() => deleteTransaction(selectedTransactionId)}
          >
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pagination-container" style={{ marginTop: "1rem" }}>
        <Pagination>
          {currentPage > 1 && (
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
            />
          )}
          {[...Array(pageCount)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          {currentPage < pageCount && (
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
            />
          )}
        </Pagination>
      </div>
    </>
  );
};

export default userLayout(ExpenseTransactionPage);
