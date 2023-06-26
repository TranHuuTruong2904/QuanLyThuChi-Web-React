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
import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';

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

  // ==== lấy list thu nhập và chi tiêu qua các tháng vẽ biểu đồ đường
  async function getTotalIncomeInYear() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/totalincomeinyear`
    );
    setLoad(true);
    setDataTotalIncomeMonth(result?.data?.data);
  }

  async function getTotalExpenseInYear() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/totalexpenseinyear`
    );
    setLoad(true);
    setDataTotalExpenseMonth(result?.data?.data);
  }

  const dataIncome = {
    options: {
      chart: {
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [     
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
        "Dec",]
      }
    },
    series: [
      {
        name: "series-1",
        data: dataTotalIncomeMonth
      }
    ]
  };

  const dataExpense = {
    options: {
      chart: {
        id: "basic-bar",
      },
      fill: {
        colors: ["red", "red", "red"]
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [     
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
        "Dec",]
      }
    },
    series: [
      {
        name: "series-1",
        data: dataTotalExpenseMonth
      }
    ]
  };


  // ========== lấy chi tiêu và thu nhập của các thẻ trong tháng vẽ biểu đồ cột
  async function getTotalIncomeInMonthByCard() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/listtotalincomebycard`
    );
    setLoad(true);
    setDataCardIncome(result?.data?.data);
  }

  async function getTotalExpenseInMonthByCard() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/listtotalexpensebycard`
    );
    setLoad(true);
    setDataCardExpense(result?.data?.data);
  }

  const TotalByCard = {
    series: [{
      name: 'Thu nhập',
      type: 'column',
      data: dataCardIncome
    }, {
      name: 'Chi tiêu',
      type: 'column',
      data: dataCardExpense,
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      xaxis: {
        categories: cardName,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            style: {
              colors: '#008FFB',
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: 'Income',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396'
          },
          labels: {
            style: {
              colors: '#00E396',
            }
          },
        },
        {     axisBorder: {
            show: true,
            color: 'red'
          },
          labels: {
            style: {
              colors: '#FEB019',
            },
          }
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft',
          offsetY: 30,
          offsetX: 60
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    },
  
  
  };

  // ========== tổng tiền của danh mục chi tiêu và thu nhập
  async function getTotalIncomeInMonthByCategory() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/totalbycategoryincomeinmonth`
    );
    setLoad(true);
    setDataCategoryIncome(result?.data?.data);
  }

  async function getTotalExpenseInMonthByCategory() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/transaction/totalbycategoryexpenseinmonth`
    );
    setLoad(true);
    setDataCategoryExpense(result?.data?.data);
  }

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

  useEffect(() => {
    getListIncome();
    getListExpense();
    getListCard();
    getListCategoryExpense();
    getListCategoryIncome();
    getTotalExpenseInYear();
    getTotalIncomeInYear();
    getTotalExpenseInMonthByCard();
    getTotalIncomeInMonthByCard();
    getTotalExpenseInMonthByCategory();
    getTotalIncomeInMonthByCategory();
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
                  <Chart options={dataIncome.options} series={dataIncome.series} type="area" height="400px"></Chart>
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
                  <Chart options={dataExpense.options} series={dataExpense.series} type="area" height="400px"></Chart>
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
                  <div style={{ height: "350px", flex: 1 }}>
                    <ReactApexChart options={TotalByCard.options} series={TotalByCard.series} type="line" height={330} width={900} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card style={{ height: "400px" }}>
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
