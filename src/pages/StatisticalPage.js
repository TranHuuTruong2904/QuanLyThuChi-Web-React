import React, { useEffect, useState, useRef } from "react";
import userLayout from "../user/userLayout";
import axios from "../api/axios";
import unidecode from "unidecode";
import axiosApiInstance from "../context/interceptor";
import { toast } from "react-toastify";
import { ListGroup } from "react-bootstrap";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

const StatisticalPage = () => {
    
    const [load, setLoad] = useState(false);
    const [listTransactionInMonth, setListTransactionInMonth] = useState([]);
    const [listTempTransaction, setListTempTransaction] = useState([]);
    const [sortOrder, setSortOrder] = useState("all");
    const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);
    const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);
    const componentPDF = useRef();
    
    async function getListTransactionInMonth() {
        const result = await axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL + `/api/transaction/allincurrentmonth`
        );
        if(result?.data?.status === 101)
        {
            toast.error(result?.data?.message);
        }
        else
        {
            setLoad(true);
            setListTransactionInMonth(result?.data?.data);
            setListTempTransaction(result?.data?.data);
        }
    }

    async function getTotalIncomeMonth() {
      const result = await axiosApiInstance.get(
        axiosApiInstance.defaults.baseURL +
          `/api/transaction/totalincome/currentmonth`
      );
      if (result?.data?.status === 101) {
        setTotalIncomeMonth(0);
      } else {
        setTotalIncomeMonth(result?.data?.data);
      }
    }

    async function getTotalExpenseMonth() {
      const result = await axiosApiInstance.get(
        axiosApiInstance.defaults.baseURL +
          `/api/transaction/totalexpense/currentmonth`
      );
      if (result?.data?.status === 101) {
        setTotalExpenseMonth(0);
      } else {
        setTotalExpenseMonth(result?.data?.data);
      }
    }

    const generatePDF = useReactToPrint({
      content: () => componentPDF.current,
      documentTitle: "AllTransactionInMonth",
      onBeforeGetContent: () => {
        if (listTempTransaction.length === 0) {
          alert("Không có dữ liệu để in.");
          return null;
        }
        return componentPDF.current;
      },
      onAfterPrint: () => alert("Dữ liệu đã được lưu dưới dạng PDF"),
    });

    useEffect(() => {
        getListTransactionInMonth();
        getTotalIncomeMonth();
        getTotalExpenseMonth();
    }, []);

    const getCurrentMonth = new Date().getMonth() + 1;
    const getCurrentYear = new Date().getFullYear();

    return (
      <>
        {load ? (
          <div className="container-fluid mx-auto" style={{ width: "95%" }}>
            <div className="d-flex align-items-center mb-3">
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
                    setListTempTransaction(listTransactionInMonth);
                  } else if (value === "sort") {
                    let sortedList = [...listTransactionInMonth];
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
                <Button
                  variant="primary"
                  style={{
                    width: "200px",
                    marginLeft: "auto",
                  }}
                  onClick={generatePDF}
                >
                  Export PDF
                </Button>
              </div>
            </div>
            <div ref={componentPDF}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                  fontWeight: "bold"
                }}
              >
                <h3>Danh sách giao dịch trong tháng {getCurrentMonth}{"/"}{getCurrentYear} </h3>
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
                  {totalIncomeMonth?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h5>
                <h5 style={{ color: "red", margin: "20px" }}>
                  Tổng chi tiêu: -{" "}
                  {totalExpenseMonth?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h5>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading......</p>
        )}
      </>
    );
};

export default userLayout(StatisticalPage);