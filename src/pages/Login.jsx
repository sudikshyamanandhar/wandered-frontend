import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../assets/images/user.png';
import logo from '../assets/images/wann.png';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';

const Login = () => {
   const [credentials, setCredentials] = useState({
      username: '',
      password: ''
   });

   const { dispatch } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleChange = (e) => {
      setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
   };

   const handleClick = async (e) => {
      e.preventDefault();

      dispatch({ type: 'LOGIN_START' });

      try {
         const res = await fetch(`${BASE_URL}/user/login/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(credentials)
         });

         const result = await res.json();

         if (!res.ok) {
            // Use 'error' based on your Django response structure
            alert(result.error || 'Something went wrong!');
            dispatch({ type: "LOGIN_FAILURE", payload: result.error || 'Login failed.' });
            return;
         }

         // If the result contains success data, show it
        console.log("Login successful:", result);
        alert('Login successful!');  // Notify the user
         // Assuming the token is directly returned
         dispatch({ type: "LOGIN_SUCCESS", payload: result.token });
         navigate('/home');
      } catch (err) {
         dispatch({ type: "LOGIN_FAILURE", payload: err.message });
         alert('An error occurred while logging in.');
      }
   };

   return (
      <section>
         <Container>
            <Row>
               <Col lg='8' className='m-auto'>
                  <div className="login__container d-flex justify-content-between">
                     <div className="login__img">
                        <img src={logo} alt="" />
                     </div>

                     <div className="login__form">
                        <div className="user">
                           <img src={userIcon} alt="" />
                        </div>
                        <h2>Login</h2>

                        <Form onSubmit={handleClick}>
                           <FormGroup>
                              <input type="text" placeholder='Username' id='username' onChange={handleChange} required />
                           </FormGroup>
                           <FormGroup>
                              <input type="password" placeholder='Password' id='password' onChange={handleChange} required />
                           </FormGroup>
                           <Button className='btn secondary__btn auth__btn' type='submit'>Login</Button>
                        </Form>
                        <p>Don't have an account? <Link to='/register'>Create</Link></p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   );
};

export default Login;
