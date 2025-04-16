import { useParams } from 'react-router-dom';
import './Pages.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Spinner, InputGroup } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons'
import { toast } from 'react-toastify';
import NotFound from '../../../routing/NotFound';

function Pages() {
    const basketArr = []
    let { name } = useParams();

    const [alko, setAlko] = useState()
    const [nameT, setNameT] = useState()
    const [phoneT, setPhoneT] = useState()
    const [show, setShow] = useState(false);
    const [spanError, setSpanError] = useState('');
    const handleClose = () => {
        setNameT("")
        setPhoneT("")
        setShow(false)
    };
    const handleShow = () => setShow(true);



    useEffect(() => {

        async function getCategory() {
            try {
                const category = await axios.get(`http://localhost:5003/api/list/get-category/${name}`)
                setAlko(category.data)
            } catch (e) {
                console.log(e)
            }
        }

        getCategory()
    }, [name])

    function addToBasket(e, item) {
        e.preventDefault()

        let filtered = []
        if (localStorage.getItem('basket')) {
            filtered = JSON.parse(localStorage.getItem('basket')).filter(item2 => item2.id === item.id)
        }


        if (filtered.length > 0) {
            toast.info("Этот товар есть в корзине")
            return
        }

        basketArr.push(
            {
                ...item,
                quantity: 1
            }
        )

        if (JSON.parse(localStorage.getItem('basket'))) {
            const basket = JSON.parse(localStorage.getItem('basket'))
            basket.push(
                {
                    ...item,
                    quantity: 1
                }
            )
            localStorage.setItem('basket', JSON.stringify(basket))

        } else {
            localStorage.setItem('basket', JSON.stringify(basketArr))
        }
        toast.success("Товар добавлен в корзину")
    }

    const reg = /^\d{10}$/

    async function sendTelegram() {
        const TOKEN = "6104094925:AAEAcMEOPXFtUvUmgGejDzfl8HBNjLzH8X0"
        const CHAT_ID = "-1001633078067"
        const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        if (nameT && reg.test(phoneT)) {
            try {
                await axios.post(URI_API, {
                    chat_id: CHAT_ID,
                    parse_mode: 'html',
                    text: `Сайт - дорогой, заказ: --быстрый заказ--, Имя - ${nameT}, Телефон - +7${phoneT} `
                })

                toast.success("Наш менеджер свяжется с Вами")

                setNameT("")
                setPhoneT("")
                handleClose()

            } catch (e) {
                toast.warning('проблемы со связи, попробуйте снова')
            }
        } else {
            toast.warning("заполните форму полностью")
            return
        }


    }

    const validEndpoints = ["vodka", "beer", "whiskey", "cognac", "liquor", "tequilla", "jin", "rom", "wine", "champagne", "vermouth", "juice", "water", "snacks", "ciggarettes", "tobacandcalian", "sticks", "el-sig", "other"]

    const currentPath = window.location.pathname.split('/')[2]// Add other valid endpoints if needed

    const isValidEndpoint = validEndpoints.some(endpoint => currentPath === endpoint);

    return (
        <>
            {
                !isValidEndpoint ?
                    <NotFound />
                    :
                    <div className='pages_container'>
                        {
                            alko ? alko.map((item, index) => {
                                return (
                                    <Card className='pages_cards' key={index}>
                                        {item.oldPrice ? <Card.Text className='akcia-text'><img className='akcia_img' src='/image/akcia.png' alt="" /></Card.Text> : null}
                                        <Card.Img variant="top" className='item_img' src={`http://localhost:5003/api/imgs/${name}/${item.img}${/\.\w+$/.test(item.img) ? '' : '.jpg'}`} alt="" />
                                        <Card.Body className='card.body akcia-card-body'>
                                            <Card.Title>{item.name}</Card.Title>
                                            <Card.Text className='old-price'>{item.oldPrice ? item.oldPrice + " РУБ" : ""}</Card.Text>
                                            <Card.Text style={{ color: "#21C737" }}>{item.price} РУБ</Card.Text>
                                            <Button onClick={handleShow}>В 1 клик</Button>{' '}
                                            <Button className='cart4_icon' onClick={(e) => addToBasket(e, item)}>
                                                <Icon.Cart4 />
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                )
                            }) : <Spinner animation="border" variant="success" />
                        }

                    </div>
            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Купить в 1 клик</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Имя</Form.Label>
                        <InputGroup className="mb-3">

                            <Form.Control
                                type="text"
                                required
                                autoFocus
                                value={nameT}
                                onChange={(e) => setNameT(e.target.value)}
                            />
                        </InputGroup>
                        <Form.Label>Тел.</Form.Label>
                        <InputGroup >
                            <InputGroup.Text>+7</InputGroup.Text>
                            <Form.Control
                                type="text"
                                inputMode="numeric"
                                minLength="10"
                                maxLength="10"
                                placeholder="999 000 00 01"
                                name='Nomer telefona'
                                value={phoneT}
                                onChange={(e) => {
                                    setPhoneT(e.target.value)
                                    if (!reg.test(e.target.value)) {
                                        setSpanError('заполните номер телефона правильно')
                                    } else {
                                        setSpanError('')
                                    }
                                }}
                                required
                            />
                        </InputGroup>
                        <span style={{ color: 'red' }}>{spanError}</span>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button variant="primary" onClick={sendTelegram}>
                        Отправить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Pages;