import { useEffect } from 'react';
import axios from 'axios';

function NotFound() {

    async function notFoundGetter() {
	try {
	   await axios.get('/api/list/not-found');
	}catch(e) {
	  console.log(e)
	}
    }

    useEffect(() => {
	notFoundGetter()
    }, [])

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center" style={{ backgroundColor: "white" }}>
                <h1 className="display-1 fw-bold" style={{ color: "red" }}>404</h1>
                <p className="fs-3">Not found</p>
                <p className="lead">
                    Перейдите на главную страницу
                </p>
            </div>
        </div>
    );
}

export default NotFound;
