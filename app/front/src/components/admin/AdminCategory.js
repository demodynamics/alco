import { useEffect } from "react"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "./admin.css";
function AdminCategory() {
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }

    }, [navigate])

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

    function logOut() {
        localStorage.removeItem('token')
        navigate('/')

    }


    return (
        <div className='admin_page'>
            <Button variant="primary" onClick={logOut}>ВЫХОД</Button><br />
            {
                catalog.map((item, i) => {
                    return (

                        <Button key={i} className='admin_page__item__name' onClick={() => navigate(`/nimda/category/${item.en}`)}>{item.ru}</Button>
                    )
                })
            }
        </div>
    )
}
export default AdminCategory;