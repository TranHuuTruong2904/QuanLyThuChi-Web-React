import React, {useEffect, useState, useRef} from "react";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import unidecode from "unidecode";
import { toast } from "react-toastify";
import userLayout from "../user/userLayout";
import {ListGroup, Button, Row, Col, Modal, Form,Pagination } from "react-bootstrap";

const BudgetPage = () => {
    const [load, setLoad] = useState(false);
    const [listBudget, setListBudget] = useState([]);
    const [listCategoryExpense, setListCategoryExpense] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [totalByCategory, setTotalByCategory] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [listTempBudget, setListTempBudget] = useState([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [newBudget, setNewBudget] = useState(
        {
            amount : "",
            description: "",
        });

        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage] = useState(7);

        const pageCount = Math.ceil(listBudget.length / itemsPerPage);
        // tính phần tử đầu và phần tử cuối của trang
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const currentItems = listTempBudget.slice(
          indexOfFirstItem,
          indexOfLastItem
        );

        const handlePageChange = (pageNumber) => {
          setCurrentPage(pageNumber);
        };

    async function getListBudget()
    {
        const result = await axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL + `/api/budget/all/inmonth`
        );
        setLoad(true);
        if(result?.data?.status === 101)
        {
            toast.error("Chưa có ngân sách trong tháng. Hãy thêm ngân sách để quản lý chi tiêu của bạn!");
        }
        else
        {
            setListBudget(result?.data?.data);
            setListTempBudget(result?.data?.data);
        }
    }

    const prevTotalByCategoryRef = useRef([]);

    async function fetchTotalByCategories(categories) {
      const promises = categories.map((category) => {
        return axiosApiInstance.get(
          axiosApiInstance.defaults.baseURL +
            `/api/transaction/totalbycategory/${category.id}`
        );
      });
      const results = await Promise.all(promises);
      return results.map((result) => result?.data?.data || 0);
    }

    useEffect(() => {
      const categories = currentItems.map((budget) => budget.categoryModel);
      fetchTotalByCategories(categories).then((results) => {
        const prevTotalByCategory = prevTotalByCategoryRef.current;
        if (JSON.stringify(prevTotalByCategory) !== JSON.stringify(results)) {
          setTotalByCategory(results);
          prevTotalByCategoryRef.current = results;
        }
      });
    }, [currentItems]);

    async function getListCategoryExpense()
    {
        const result = await axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL + `/api/category/expense`
        );
        setLoad(true);
        setListCategoryExpense(result?.data);
    }

    const addBudget = async(idCategory) => {
        try{
            const result = await axiosApiInstance.post(
                axiosApiInstance.defaults.baseURL + `/api/budget/add/${idCategory}`, newBudget
            );

            if(result?.data?.status === 101)
            {
                toast.error("Ngân sách cho danh mục giao dịch trong tháng đã tồn tại!");
            }
            else
            {
                toast.success("Thêm ngân sách thành công!");
                setListBudget([...listBudget, result?.data?.data,]);
                setListTempBudget([...listBudget, result?.data?.data]);

                setShowModalAdd(false);
                getListBudget();
            }
        }
        catch (error) {
            toast.error("Lỗi! Vui lòng kiếm tra lại!");}
    };

    async function deleteBudget(id){
        try {
          const result = await axiosApiInstance.delete(
            axiosApiInstance.defaults.baseURL + `/api/budget/delete/${id}`
          );
          if(result?.data?.status === 200)
          {
            toast.success("Ngân sách đã được xóa thành công!");
            const newListBudget = listBudget.filter(
          (budget) => budget.id !== id );

          setListBudget(newListBudget);
          setListTempBudget(newListBudget);
          setShowModalDelete(false);
          }
        } catch (error) {
          toast.error("Lỗi! Vui lòng thử lại");
        }
    }

    const updateBudget = async(id) => {
        try {
          const payload = {
            amount: selectedBudget.amount,
            description: selectedBudget.description,
          };
          const result = await axiosApiInstance.put(
            axiosApiInstance.defaults.baseURL + `/api/budget/update/${id}`,
            payload
          );

          if (result?.data?.status === 200) {
            toast.success(result?.data?.message);
            getListBudget();
            setShowModalUpdate(false);
          }
        } catch (error) {
          toast.error("Lỗi! Vui lòng thử lại");
        }
    }

    console.log(totalByCategory)

    useEffect(() => {
      if (listCategoryExpense.length > 0) {
        setSelectedCategory(listCategoryExpense[0].id);
      }
    }, [listCategoryExpense]);

    useEffect(() => {
        getListBudget();
        getListCategoryExpense();
    }, []);

    const handleSearch = (event) => {
      const searchText = event.target.value;
      setSearchText(searchText);
      if (searchText === "") {
        setListTempBudget(listBudget);
      } else {
        const filteredList = listBudget.filter((budget) => {
          const categoryName = unidecode(budget.categoryModel.name).toLowerCase();
          const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
          return categoryName.includes(searchTextNoDiacritics);
        });
        setListTempBudget(filteredList);
      }
    };

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
              <h4>Danh sách ngân sách trong tháng của các danh mục chi tiêu</h4>
            </div>

            <div className="d-flex align-items-center mb-3">
              <Form.Control
                style={{
                  width: "200px",
                  marginRight: "auto",
                }}
                type="text"
                placeholder="Tìm kiếm ngân sách"
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
                Thêm ngân sách
              </Button>
            </div>
            <div style={{ marginBottom: "1em" }}></div>
            <Row>
              <Col md={2}>
                <b style={{ fontWeight: "bold" }}>Danh mục chi tiêu</b>
              </Col>
              <Col md={2}>
                <b style={{ fontWeight: "bold" }}>Số tiền</b>
              </Col>
              <Col md={1}>
                <b style={{ fontWeight: "bold" }}>Từ ngày</b>
              </Col>
              <Col md={1}>
                <b style={{ fontWeight: "bold" }}>Đến ngày</b>
              </Col>
              <Col md={3}>
                <b style={{ fontWeight: "bold" }}>Mô tả</b>
              </Col>
              <Col md={1}>
                <b style={{ fontWeight: "bold" }}>Đã chi</b>
              </Col>
            </Row>
            <hr />
            <ListGroup>
              {currentItems.map((budget, index) => (
                <>
                  <ListGroup.Item key={budget.id}>
                    <Row>
                      <Col md={2}>
                        <h6>{budget.categoryModel.name}</h6>
                      </Col>
                      <Col md={2}>
                        <h6>
                          {budget.amount?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </h6>
                      </Col>
                      <Col md={1}>
                        <h6>
                          {new Date(budget.fromdate).toLocaleDateString(
                            "en-GB"
                          )}
                        </h6>
                      </Col>
                      <Col md={1}>
                        <h6>
                          {new Date(budget.todate).toLocaleDateString("en-GB")}
                        </h6>
                      </Col>
                      <Col md={3}>
                        <h6>{budget.description}</h6>
                      </Col>
                      <Col md={1}>
                        <h6>
                          {(
                            (totalByCategory[index] / budget.amount) *
                            100
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          %
                        </h6>
                      </Col>
                      <Col md={2} className="d-flex justify-content-end">
                        <Button
                          variant="warning"
                          style={{ marginRight: "10px" }}
                          onClick={() => {
                            setSelectedBudget(budget);
                            setShowModalUpdate(true);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedBudgetId(budget.id);
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

        <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm ngân sách cho danh mục chi tiêu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Chọn danh mục chi tiêu</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {listCategoryExpense.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Số tiền</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      amount: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Mô tả chi tiết</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => addBudget(selectedCategory)}
            >
              Thêm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa thông tin ngân sách</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBudget ? (
              <form>
                <div className="form-group">
                  <Form.Label>Số tiền</Form.Label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedBudget.amount}
                    onChange={(e) =>
                      setSelectedBudget({
                        ...selectedBudget,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <Form.Label>Mô tả chi tiết</Form.Label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedBudget.description}
                    onChange={(e) =>
                      setSelectedBudget({
                        ...selectedBudget,
                        description: e.target.value,
                      })
                    }
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
                    onClick={() => updateBudget(selectedBudget.id)}
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
          <Modal.Body>Bạn có chắc chắn muốn xóa ngân sách không?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalDelete(false)}
            >
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteBudget(selectedBudgetId)}
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

export default userLayout(BudgetPage);