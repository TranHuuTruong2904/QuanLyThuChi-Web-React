import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row,Container, Modal, Form } from "react-bootstrap";
import userLayout from "../user/userLayout";
import axiosApiInstance from "../context/interceptor";
import { useNavigate } from "react-router-dom";
import '../assets/css/card.css'
import { toast } from "react-toastify";

const CardPage = () => { 
  const navigate = useNavigate();
  const [load, setLoad] = useState(false); 
  const [listCard, setListCard] = useState([]);
  const [cardDetails, setCardDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); 
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [newCard, setNewCard] = useState({
    name: "",
    balance: "",
    cardnumber: "",
    description: "",
  });
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCard({ ...newCard, [name]: value });
  };

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


  async function getCardDetails(id) {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/card/${id}`
    );
    setCardDetails(result?.data);
    setShowModal(true);
  }

  const addNewCard = async () => {
    try {
      const result = await axiosApiInstance.post(
        axiosApiInstance.defaults.baseURL + `/api/card/add`,
        newCard
      );
      setListCard([...listCard, result?.data?.data]);
      toast.success("Thêm thẻ ngân hàng thành công!");
      setShowModalAdd(false);
    } catch (error) {
      toast.error("Thẻ đã tồn tại! Vui lòng kiếm tra lại!");
    }
  };
  
  async function handleDeleteItem(id){ 
    try {
      const result = await axiosApiInstance.delete(
       axiosApiInstance.defaults.baseURL + `/api/card/delete/${id}`);
      if (result?.data?.status === 200) {
        toast.success("Thẻ đã được xóa thành công!");
        const newListCard = listCard.filter((card) => card.id !== id);
        setListCard(newListCard);
      } else {
        if (result?.data?.message.includes("Không thẻ xóa thẻ")) {
          toast.error(
            "Thẻ đang được sử dụng cho một giao dịch. Không được phép xóa!"
          );
          setShowModalDelete(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi! Vui lòng thử lại");
    }
  };

  const handleUpdateItem = async (id) =>
  {
    try{
      const payload = {
        name: selectedCard.name,
        balance: selectedCard.balance,
        cardnumber: selectedCard.cardnumber,
        description: selectedCard.description,
      };
      const result = await axiosApiInstance.put(
        axiosApiInstance.defaults.baseURL + `/api/card/update/${id}`, payload
      );
      if (result?.data?.status === 200) {
        toast.success(result?.data?.message);
        setShowModalUpdate(false);
        getListCard();
      } else {
        toast.error(result?.data?.message + "! Vui lòng thử lại");
      }
    }
    catch(error)
    {console.log(error);}
  }

  useEffect(() => {
    getListCard();
  }, []);

  return (
    <>
      {load ? (
        <Container>
          <Row>
            {listCard.map((card, index) => (
              <Row
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                }}
              >
                <Card className="card-hover" style={{ width: "500px" }}>
                  <Card.Body style={{ textAlign: "right" }}>
                    <Card.Text>{card.description}</Card.Text>
                    <Card.Title>{card.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-danger">
                      Số thẻ: {card.cardnumber}
                    </Card.Subtitle>
                    <Button
                      variant="primary"
                      onClick={() => {
                        getCardDetails(card.id);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowModalUpdate(true);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedCardId(card.id);
                        setShowModalDelete(true);
                      }}
                    >
                      Xóa
                    </Button>
                  </Card.Body>
                </Card>
              </Row>
            ))}
          </Row>
        </Container>
      ) : (
        <p>Loading...</p>
      )}
      <Button
        variant="primary"
        style={{
          position: "fixed",
          left: "80%",
          top: "10%",
          fontSize: "20px",
          width: "180px",
          height: "50px",
        }}
        onClick={() => {
          setShowModalAdd(true);
        }}
      >
        Thêm thẻ
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết thẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cardDetails ? (
            <Form>
              <Form.Group controlId="formCardName">
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={cardDetails.name}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCardDescription">
                <Form.Label>Ngân hàng</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={cardDetails.description}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formCardNumber">
                <Form.Label>Số thẻ</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={cardDetails.cardnumber}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formBalance">
                <Form.Label>Số dư</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={cardDetails.balance?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                  readOnly
                />
                {/* `${cardDetails.balance} VND` */}
              </Form.Group>
            </Form>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm thẻ mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCardName">
              <Form.Label>Tên thẻ</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCard.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBalance">
              <Form.Label>Số dư</Form.Label>
              <Form.Control
                thousandSeparator={true}
                type = "number"
                prefix={"₫"}
                name="balance"
                value={newCard.balance}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCardNumber">
              <Form.Label>Số thẻ</Form.Label>
              <Form.Control
                type="number"
                name="cardnumber"
                value={newCard.cardnumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCardDescription">
              <Form.Label>Tên ngân hàng</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newCard.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
            Thoát
          </Button>
          <Button variant="primary" onClick={addNewCard}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin thẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard ? (
            <form>
              <div className="form-group">
                <Form.Label>Tên thẻ</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedCard.name}
                  onChange={(e) =>
                    setSelectedCard({ ...selectedCard, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <Form.Label>Số dư</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedCard.balance}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      balance: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <Form.Label>Số thẻ</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedCard.cardnumber}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      cardnumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <Form.Label>Ngân hàng</Form.Label>
                <textarea
                  className="form-control"
                  value={selectedCard.description}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
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
                  onClick={() => handleUpdateItem(selectedCard.id)}
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
          <Modal.Title>Xóa thẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa thẻ không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
            Thoát
          </Button>
          <Button
            variant="primary"
            onClick={() => handleDeleteItem(selectedCardId)}
          >
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default userLayout(CardPage);
