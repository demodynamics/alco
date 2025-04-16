import axios from "axios";
import "./admin.css";
import { useEffect, useState, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AdminCatalog() {

    const navigate = useNavigate();
    let { name } = useParams();


    const [category, setCategory] = useState([])
    const [show, setShow] = useState('none');
    const [activeId, setActiveId] = useState();
    const [itemPrice, setItemPrice] = useState()
    const [itemOldPrice, setItemOldPrice] = useState()

    const handleClose = () => setShow('none');
    const handleShow = (id) => {
        setShow('block')
        setActiveId(id)
    };


    const getCategory = useCallback(async () => {
        try {
            const categoryData = await axios.get(`/api/list/get-category/${name}`)
            setCategory(categoryData.data)
        } catch (e) {
            toast.warning('что-то пошло не так, попробуйте через 5 минут')
        }
    }, [name])

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        } else {
            getCategory()
        }

    }, [navigate, getCategory])

    function handleChange(e) {
        setItemPrice(e)
    }

    function handleOldChange(e) {
        setItemOldPrice(e)
    }



    async function editItem(id) {
        try {
            await axios.put(`/api/admin/edit/${id}`, {
                "price": itemPrice,
                "oldPrice": itemOldPrice
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            toast.success('Цена изменена!')
        } catch (e) {
            console.log(e)
            toast.warning('что-то пошло не так попробуйте через 5 минут')
        }
    }

    async function deleteItem() {

        try {
            await axios.delete(`/api/admin/delete/${activeId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            handleClose()
            toast.success('Товар удален!')
            await getCategory()
        } catch (e) {

            toast.warning('что-то пошло не так попробуйте через 5 минут')
        }
    }

    function logOut() {
        localStorage.removeItem('token')
        navigate('/')

    }

    return (
        <div className="admin_catalog">
            <Button variant="primary" onClick={logOut}>ВЫХОД</Button>{' '}
            <Button variant="primary" onClick={() => navigate('/nimda/category')}>НАЗАД</Button>{' '}
            <Button variant="primary" onClick={() => { navigate(`/nimda/category/add/${name}`) }}>Добавить Товар</Button>

            <div className="container_admin">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Фото</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Старая цена</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={`https://alcodostavka24.online/api/imgs/${name}/${item.img}${/\.\w+$/.test(item.img) ? '' : '.jpg'}`} alt="" />
                                </td>
                                <td>{item.name}</td>
                                <td className="edit-price">
                                    <input type="text" onChange={(e) => handleChange(e.target.value)} defaultValue={item.price} />
                                </td>

                                <td className="edit-price">
                                    <input type="text" onChange={(e) => handleOldChange(e.target.value)} defaultValue={item.oldPrice} />
                                </td>

                                <td>
                                    <button className="btn btn-primary" onClick={() => editItem(item.id)}>Изменить</button>
                                    <button className="btn btn-danger" onClick={() => handleShow(item.id)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    className="modal show_admin"
                    style={{ display: show, position: 'initial' }}
                >
                    <Modal.Dialog>
                        <Modal.Header >
                            <Modal.Title>Удалить</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Вы действительно хотите удалить?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose} >НЕТ</Button>
                            <Button variant="primary" onClick={deleteItem}>ДА</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>

            </div>
        </div>
    )

}

export default AdminCatalog;