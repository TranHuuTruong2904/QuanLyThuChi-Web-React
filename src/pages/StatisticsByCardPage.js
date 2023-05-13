import React, { useEffect, useState, useRef } from "react";
import userLayout from "../user/userLayout";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import { toast } from "react-toastify";
import { ListGroup } from "react-bootstrap";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import ReactDatePicker from "react-datepicker";

const StatisticalByCardPage = () => {

    const [load, setLoad] = useState(false);
    const [listCard, setListCard] = useState([]);
    const [listTransaction, setListTransaction] = useState([]);
    const [listTempTransaction, setListTempTransaction] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardName, setSelectedCardName] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("")
    const [selectedToDate, setSelectedToDate] = useState("");
    const [sortOrder, setSortOrder] = useState("all");
    const [totalIncomeByCard, setTotalIncomeByCard] = useState(0);
    const [totalExpenseByCard, setTotalExpenseByCard] = useState(0);
    const componentPDF = useRef();

    async function getListCard() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/card/all`
    );
    setLoad(true);
    if(result?.data.length === 0)
    {
      toast.error("Chưa có thẻ. Hãy thêm thẻ để quản lý chi tiêu của bạn!");
    }
    else
    {
      setListCard(result?.data);
    }
  }

  async function getListTransactionByCard(idCard, fromDate, toDate) {
    const result = await axiosApiInstance.get(
        axiosApiInstance.defaults.baseURL + `/api/transaction/all/card/${idCard}/${fromDate}/${toDate}`
    );
    if(result?.data?.status === 101)
    {
        toast.error(result?.data?.message);
    }
    else if(result?.data?.status === 100)
    {
      toast.error(result?.data?.message);
    }
    else
    {
        setLoad(true);
        setListTransaction(result?.data?.data);
        setListTempTransaction(result?.data?.data)
    }
  }

  async function getTotalIncomeByCard(idCard, fromDate, toDate) {
    const result = await axiosApiInstance.get(
        axiosApiInstance.defaults.baseURL + `/api/transaction/totalincome/card/${idCard}/from/${fromDate}/to/${toDate}`
    );
    if(result?.data?.status === 101)
    {
      setTotalIncomeByCard(0);
    }
    else
    {
      setTotalIncomeByCard(result?.data?.data);
    }
  }

  async function getTotalExpenseByCard(idCard, fromDate, toDate) {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL +
        `/api/transaction/totalexpense/card/${idCard}/from/${fromDate}/to/${toDate}`
    );
    if (result?.data?.status === 101) {
      setTotalExpenseByCard(0);
    } else {
      setTotalExpenseByCard(result?.data?.data);
    }
  }


const generatePDF = useReactToPrint({
  content: () => componentPDF.current,
  documentTitle: "AllTransactionByCard",
  onBeforeGetContent: () => {
    if (listTransaction.length === 0) {
      alert("Không có dữ liệu để in.");
      return { remove: () => {} };
    }
    return componentPDF.current;
  },
  onAfterPrint: () => alert("Dữ liệu đã được lưu dưới dạng PDF"),
});


   useEffect(() => {
     if (listCard.length > 0) {
       setSelectedCard(listCard[0].id);
     }
   }, [listCard]);

      useEffect(() => {
        if (listCard.length > 0) {
          setSelectedCardName(listCard[0].name);
        }
      }, [listCard]);

  useEffect(() => {
    getListCard();
    getListTransactionByCard();
    getTotalIncomeByCard();
    getTotalExpenseByCard();
  }, [])

    return (
      <>
        {load ? (
          <div className="container-fluid mx-auto" style={{ width: "95%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h4>Thống kê giao dịch theo thẻ ngân hàng</h4>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Button
                variant="primary"
                style={{
                  width: "200px",
                  marginRight: "20px",
                }}
                onClick={generatePDF}
              >
                Export PDF
              </Button>
              <div className="filter-icon">
                <i className="fa fa-fw fa-filter text-black"></i>
              </div>
              <Form.Select
                style={{
                  width: "200px",
                  marginRight: "10px",
                }}
                onChange={(event) => {
                  const value = event.target.value;
                  setSortOrder(value);
                  if (value === "all") {
                    setListTempTransaction(listTransaction);
                  } else if (value === "sort") {
                    let sortedList = [...listTransaction];
                    setListTempTransaction(
                      sortedList.sort((a, b) => a.name.localeCompare(b.name))
                    );
                  }
                }}
                value={sortOrder}
              >
                <option value="all">Tất cả</option>
                <option value="sort">Sắp xếp A - Z</option>
              </Form.Select>
              <div className="d-flex" style={{ marginLeft: "auto" }}>
                <Form.Group style={{ marginRight: "20px" }}>
                  <Form.Label>Thẻ</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setSelectedCard(e.target.value);
                      setSelectedCardName(e.target.selectedOptions[0].text); // lấy text của input đã chọn
                    }}
                    as="select"
                    style={{
                      width: "200px",
                    }}
                  >
                    {listCard.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group style={{ marginRight: "20px" }}>
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateFrom"
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const year = selectedDate.getFullYear();
                      const month = ("0" + (selectedDate.getMonth() + 1)).slice(
                        -2
                      );
                      const day = ("0" + selectedDate.getDate()).slice(-2);
                      const formattedDate = `${year}-${month}-${day}`;
                      setSelectedFromDate(formattedDate);
                    }}
                  />
                </Form.Group>

                <Form.Group style={{ marginRight: "10px" }}>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateTo"
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const year = selectedDate.getFullYear();
                      const month = ("0" + (selectedDate.getMonth() + 1)).slice(
                        -2
                      );
                      const day = ("0" + selectedDate.getDate()).slice(-2);
                      const formattedDate = `${year}-${month}-${day}`;
                      setSelectedToDate(formattedDate);
                    }}
                  />
                </Form.Group>

                <Button
                  variant="success"
                  style={{
                    width: "100px",
                    height: "40px",
                    marginTop: "35px",
                  }}
                  onClick={() => {
                    getListTransactionByCard(selectedCard,selectedFromDate, selectedToDate);
                    getTotalIncomeByCard(selectedCard,selectedFromDate, selectedToDate);
                    getTotalExpenseByCard(selectedCard,selectedFromDate, selectedToDate);
                  }}
                >
                  Lọc
                </Button>
              </div>
            </div>
            <div ref={componentPDF}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                <h4>
                  Danh sách giao dịch trong theo thẻ {selectedCardName}
                  {"(Từ "}
                  {new Date(selectedFromDate).toLocaleDateString("en-GB")}
                  {" đến "}
                  {new Date(selectedToDate).toLocaleDateString("en-GB")}
                  {")"}
                </h4>
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
                <Col md={1}>
                  <b style={{ fontWeight: "bold" }}>Thể loại</b>
                </Col>
              </Row>
              <hr />
              <ListGroup>
                {listTempTransaction.map((transaction) => (
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
                        <Col md={1}>
                          <h6>
                            {transaction.type === 1 ? "Thu nhập" : "Chi tiêu"}
                          </h6>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </>
                ))}
              </ListGroup>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <h5 style={{ color: "blue", margin: "20px" }}>
                  Tổng thu nhập: +{" "}
                  {totalIncomeByCard?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h5>
                <h5 style={{ color: "red", margin: "20px" }}>
                  Tổng chi tiêu: -{" "}
                  {totalExpenseByCard?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h5>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading....</p>
        )}
      </>
    );
};

export default userLayout(StatisticalByCardPage);