import React, { useEffect, useRef, useContext, useState } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaDollarSign, FaPoundSign } from 'react-icons/fa'; // Importing icons
import Logo from '../../assets/images/logo1.png';
import './header.css';
import { AuthContext } from '../../context/AuthContext';

const nav__links = [
   {
      path: '/home',
      display: 'Home'
   },
   {
      path: '/about',
      display: 'Packages'
   },
   {
      path: '/tours',
      display: 'Destinations'
   },
];

const Header = () => {
   const headerRef = useRef(null);
   const menuRef = useRef(null);
   const navigate = useNavigate();
   const { user, dispatch } = useContext(AuthContext);
   
   // Currency toggle state
   const [currency, setCurrency] = useState('USD'); // Default to USD

   const logout = () => {
      dispatch({ type: 'LOGOUT' });
      navigate('/');
   };

   const stickyHeaderFunc = () => {
      window.addEventListener('scroll', () => {
         if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            headerRef.current.classList.add('sticky__header');
         } else {
            headerRef.current.classList.remove('sticky__header');
         }
      });
   };

   useEffect(() => {
      stickyHeaderFunc();
      return () => window.removeEventListener('scroll', stickyHeaderFunc);
   }, []);

   const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

   // Toggle currency between USD and GBP
   const toggleCurrency = () => {
      setCurrency(prevCurrency => prevCurrency === 'USD' ? 'GBP' : 'USD');
   };

   return (
      <header className='header' ref={headerRef}>
         <Container>
            <Row>
               <div className="nav__wrapper d-flex align-items-center justify-content-between">
                  {/* ========== LOGO ========== */}
                  <div className="logo">
                     <img src={Logo} alt="Logo" />
                  </div>
                  {/* ========================== */}

                  {/* ========== MENU START ========== */}
                  <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                     <ul className="menu d-flex align-items-center gap-5">
                        {nav__links.map((item, index) => (
                           <li className="nav__item" key={index}>
                              <NavLink to={item.path} className={navClass => navClass.isActive ? 'active__link' : ''}>{item.display}</NavLink>
                           </li>
                        ))}
                     </ul>
                  </div>
                  {/* ================================ */}

                  <div className="nav__right d-flex align-items-center gap-4">
                     <div className="nav__icons d-flex align-items-center gap-3">
                        {/* Wishlist Icon */}
                        <span className="wishlist__icon">
                           <FaHeart size={24} />
                        </span>
                        
                        {/* Currency Change Icon - toggles between Dollar and Pound */}
                        <span className="currency__icon" onClick={toggleCurrency} style={{ cursor: 'pointer' }}>
                           {currency === 'USD' ? <FaDollarSign size={24} /> : <FaPoundSign size={24} />}
                        </span>
                     </div>

                     <div className="nav__btns d-flex align-items-center gap-2">
                        {user ? (
                           <>
                              <h5 className='mb-0'>{user.username}</h5>
                              <Button className='btn btn-dark' onClick={logout}>Logout</Button>
                           </>
                        ) : (
                           <>
                              <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                              <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>
                           </>
                        )}
                     </div>

                     <span className="mobile__menu" onClick={toggleMenu}>
                        <i className="ri-menu-line"></i>
                     </span>
                  </div>
               </div>
            </Row>
         </Container>
      </header>
   );
};

export default Header;
