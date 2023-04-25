import React, {useState, useEffect} from "react";
import axios from "axios";
import { ListGroup } from "react-bootstrap";
import userLayout from "../user/userLayout";
import { Button, Row,Col, Modal, Form } from "react-bootstrap";
import axiosApiInstance from "../context/interceptor";
import unidecode from "unidecode";
import { toast } from "react-toastify";
import { ChromePicker } from "react-color";
const CategoryPage = () => {

    const [load, setLoad] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [listCategoryIncome, setListCategoryIncome] = useState([]);
    const [listCategoryExpense, setListCategoryExpense] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategoryType, setSelectedCategoryType] = useState("all");
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [color, setColor] = useState("#CB4040");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [newCategory, setNewCategory] = useState({
      description: "",
      name: "",
      color: "",
      type: "",
    });

    const handleTypeChange = (event) => {
      setNewCategory({
        ...newCategory,
        type: event.target.value === "income" ? "1" : "2",
      });
    };

    const handleTypeChangeUpdate = (event) => {
      setSelectedCategory({
        ...selectedCategory,
        type: event.target.value === "income" ? "1" : "2",
      });
    };

    const handleColorChange = (color) => {
      setColor(color.hex);
      setNewCategory({
        ...newCategory,
        color: color.hex,
      });
    };

    const handleColorChangeUpdate = (color) => {
      setColor(color.hex);
      setSelectedCategory({
        ...selectedCategory,
        color: color.hex,
      });
    };

    const handleColorPickerClick = () => {
      setShowColorPicker((showColorPicker) => !showColorPicker);
    };

    async function getListCategory()
    {
        const result = await axiosApiInstance.get(
            axiosApiInstance.defaults.baseURL + `/api/category/all`);

            setLoad(true);
            if (result?.data.length === 0) {
              toast.error("Chưa có danh mục. Hãy thêm danh mục để quản lý chi tiêu của bạn!");
            } else {
              setListCategory(result?.data);
              setFilteredList(result?.data);
            }
    }

    async function getListCategoryIncome()
    {
      const result = await axiosApiInstance.get(
        axiosApiInstance.defaults.baseURL + `/api/category/income`
      );
      setLoad(true);
      setListCategoryIncome(result?.data);
    }

    async function getListCategoryExpense()
    {
      const result = await axiosApiInstance.get(
        axiosApiInstance.defaults.baseURL + `/api/category/expense`
      );
      setLoad(true);
      setListCategoryExpense(result?.data);
    }


    const addNewCategory = async () => {
      setNewCategory({
        ...newCategory,
        color: color,
      });
      try{
        const result = await axiosApiInstance.post(
          axiosApiInstance.defaults.baseURL + `/api/category/add`, newCategory
          );
          if (result?.data.message.includes("Đã tồn tại danh mục với thể loại chi tiêu"))
          {
            toast.error("Đã tồn tại danh mục với thể loại chi tiêu!");
          }
          else
          {
            setListCategory([...listCategory, result?.data?.data]);
            setFilteredList([...listCategory, result?.data?.data]);
            setShowModalAdd(false);
            toast.success(
              "Thêm danh mục chi tiêu thành công!"
            );
          }
      }
      catch(error)
      {
        toast.error("Thêm danh mục không thành công. Vui lòng kiểm tra lại!");
      }
    }

    const updateCategory = async (id) => {
      try{
        const payload = {
          description: selectedCategory.description,
          name: selectedCategory.name,
          color: selectedCategory.color,
          type: selectedCategory.type,
        };
        const result = await axiosApiInstance.put(
          axiosApiInstance.defaults.baseURL + `/api/category/update/${id}`, payload
        );
        if(result?.data?.status === 200)
        {
          toast.success(result?.data?.message);
          getListCategory();
          setShowModalUpdate(false);
        }
        else 
        {
          toast.error("Đã tồn tại danh mục với thể loại chi tiêu!");
        }
      }
      catch(error)
      {
        toast.error("Lỗi! Vui lòng thử lại");
      }
    }

    async function deleteCategory(id)
    {
      try{
        const result = await axiosApiInstance.delete(
          axiosApiInstance.defaults.baseURL + `/api/category/delete/${id}`
        );
        if(result?.data?.status === 200)
        {
          toast.success("Danh mục đã được xóa thành công!");
          const newListCategory = listCategory.filter((category) => category.id !== id);
          setListCategory(newListCategory);
          setFilteredList(newListCategory);
          setShowModalDelete(false);
        }
        else{
          if (result?.data?.message.includes("Không thể xóa danh mục")) {
          toast.error(
            "Không thể xóa danh mục do có giao dịch liên quan!"
          );
          setShowModalDelete(false);
        }
        }
      }
      catch (error) {
      console.log(error);
      toast.error("Lỗi! Vui lòng thử lại");
      }
    };

    useEffect(() => {
        getListCategory();
        getListCategoryIncome();
        getListCategoryExpense();
    }, []);



