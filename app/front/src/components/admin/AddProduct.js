import './admin.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import React, { useState } from 'react';

function AddProduct() {
  let { name } = useParams();
  const navigate = useNavigate();
  const [nameProduct, setNameProduct] = useState('');
  const [priceProduct, setPriceProduct] = useState();
  const [imgProduct, setImgProduct] = useState(null);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', imgProduct);
      formData.append('img', imgProduct.name);
      formData.append('name', nameProduct);
      formData.append('price', priceProduct);
      formData.append('category', name);

      const add = await axios.post(`/api/admin/upload/${name}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNameProduct('');
      setPriceProduct('');
      setImgProduct(null);
      toast.success('Товар добавлен!');
      console.log(add);
    } catch (error) {
      console.log(error);
      toast.warning('Что-то пошло не так, попробуйте через 5 минут');
    }
  };

  function logOut() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="add_product">
      <Button variant="primary" onClick={() => navigate(`/nimda/category/${name}`)}>НАЗАД</Button>{' '}
      <h2>Добавить продукт</h2>
      <Button variant="primary" onClick={logOut}>
        ВЫХОД
      </Button>
      <div className="add_product_form">
        <div className="div_fom">
          <Form onSubmit={(e) => addProduct(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control type="text" value={nameProduct} onChange={(e) => setNameProduct(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Цена</Form.Label>
              <Form.Control type="text" value={priceProduct} onChange={(e) => setPriceProduct(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formFileLg" className="mb-3">
              <Form.Label>Загрузите изображение</Form.Label>
              <Form.Control type="file" size="lg" onChange={(e) => setImgProduct(e.target.files[0])} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Добавить
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
