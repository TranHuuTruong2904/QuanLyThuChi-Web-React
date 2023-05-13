import React, { useEffect, useState } from 'react';
import userLayout from '../user/userLayout';
import { Button, Card, Row, Col, ListGroup} from "react-bootstrap";
import axios from "../api/axios";
import { toast } from "react-toastify";
import axiosApiInstance from "../context/interceptor";
import "../assets/css/home.css"
import "bootstrap/dist/css/bootstrap.css";
import { Chart as chartjs, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import ReactPaginate from 'react-paginate';

chartjs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  BarElement,
  ArcElement,
);

const ITEMS_PER_PAGE = 5;

const HomePage = () => {
  const [load, setLoad] = useState(false);
  const [listIncome, setListIncome] = useState([]);
  const [listExpense, setListExpense] = useState([]);
  const [listCard, setListCard] = useState([]);
  const [cardIds, setCardIds] = useState([]);
  const [cardName, setCardName] = useState([]);
  const [dataCardIncome, setDataCardIncome] = useState([]);
  const [dataCardExpense, setDataCardExpense] = useState([]);
  const [isButton1Selected, setIsButton1Selected] = useState(true);
  const [listCategoryIncome, setListCategoryIncome] = useState([]);
  const [listCategoryExpense, setListCategoryExpense] = useState([]);
  const [categoryIncomeId, setCategoryIncomeId] = useState([]);
  const [categoryExpenseId, setCategoryExpenseId] = useState([]);
  const [categoryIncomeName, setCategoryIncomeName] = useState([]);
  const [categoryExpenseName, setCategoryExpenseName] = useState([]);
  const [categoryIncomeColor, setCategoryIncomeColor] = useState([]);
  const [categoryExpenseColor, setCategoryExpenseColor] = useState([]);
  const [dataCategoryIncome, setDataCategoryIncome] = useState([]);
  const [dataCategoryExpense, setDataCategoryExpense] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);
  const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);
  const [totalIncomePreMonth, setTotalIncomePreMonth] = useState(0);
  const [totalExpensePreMonth, setTotalExpensePreMonth] = useState(0);
  const [dataTotalExpenseMonth, setDataTotalExpenseMonth] = useState([]);
  const [dataTotalIncomeMonth, setDataTotalIncomeMonth] = useState([]);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const pageCountIncome = Math.ceil(listIncome.length / ITEMS_PER_PAGE);
  const pageCountExpense = Math.ceil(listExpense.length / ITEMS_PER_PAGE);

  async function getListIncome() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/allincomeintoday`
    );
    setLoad(true);
    if (result?.data?.data.length === 0) {
      toast.error("Chưa có giao dịch thu nhập trong ngày!");
    } else {
      setListIncome(result?.data?.data);
    }
  }

  async function getListExpense() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/allexpensetoday`
    );
    setLoad(true);
    if (result?.data?.data.length === 0) {
      toast.error("Chưa có giao dịch chi tiêu trong ngày!");
    } else {
      setListExpense(result?.data?.data);
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

  async function getTotalIncomePreMonth() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL +
        `/api/transaction/totalincome/previousmonth`
    );
    if (result?.data?.status === 101) {
      setTotalIncomePreMonth(0);
    } else {
      setTotalIncomePreMonth(result?.data?.data);
    }
  }

  async function getTotalExpensePreMonth() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL +
        `/api/transaction/totalexpense/previousmonth`
    );
    if (result?.data?.status === 101) {
      setTotalExpensePreMonth(0);
    } else {
      setTotalExpensePreMonth(result?.data?.data);
    }
  }

  async function getListCard() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/card/all`
    );
    setLoad(true);
    setListCard(result?.data);
  }

  // lấy danh sách danh mục chi tiêu để vẽ biểu đồ tròn
  async function getListCategoryIncome() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/category/income`
    );
    setLoad(true);
    setListCategoryIncome(result?.data);
  }

  async function getListCategoryExpense() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/category/expense`
    );
    setLoad(true);
    setListCategoryExpense(result?.data);
  }

  const getCurrentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      const promises = [];
      for (let i = 1; i <= 12; i++) {
        promises.push(
          axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL +
              `/api/transaction/totalexpensebymonth/${getCurrentYear}/${i}`
          )
        );
      }
      try {
        const results = await Promise.all(promises);
        const dataTotal = results.map((res) => {
          if (res?.data?.status === 200) {
            return res?.data?.data;
          }
          return 0;
        });
        setLoad(true);
        setDataTotalExpenseMonth(dataTotal);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const promises = [];
      for (let i = 1; i <= 12; i++) {
        promises.push(
          axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL +
              `/api/transaction/totalincomebymonth/${getCurrentYear}/${i}`
          )
        );
      }
      try {
        const results = await Promise.all(promises);
        const dataTotal = results.map((res) => {
          if (res?.data?.status === 200) {
            return res?.data?.data;
          }
          return 0;
        });
        setLoad(true);
        setDataTotalIncomeMonth(dataTotal);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const dataIncome = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: dataTotalIncomeMonth,
        backgroundColor: "transparent",
        borderColor: "blue",
        pointBorderColor: "transparent",
        pointBorderWidth: 4,
        tension: 0.4,
      },
    ],
  };

  const optionsIncome = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return value.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          },
        },
      },

      legend: false,
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          font: {
            weight: "bold",
            size: 15,
          },
        },
      },
      y: {
        min: -2000000,
        max: 10000000,
        ticks: {
          stepSize: 2000000,
          callback: function (value, index, values) {
            return value.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          },
          font: {
            weight: "bold",
            size: 15,
          },
        },
        grid: {
          borderDash: [10],
        },
      },
    },
  };

  const dataExpense = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: dataTotalExpenseMonth,
        backgroundColor: "transparent",
        borderColor: "red",
        pointBorderColor: "transparent",
        pointBorderWidth: 4,
        tension: 0.4,
      },
    ],
  };

  const optionsExpense = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return value.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          },
        },
      },

      legend: false,
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          font: {
            weight: "bold",
            size: 15,
          },
        },
      },
      y: {
        min: -2000000,
        max: 10000000,
        ticks: {
          stepSize: 2000000,
          callback: function (value, index, values) {
            return value.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          },
          font: {
            weight: "bold",
            size: 15,
          },
        },
        grid: {
          borderDash: [10],
        },
      },
    },
  };


  // biểu đồ cột theo thẻ ngân hàng
  const dataTotalCard = {
    labels: cardName,
    datasets: [
      {
        label: "Total income",
        data: dataCardIncome,
        borderColor: "blue",
        borderWidth: 1,
      },
      {
        label: "Total expense",
        data: dataCardExpense,
        borderColor: "red",
        borderWidth: 1,
      },
    ],
  };

  const optionsTotalCard = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return value.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          },
        },
      },

      legend: false,
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          font: {
            weight: "bold",
            size: 16,
          },
        },
      },
      y: {
        min: 0,
        max: 10000000,
        ticks: {
          stepSize: 5000000,
          callback: function (value, index, values) {
            return value.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
          },
          font: {
            weight: "bold",
            size: 15,
          },
        },
        grid: {
          borderDash: [10],
        },
      },
    },
  };

  // biểu đồ tròn theo danh mục chi tiêu
  const categoryIncomeData = {
    labels: categoryIncomeName,
    datasets: [{
      label: 'Tổng tiền',
      data: dataCategoryIncome,
      backgroundColor: categoryIncomeColor,
      borderColor: categoryIncomeColor,
    }]
  }


  const categoryExpenseData = {
    labels: categoryExpenseName,
    datasets: [{
      label: 'Tổng tiền',
      data: dataCategoryExpense,
      backgroundColor: categoryExpenseColor,
      borderColor: categoryExpenseColor,
    }]
  }

  //  tổng tiền thu nhập và chi tiêu theo thẻ
  useEffect(() => {
    const fetchData = async () => {
      const promises = cardIds.map((id) =>
        axiosApiInstance.get(
          axiosApiInstance.defaults.baseURL +
            `/api/transaction/totalincome/card/${id}`
        )
      );
      try {
        const results = await Promise.all(promises);
        const dataTotal = results.map((res) => {
          if (res?.data?.status === 200) {
            return res?.data?.data;
          }
          return 0;
        });
        setLoad(true);
        setDataCardIncome(dataTotal);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cardIds]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = cardIds.map((id) =>
        axiosApiInstance.get(
          axiosApiInstance.defaults.baseURL +
            `/api/transaction/totalexpense/card/${id}`
        )
      );
      try {
        const results = await Promise.all(promises);
        const dataTotal = results.map((res) => {
          if (res?.data?.status === 200) {
            return res?.data?.data;
          }
          return 0;
        });
        setLoad(true);
        setDataCardExpense(dataTotal);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cardIds]);

  // tổng tiền của danh mục chi tiêu và thu nhập

  useEffect(() => {
    const fetchData = async () => {
      const promises = categoryIncomeId.map((id) =>
        axiosApiInstance.get(
          axiosApiInstance.defaults.baseURL +
            `/api/transaction/totalbycategory/${id}`
        )
      );
      try {
        const results = await Promise.all(promises);
        const dataTotal = results.map((res) => {
          if (res?.data?.status === 200) {
            return res?.data?.data;
          }
          return 0;
        });
        setLoad(true);
        setDataCategoryIncome(dataTotal);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [categoryIncomeId]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = categoryExpenseId.map((id) =>
        axiosApiInstance.get(
          axiosApiInstance.defaults.baseURL +
            `/api/transaction/totalbycategory/${id}`
        )
      );
      try {
        const results = await Promise.all(promises);
        const dataTotal = results.map((res) => {
          if (res?.data?.status === 200) {
            return res?.data?.data;
          }
          return 0;
        });
        setLoad(true);
        setDataCategoryExpense(dataTotal);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [categoryExpenseId]);


  useEffect(() => {
    getListIncome();
    getListExpense();
    getListCard();
    getListCategoryExpense();
    getListCategoryIncome();
  }, []);

  // lấy danh sách id thẻ và tên thẻ để vẽ biểu đồ cột
  useEffect(() => {
    setCardIds(listCard.map((card) => card.id));
  }, [listCard]);

  useEffect(() => {
    setCardName(listCard.map((card) => card.name));
  }, [listCard]);

  // lấy danh sách id danh mục để vẽ biểu đồ tròn
  useEffect(() => {
    setCategoryIncomeId(listCategoryIncome.map((income) => income.id));
  }, [listCategoryIncome]);

  useEffect(() => {
    setCategoryExpenseId(listCategoryExpense.map((expense) => expense.id));
  }, [listCategoryExpense]);

  // lấy tên và màu danh mục để vẽ biểu đồ tròn
  useEffect(() => {
    setCategoryIncomeName(listCategoryIncome.map((income) => income.name));
  }, [listCategoryIncome]);

  useEffect(() => {
    setCategoryExpenseName(listCategoryExpense.map((expense) => expense.name));
  }, [listCategoryExpense]);

  useEffect(() => {
    setCategoryIncomeColor(listCategoryIncome.map((income) => income.color));
  }, [listCategoryIncome]);

  useEffect(() => {
    setCategoryExpenseColor(listCategoryExpense.map((expense) => expense.color));
  }, [listCategoryExpense]);

  useEffect(() => {
    getTotalIncomeMonth();
    getTotalExpenseMonth();
    getTotalIncomePreMonth();
    getTotalExpensePreMonth();
  }, []);

  const handleButtonClick = (buttonNum) => {
    if (buttonNum === 1) {
      setIsButton1Selected(true);
      setCurrentPage(0);
    } else {
      setIsButton1Selected(false);
      setCurrentPage(0);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <Row style={{ height: "1000px" }}>
          <Col md={6}>
            <Card style={{ height: "980px" }}>
              <Card.Header className="text-center">
                Thu nhập và chi tiêu trong năm {getCurrentYear}
              </Card.Header>
              <Card.Body>
                <div style={{ width: "800px", height: "400px" }}>
                  <Line data={dataIncome} options={optionsIncome}></Line>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "300px",
                    margin: "25px auto",
                  }}
                >
                  <div
                    style={{
                      height: "20px",
                      width: "50px",
                      backgroundColor: "blue",
                    }}
                  ></div>
                  <h6>Thu nhập</h6>
                  <div
                    style={{
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                    }}
                  ></div>
                  <h6>Chi tiêu</h6>
                </div>
                <div style={{ width: "800px", height: "400px" }}>
                  <Line data={dataExpense} options={optionsExpense}></Line>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Row>
              <Col>
                <Card style={{ height: "500px", marginBottom: "10px" }}>
                  <Card.Header>Giao dịch trong ngày</Card.Header>
                  <Card.Body>
                    <div className="text-center">
                      <Button
                        variant="primary"
                        style={{
                          marginRight: "10px",
                          width: "40%",
                          height: "50px",
                        }}
                        onClick={() => handleButtonClick(1)}
                      >
                        Thu nhập
                      </Button>
                      <Button
                        variant="warning"
                        style={{ width: "40%", height: "50px" }}
                        onClick={() => handleButtonClick(2)}
                      >
                        Chi tiêu
                      </Button>
                      <hr />
                      {isButton1Selected ? (
                        <ListGroup>
                          {listIncome
                            .slice(offset, offset + ITEMS_PER_PAGE)
                            .map((income) => (
                              <ListGroup.Item key={income.id}>
                                <Row>
                                  <Col md={5}>
                                    <h6>{income.name}</h6>
                                  </Col>
                                  <Col md={5}>
                                    <h6>
                                      {income.amount?.toLocaleString("vi", {
                                        style: "currency",
                                        currency: "VND",
                                      })}
                                    </h6>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            ))}
                          <ReactPaginate
                            previousLabel={"Pre"}
                            nextLabel={"Next"}
                            pageCount={pageCountIncome}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination__link"}
                            nextLinkClassName={"pagination__link"}
                            disabledClassName={"pagination__link--disabled"}
                            activeClassName={"pagination__link--active"}
                          />
                        </ListGroup>
                      ) : (
                        <ListGroup>
                          {listExpense
                            .slice(offset, offset + ITEMS_PER_PAGE)
                            .map((expense) => (
                              <ListGroup.Item key={expense.id}>
                                <Row>
                                  <Col md={5}>
                                    <h6>{expense.name}</h6>
                                  </Col>
                                  <Col md={5}>
                                    <h6>
                                      {expense.amount?.toLocaleString("vi", {
                                        style: "currency",
                                        currency: "VND",
                                      })}
                                    </h6>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            ))}
                          <ReactPaginate
                            previousLabel={"Pre"}
                            nextLabel={"Next"}
                            pageCount={pageCountExpense}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination__link"}
                            nextLinkClassName={"pagination__link"}
                            disabledClassName={"pagination__link--disabled"}
                            activeClassName={"pagination__link--active"}
                          />
                        </ListGroup>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card style={{ height: "150px" }}>
                  <Card.Header style={{ backgroundColor: "#3787ff" }}>
                    Thu nhập
                  </Card.Header>
                  <Card.Body>
                    <h6 style={{ color: "#3787ff" }}>
                      Last Month: +{" "}
                      {totalIncomePreMonth?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h6>
                    <h6 style={{ color: "#3787ff" }}>
                      This Month: +{" "}
                      {totalIncomeMonth?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h6>
                    {totalIncomeMonth - totalIncomePreMonth > 0 ? (
                      <h6 style={{ color: "blue" }}>
                        {"->"}Thu nhập hơn tháng trước:{" +"}
                        {(
                          totalIncomeMonth - totalIncomePreMonth
                        )?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h6>
                    ) : totalIncomeMonth - totalIncomePreMonth === 0 ? (
                      <h6 style={{ color: "blue" }}>
                        {"->"}Thu nhập bằng tháng trước
                      </h6>
                    ) : (
                      <h6 style={{ color: "red" }}>
                        {"->"}Thu nhập ít hơn tháng trước:{" -"}
                        {(
                          totalIncomePreMonth - totalIncomeMonth
                        )?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h6>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card style={{ height: "150px" }}>
                  <Card.Header style={{ backgroundColor: "#f4c60f" }}>
                    Chi tiêu
                  </Card.Header>
                  <Card.Body>
                    <h6 style={{ color: "red" }}>
                      Last Month: -{" "}
                      {totalExpensePreMonth?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h6>
                    <h6 style={{ color: "red" }}>
                      This Month: -{" "}
                      {totalExpenseMonth?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h6>
                    {totalExpenseMonth - totalExpensePreMonth > 0 ? (
                      <h6 style={{ color: "red" }}>
                        {"->"}Chi tiêu hơn tháng trước:{" "}
                        {(
                          totalExpenseMonth - totalExpensePreMonth
                        )?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h6>
                    ) : totalExpenseMonth - totalExpensePreMonth === 0 ? (
                      <h6 style={{ color: "blue" }}>
                        {"->"}Chi tiêu bằng tháng trước
                      </h6>
                    ) : (
                      <h6 style={{ color: "blue" }}>
                        {"->"}Chi tiêu ít hơn tháng trước:{" "}
                        {(
                          totalExpensePreMonth - totalExpenseMonth
                        )?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h6>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card style={{ height: "310px", marginTop: "10px" }}>
                  <Card.Header>Theo danh mục chi tiêu</Card.Header>
                  <Card.Body>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ width: "400px", height: "200px" }}>
                        <h5>Danh mục thu nhập</h5>
                        <Doughnut data={categoryIncomeData} />
                      </div>
                      <div style={{ width: "400px", height: "200px" }}>
                        <h5>Danh mục chi tiêu</h5>
                        <Doughnut data={categoryExpenseData} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Card style={{ height: "400px" }}>
              <Card.Header>Theo thẻ ngân hàng</Card.Header>
              <Card.Body>
                <div style={{ display: "flex" }}>
                  <div style={{ height: "300px", flex: 1 }}>
                    <Bar
                      data={dataTotalCard}
                      options={optionsTotalCard}
                      type="bar"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      margin: "auto 100px",
                    }}
                  >
                    <div
                      style={{ height: "20px", backgroundColor: "blue" }}
                    ></div>
                    <h6>Thu nhập</h6>
                    <div
                      style={{ height: "20px", backgroundColor: "red" }}
                    ></div>
                    <h6>Chi tiêu</h6>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card style={{ height: "300px" }}>
              <Card.Header
                style={{
                  fontWeight: "bold",
                  borderBottom: "none",
                }}
              >
                Quick Menu
              </Card.Header>
              <Card.Body style={{ padding: "20px" }}>
                <ListGroup variant="flush">
                  <ListGroup.Item action href="/category">
                    Danh mục chi tiêu
                    <span class="float-end">›</span>
                  </ListGroup.Item>
                  <ListGroup.Item action href="/card">
                    Quản lý thẻ
                    <span class="float-end">›</span>
                  </ListGroup.Item>
                  <ListGroup.Item action href="/goal">
                    Mục tiêu<span class="float-end">›</span>
                  </ListGroup.Item>
                  <ListGroup.Item action href="/budget">
                    Ngân sách<span class="float-end">›</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default userLayout(HomePage);
