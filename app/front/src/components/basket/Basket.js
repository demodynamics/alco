import './basket.css';
import { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

function Basket() {
    const [basketItems, setBasketItems] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceDel, setTotalPriceDel] = useState(0);
    const [nameA, setNameA] = useState();
    const [phoneA, setPhoneA] = useState();
    const [streetA, setStreetA] = useState();
    const [homeA, setHomeA] = useState();
    const [otherA, setOtherA] = useState();
    const [selectedCity, setSelectedCity] = useState('Москва');
    const [selectedValue, setSelectedValue] = useState(0);
    const [spanError, setSpanError] = useState('');


    const handleRadioChange = (event) => {
        setSelectedValue(parseInt(event.target.value));
    };



    const handleSelectChange = (event) => {
        setSelectedCity(event.target.value);
    };

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('basket'));
        setBasketItems(items);
    }, []);

    useEffect(() => {
        let newQuantities = []
        if (basketItems) {
            newQuantities = new Array(basketItems.length).fill(1);
        }
        setQuantities(newQuantities);
    }, [basketItems]);

    useEffect(() => {
        let newTotalPrice = [null]
        if (basketItems) {
            newTotalPrice = basketItems.reduce((acc, item, index) => {
                return (acc + item.price * quantities[index]);
            }, 0);
        }

        setTotalPrice(newTotalPrice);

    }, [basketItems, quantities]);


    useEffect(() => {
        setTotalPriceDel(parseInt(selectedValue) + totalPrice);
    }, [totalPrice, selectedValue]);


    const handleQuantityChange = (index, value) => {
        value = parseInt(value)
        const newQuantities = [...quantities];
        newQuantities[index] = value;
        setQuantities(newQuantities);

        const newBasketItems = basketItems.map((item, i) => {
            if (i === index) {
                return { ...item, quantity: value };
            }
            return item;
        });

        localStorage.setItem('basket', JSON.stringify(newBasketItems));
    };

    const handleRemoveItem = (index) => {
        const newBasketItems = [...basketItems];
        newBasketItems.splice(index, 1);
        setBasketItems(newBasketItems);
        localStorage.setItem('basket', JSON.stringify(newBasketItems));
    };

    function sendItems() {
        const send = []
        if (localStorage.getItem('basket')) {
            JSON.parse(localStorage.getItem('basket')).forEach(e => {
                send.push({
                    "Имя": `<b>${e.name}</b>`,
                    "Цена": `<b>${e.price}</b>`,
                    "Количество": `<b>${e.quantity}</b>`
                })
            })
        }


        return send
    }

    const reg = /^\d{10}$/


    async function sendTelegram() {
        const TOKEN = "6104094925:AAEAcMEOPXFtUvUmgGejDzfl8HBNjLzH8X0"
        const CHAT_ID = "-1001633078067"
        const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        if (nameA && reg.test(phoneA) && streetA && homeA && selectedValue && basketItems.length > 0) {
            try {
                await axios.post(URI_API, {
                    chat_id: CHAT_ID,
                    parse_mode: 'html',
                    text: `Сайт - дорогой, заказчик  /  Имя - ${nameA},  Телефон - +7${phoneA},  Город - ${selectedCity},  Улица - ${streetA},  Дом - ${homeA},  Дополнительно - ${otherA ? otherA : "---"},  Стоимость доставки - ${selectedValue},  итого = ${totalPrice}  :                 заказ - ${JSON.stringify(sendItems())}`
                })

                toast.success("заказ принят")

                setNameA("")
                setPhoneA("")
                setStreetA("")
                setHomeA("")
                setOtherA("")
                localStorage.removeItem('basket')
                setBasketItems([])
            } catch (e) {
                toast.warning('проблемы со связи, попробуйте снова')
            }
        } else {

            toast.warning("заполните форму полностью и без ошибок")
            return
        }
    }

    return (
        <div className='bask_container'>
            <div className="basket_container_responsive">
                <table className='basket_table'>
                    <tbody>
                        <tr>
                            <th className='img_td_th'>Фото</th>
                            <th>Наименование товара</th>
                            <th>Цена</th>
                            <th>Кол.</th>
                            <th>Убрать</th>
                            <th>Всего</th>
                        </tr>
                        {basketItems && basketItems.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='img_td_th'>
                                        <img className='img_td' src={`https://alcodostavka24.online/api/imgs/${item.type.name}/${item.img}${/\.\w+$/.test(item.img) ? '' : '.jpg'}`} alt="" />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <div className="quantity">
                                            <input type="number" min="1" defaultValue={item.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                                        </div>
                                    </td>
                                    <td>
                                        <Button className="btn_delete" variant="light" onClick={() => handleRemoveItem(index)}>X</Button>
                                    </td>
                                    <td>{isNaN(item.quantity) ? item.price : (item.price * quantities[index]).toString()}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td className='td_colSpan'></td>
                            <td colSpan={4}>Итого (сумма без учета доставки)</td>
                            <td>
                                <b>{isNaN(totalPrice) ? '-' : totalPrice.toString()}</b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h1 className='basket-title'>ДЕТАЛИ ОПЛАТЫ</h1>
            <hr />
            <div className='form_basket'>

                <div className='form_delivery'>
                    <Form className='form_delivery' >
                        <Form.Label>Имя </Form.Label>
                        <InputGroup controlId="formBasicName">

                            <Form.Control
                                type="text"
                                name='Imya'
                                value={nameA}
                                onChange={(e) => setNameA(e.target.value)}
                                required
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
                                value={phoneA}
                                onChange={(e) => {
                                    setPhoneA(e.target.value)
                                    if (!reg.test(e.target.value)) {
                                        setSpanError('заполните номер телефона правильно')
                                    } else {
                                        setSpanError('')
                                    }
                                }}
                                required
                            />
                        </InputGroup>
                        <span style={{ color: 'red' }}>{spanError}</span><br />
                        <Form.Label>Город</Form.Label>
                        <InputGroup controlId="formBasicAddress">

                            <input
                                type="text"
                                list="cities"
                                className="form-control"
                                value={selectedCity}
                                onChange={handleSelectChange}
                            />
                            <datalist id="cities">
                                <option value="Москва" />
                                <option value="Балашиха" />
                                <option value="Красногорск" />
                                <option value="Лобня" />
                                <option value="Люберцы" />
                                <option value="Мытищи" />
                                <option value="Одинцово" />
                                <option value="Подольск" />
                                <option value="Пушкино" />
                                <option value="Реутов" />
                                <option value="Троицк" />
                                <option value="Химки" />
                                <option value="Щербинка" />
                                <option value="Электроугли" />
                                <option value="Видное" />
                                <option value="Дзержинск" />
                                <option value="Долгопрудный" />
                                <option value="Домодедово" />
                                <option value="Королев" />
                                <option value="Железнодорожный" />
                                <option value="Жуковский" />
                                <option value="Зеленоград" />
                                <option value="Климовск" />
                            </datalist>
                        </InputGroup>
                        <Form.Label>Улица</Form.Label>
                        <InputGroup controlId="formBasicAddress">

                            <Form.Control
                                type="text"
                                placeholder="Название Улицы"
                                name='Ulica'
                                value={streetA}
                                onChange={(e) => setStreetA(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <Form.Label>Дом</Form.Label>
                        <InputGroup controlId="formBasicAddress">

                            <Form.Control
                                type="text"
                                inputMode="numeric"
                                name='Dom'
                                value={homeA}
                                onChange={(e) => setHomeA(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <Form.Label>Примечание к заказу</Form.Label>
                        <InputGroup>
                            <br />

                            <Form.Control
                                as="textarea"
                                name='Dopolnitelno'
                                aria-label="With textarea"
                                placeholder="примечание к вашему заказу"
                                value={otherA}
                                onChange={(e) => setOtherA(e.target.value)}

                            />
                        </InputGroup>
                        <InputGroup controlId="formBasicAddress" className='close'>
                            <Form.Control
                                type="text"
                                name='zakaz'
                                value={JSON.stringify({
                                    zakaz: encodeURIComponent(JSON.stringify(sendItems())),
                                    summa: totalPrice
                                })}
                                required
                            />
                        </InputGroup>
                        <hr />
                    </Form>
                    <Button variant="primary" type="submit" onClick={sendTelegram}>
                        Заказать
                    </Button>
                </div>
                <div className='basket-information'>
                    <h1>Детали доставки</h1>
                    <p>Свыше 15-и км. от <b>МКАД</b>, 1 км. - 15 рублей</p>
                    <h5>Оплата наличными или онлайн переводом.</h5><hr />
                    <div className='radios'>
                        <div>
                            <input type='radio' id='vmkad' name="delivery" value={450} onChange={handleRadioChange} />{" "}<label htmlFor="vmkad">Москва в пределах МКАД</label><span> - <b>450 Руб</b></span>
                        </div><br />
                        <div>
                            <input type='radio' id='zamkad' name="delivery" value={650} onChange={handleRadioChange} />{" "}<label htmlFor="zamkad">Москва за пределами МКАД</label><span> - <b>650 Руб</b></span>
                        </div><br />
                        <div>
                            <input type='radio' id='mo' name="delivery" value={850} onChange={handleRadioChange} />{" "}<label htmlFor="mo">Московская область</label><span> - <b>от 850 Руб</b></span>
                        </div>
                    </div><hr />
                    <h1 style={{ color: "green" }}>Стоимость товара: {isNaN(totalPrice) ? '-' : totalPrice.toString()} рублей</h1>
                    <h1 style={{ color: "green" }}>Стоимость доставки: {isNaN(selectedValue) ? '-' : selectedValue.toString()} рублей</h1>
                    <h1 style={{ color: "green" }}>Итого к оплате: {isNaN(totalPriceDel) ? '-' : totalPriceDel.toString()} рублей</h1>
                </div>

            </div>
        </div>
    )
}

export default Basket;






