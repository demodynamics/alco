
import { Col } from 'react-bootstrap';
import './Catalog.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Catalog({ myRef }) {

    const navigate = useNavigate()
    const [white, setWhite] = useState(false)

    useEffect(() => {
        if (window.location.pathname === "/category") {
            setWhite(true)
        }

        return () => {
            setWhite(false)
        }
    }, [])

    const catalog = [
        {
            ru: "Водка",
            en: "vodka"
        },
        {
            ru: "Пиво",
            en: "beer"
        },
        {
            ru: "Виски",
            en: "whiskey"
        },
        {
            ru: "Коньяк",
            en: "cognac"
        },
        {
            ru: "Ликер",
            en: "liquor"
        },
        {
            ru: "Текила",
            en: "tequilla"
        },
        {
            ru: "Джин",
            en: "jin"
        },
        {
            ru: "Ром",
            en: "rom"
        },
        {
            ru: "Вино",
            en: "wine"
        },
        {
            ru: "Игристое Вино",
            en: "champagne"
        },
        {
            ru: "Вермут",
            en: "vermouth"
        },
        {
            ru: "Соки",
            en: "juice"
        },
        {
            ru: "Вода",
            en: "water"
        },
        {
            ru: "Снеки",
            en: "snacks"
        },
        {
            ru: "Сигареты",
            en: "ciggarettes"
        },
        {
            ru: "Табак и Кальян",
            en: "tobacandcalian"
        },
        {
            ru: "Стики",
            en: "sticks"
        },
        {
            ru: "Эл. Сигареты",
            en: "el-sig"
        },
        {
            ru: "Разное",
            en: "other"
        }
    ]


    return (
        <>
            <div className="catalog" ref={myRef} style={white ? { backgroundColor: "white" } : { backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                {
                    catalog.map((item, i) => {
                        return (
                            <Col className='catalog-item' key={i} onClick={() => navigate(`/category/${item.en}`)}>
                                <div className="cards">
                                    <img src={`/image/${item.en}.jpg`} alt=""></img>
                                    <div className="month" ></div>
                                    <button className="success"  >{item.ru} </button>
                                </div>
                            </Col>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Catalog;