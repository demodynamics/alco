import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/header/Header';
import Router from './routing/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [isOpen, setIsOpen] = useState(true);

  const handleCloseModal = () => {
    setIsOpen(false);
    localStorage.setItem('age', isOpen)
  };

  return (
    <>
      {
        !localStorage.getItem('age') ?

          <div className="modal-18" style={!isOpen ? { display: "none" } : {}}>
            <div className="modal-content-18">
              <h2>Подтверждение возраста</h2>
              <p>Пожалуйста, подтвердите, что вам больше 18 лет.</p>
              <div className="modal-actions-18">
                <button>НЕТ</button>
                <button onClick={handleCloseModal}>ДА</button>
              </div>
            </div>
          </div>
          : <>
            <Header />
            <Router />
            <ToastContainer
              position="top-left"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </>
      }
    </>
  );
}

export default App;