const handleSearch = (event) => {
  const searchText = event.target.value;
  setSearchText(searchText);
  if (searchText === "") {
    if (selectedCategoryType === "all") {
      setFilteredList(listCategory);
    } else if (selectedCategoryType === "income") {
      setFilteredList(listCategoryIncome);
    } else if (selectedCategoryType === "expense") {
      setFilteredList(listCategoryExpense);
    }
  } else {
    let filteredList = [];
    if (selectedCategoryType === "all") {
      filteredList = listCategory.filter((category) => {
        const categoryName = unidecode(category.name).toLowerCase();
        const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
        return categoryName.includes(searchTextNoDiacritics);
      });
    } else if (selectedCategoryType === "income") {
      filteredList = listCategoryIncome.filter((category) => {
        const categoryName = unidecode(category.name).toLowerCase();
        const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
        return categoryName.includes(searchTextNoDiacritics);
      });
    } else if (selectedCategoryType === "expense") {
      filteredList = listCategoryExpense.filter((category) => {
        const categoryName = unidecode(category.name).toLowerCase();
        const searchTextNoDiacritics = unidecode(searchText).toLowerCase();
        return categoryName.includes(searchTextNoDiacritics);
      });
    }
    setFilteredList(filteredList);
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
              <h4>Danh sách danh mục</h4>
            </div>

            <div className="d-flex align-items-center mb-3">
              <Form.Control
                style={{
                  width: "200px",
                  marginRight: "auto",
                }}
                type="text"
                placeholder="Tìm kiếm danh mục"
                value={searchText}
                onChange={handleSearch}
              />
              <div className="d-flex" style={{ marginLeft: "auto" }}>
                <div className="filter-icon">
                  <i className="fa fa-fw fa-filter text-black"></i>
                </div>
                <Form.Select
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedCategoryType(value);
                    if (value === "all") {
                      setFilteredList(listCategory);
                    } else if (value === "income") {
                      setFilteredList(listCategoryIncome);
                    } else if (value === "expense") {
                      setFilteredList(listCategoryExpense);
                    }
                  }}
                  value={selectedCategoryType}
                  style={{
                    width: "200px",
                    marginRight: "10px",
                  }}
                >
                  <option value="all">Tất cả</option>
                  <option value="income">Danh mục thu nhập</option>
                  <option value="expense">Danh mục chi tiêu</option>
                </Form.Select>
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
                  Thêm danh mục
                </Button>
              </div>
            </div>
            <div style={{ marginBottom: "1em" }}></div>
            <Row>
              <Col md={1}>
                <b style={{ fontWeight: "bold" }}>Màu sắc</b>
              </Col>
              <Col md={2}>
                <b style={{ fontWeight: "bold" }}>Tên danh mục</b>
              </Col>
              <Col md={6}>
                <b style={{ fontWeight: "bold" }}>Mô tả chi tiết</b>
              </Col>
              <Col md={1}>
                <b style={{ fontWeight: "bold" }}>Thể loại</b>
              </Col>
            </Row>
            <hr />
            <ListGroup>
              {filteredList.map((category) => (
                <>
                  <ListGroup.Item key={category.id}>
                    <Row>
                      <Col md={1}>
                        <div
                          style={{
                            backgroundColor: category.color,
                            height: "25px",
                            width: "25px",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </Col>
                      <Col md={2}>
                        <h6>{category.name}</h6>
                      </Col>
                      <Col md={6}>
                        <h6>{category.description}</h6>
                      </Col>
                      <Col md={1}>
                        <h6>{category.type === 1 ? "Thu nhập" : "Chi tiêu"}</h6>
                      </Col>
                      <Col md={2} className="d-flex justify-content-end">
                        <Button
                          variant="warning"
                          style={{ marginRight: "10px" }}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowModalUpdate(true);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedCategoryId(category.id);
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
            <Modal.Title>Thêm danh mục chi tiêu mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formType">
                <Form.Label>Thể loại</Form.Label>
                <Form.Select name="type" onChange={handleTypeChange}>
                  <option value="">-- Chọn thể loại --</option>
                  <option value="income">Thu nhập</option>
                  <option value="expense">Chi tiêu</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formColor">
                <Form.Label>Chọn màu</Form.Label>
                <div onClick={handleColorPickerClick}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: color,
                    }}
                  ></div>
                  {showColorPicker && (
                    <ChromePicker color={color} onChange={handleColorChange} />
                  )}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
              Thoát
            </Button>
            <Button variant="primary" onClick={addNewCategory}>
              Thêm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa thông tin danh mục</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCategory ? (
              <form>
                <div className="form-group">
                  <Form.Label>Tên danh mục</Form.Label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.name}
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <Form.Label>Mô tả</Form.Label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.description}
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <Form.Label>Thể loại</Form.Label>
                  <Form.Select
                    name="type"
                    value={selectedCategory.type}
                    onChange={handleTypeChangeUpdate}
                  >
                    <option value="">-- Chọn thể loại --</option>
                    <option value="income">Thu nhập</option>
                    <option value="expense">Chi tiêu</option>
                  </Form.Select>
                </div>
                <div className="form-group">
                  <div onClick={handleColorPickerClick}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: selectedCategory.color,
                      }}
                    ></div>
                    {showColorPicker && (
                      <ChromePicker
                        color={selectedCategory.color}
                        onChange={handleColorChangeUpdate}
                      />
                    )}
                  </div>
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
                    onClick={() => updateCategory(selectedCategory.id)}
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
            <Modal.Title>Xóa danh mục</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa danh mục không?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalDelete(false)}
            >
              Thoát
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteCategory(selectedCategoryId)}
            >
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
};

export default userLayout(CategoryPage);


