import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import './admin.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Admin() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()


    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/nimda/category')
        }
    }, [navigate])



    async function signInAdmin(e) {
        e.preventDefault()
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/;
        const isValidPassword = passwordRegex.test(password);
        if (!isValidPassword) {
            toast.warning("Пароль должен содержать латинские символы A-Z (в верхнем и нижнем регистре), цифры 0-9 и быть длиной не менее 8 символов.")
            return
        }
        try {
            const admin = await axios.post('http://localhost:5003/api/admin/login', {
                login,
                password
            })
            if (admin.data.token) {
                localStorage.setItem('token', admin.data.token)
                navigate('/nimda/category')
            }

            if (admin.status === 201) {
                navigate('/nimda/category')
            }
        } catch (e) {
            if (e.response.data.message === "dont") {
                toast.warning("Таково админа нету")
            }

            if (e.response.data.message === "invalidpassword") {
                toast.warning("Неверный пароль")
            }
        }
    }

    return (

        <div className="admin_root">
            <div className="form_admin">
                <Form onSubmit={(e) => signInAdmin(e)} >
                    <Form.Group className="mb-3">
                        <Form.Label>Логин</Form.Label>
                        <Form.Control type="text" placeholder="Enter Login" required onChange={(e) => setLogin(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Войти
                    </Button>
                </Form>
            </div>
        </div>
    )


}

export default Admin;