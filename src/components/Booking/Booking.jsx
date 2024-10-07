import React, { useState, useContext } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const Booking = ({ tour, avgRating }) => {
   const { price, reviews, id } = tour; // Ensure you have the package ID
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const [booking, setBooking] = useState({
      user: user && user._id, // Use user ID from the authenticated user
      package: id, // Link the booking to the package by ID
      number_of_people: 1, // Default number of people
      booking_date: '', // Booking date
      fullname:'',
      phone:''
   });

   const handleChange = (e) => {
      const { id, value } = e.target;
      setBooking((prev) => ({ ...prev, [id]: value }));
   };

   const serviceFee = 10;
   const totalAmount = Number(price) * Number(booking.number_of_people) + Number(serviceFee);

   const handleClick = async (e) => {
      e.preventDefault();

      try {
         if (!user) {
            return alert('Please sign in');
         }

         
         const res = await fetch(`${BASE_URL}/haha/bookings/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(booking),
         });

         const result = await res.json();

         if (!res.ok) {
            // Check for specific error messages or status codes
            if (res.status === 401) {
                // Unauthorized
                return alert('You must be logged in to make a booking.');
            } else if (res.status === 400) {
               
               // Bad Request
               return alert(result.error || 'Bad request. Please check your input.');
           } 
             else if (res.status === 500) {
                // Internal Server Error
                return alert('There was a problem with the server. Please try again later.');
            } else {
                // General error message
                return alert(result.error || 'Booking failed. Please try again.');
            }
        }
         navigate('/thank-you');
      } catch (error) {
         alert('An error occurred: ' + error.message);
      }
   };

   return (
      <div className='booking'>
         <div className="booking__top d-flex align-items-center justify-content-between">
            <h3>${price} <span>/per person</span></h3>
            <span className="tour__rating d-flex align-items-center">
               <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i>
               {avgRating === 0 ? null : avgRating} ({reviews?.length})
            </span>
         </div>

         {/* =============== BOOKING FORM START ============== */}
         <div className="booking__form">
            <h5>Information</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
               <FormGroup>
                  <input type="text" placeholder='Full Name' id='fullName' required onChange={handleChange} />
               </FormGroup>
               <FormGroup>
                  <input type="tel" placeholder='Phone' id='phone' required onChange={handleChange} />
               </FormGroup>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <input type="date" placeholder='' id='booking_date' required onChange={handleChange} />
                  <input type="number" placeholder='Guest' id='number_of_people' required onChange={handleChange} />
               </FormGroup>
            </Form>
         </div>
         {/* =============== BOOKING FORM END ================ */}

         {/* =============== BOOKING BOTTOM ================ */}
         <div className="booking__bottom">
            <ListGroup>
               <ListGroupItem className='border-0 px-0'>
                  <h5 className='d-flex align-items-center gap-1'>${price} <i className='ri-close-line'></i> 1 person</h5>
                  <span>${price}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0'>
                  <h5>Service charge</h5>
                  <span>${serviceFee}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0 total'>
                  <h5>Total</h5>
                  <span>${totalAmount}</span>
               </ListGroupItem>
            </ListGroup>

            <Button className='btn primary__btn w-100 mt-4' type='submit' onClick={handleClick}>Book Now</Button>
         </div>
      </div>
   );
};

export default Booking;
