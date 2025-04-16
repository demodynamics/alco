import Container from 'react-bootstrap/Container';
import './Header.css'
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Header() {

  const [isHeaderOpaque, setIsHeaderOpaque] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 100; // Adjust this threshold as needed

      if (scrollTop > threshold) {
        setIsHeaderOpaque(true);
      } else {
        setIsHeaderOpaque(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      className={isHeaderOpaque ? 'opaque' : ''}
      bg={!isHeaderOpaque ? 'primary' : ''}
      variant={isHeaderOpaque ? 'blue' : 'blue'}
    >
      <Container>
        <Navbar.Brand
          onClick={() => {
            navigate('/')
            scrollToTop()
          }}
        >Доставка Алкоголя</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href='/' onClick={() => {
              scrollToTop()
            }}>ГЛАВНАЯ</Nav.Link>
            <Nav.Link href='/category'>КАТЕГОРИИ</Nav.Link>
            <Nav.Link href='/contact'>КОНТАКТЫ</Nav.Link>
            <Nav.Link className='a_basket_icon_header' href='/basket' ><Icon.Cart4 className='basket_icon_header' /></Nav.Link>
          </Nav>

          <Nav>

            <div className='header_number'><a className='tel_number' href="tel:+74950155560">Круглосуточно: +7(495)01-555-60</a><Link onClick={() => window.open("https://t.me/alcodostavkamolnia_bot", '_blank')}><Icon.Telegram className="telegram_icon_header" /></Link> <p style={{ color: "white" }}>входящие звонки бесплатно</p></div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default Header;

