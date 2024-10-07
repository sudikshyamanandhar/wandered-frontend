import React, { useState, useRef, useEffect, useContext } from 'react';
import '../styles/tour-details.css';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { useParams } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';
import Booking from '../components/Booking/Booking';
import Newsletter from '../shared/Newsletter';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';

const TourDetails = () => {
    const { id } = useParams(); // Get the package ID from the URL
    const reviewMsgRef = useRef(''); // For handling review input
    const [tourRating, setTourRating] = useState(null); // To track selected rating
    const { user } = useContext(AuthContext); // To get user context

    // Fetch the package data from the backend
    const { data: packageData, loading: packageLoading, error: packageError } = useFetch(`${BASE_URL}/package/package/${id}`);

    // Fetch the reviews for the specific package
    const { data: reviews, loading: reviewsLoading, error: reviewsError } = useFetch(`${BASE_URL}/package/reviews/${id}`);

    // Destructure package data
    const { image: photo, name: title, description: desc, price, location: address, duration, availability } = packageData || {};

    // Calculate average rating from the reviews
    const { totalRating, avgRating } = calculateAvgRating(reviews);

    const options = { day: 'numeric', month: 'long', year: 'numeric' }; // Date options for formatting

    const submitHandler = async e => {
        e.preventDefault();
        const reviewText = reviewMsgRef.current.value;

        try {
            if (!user) {
                alert('Please sign in');
                return;
            }
            const reviewObj = {
                username: user.username,
                reviewText,
                rating: tourRating,
            };

            const res = await fetch(`${BASE_URL}/package/reviews/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(reviewObj),
            });

            const result = await res.json();
            if (!res.ok) {
                return alert(result.message);
            }
            alert(result.message);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [packageData]);

    return (
        <section>
            <Container>
                {packageLoading && <h4 className='text-center pt-5'>LOADING...</h4>}
                {packageError && <h4 className='text-center pt-5'>{packageError}</h4>}
                {
                    !packageLoading && !packageError &&
                    <Row>
                        <Col lg='8'>
                            <div className="tour__content">
                                <img src={photo} alt={title} />

                                <div className="tour__info">
                                    <h2>{title}</h2>
                                    <div className="d-flex align-items-center gap-5">
                                        <span className="tour__rating d-flex align-items-center gap-1">
                                            <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i> {avgRating === 0 ? null : avgRating}
                                            {avgRating === 0 ? 'Not rated' : <span>({reviews?.length})</span>}
                                        </span>

                                        <span><i className='ri-map-pin-fill'></i> {address}</span>
                                    </div>

                                    <div className="tour__extra-details">
                                        <span><i className='ri-map-pin-2-line'></i> Duration: {duration} days</span>
                                        <span><i className='ri-money-dollar-circle-line'></i> ${price}/ per person</span>
                                        <span><i className='ri-check-line'></i> {availability ? 'Available' : 'Not Available'}</span>
                                    </div>
                                    <h5>Description</h5>
                                    <p>{desc}</p>
                                </div>

                                {/* ============ REVIEWS SECTION START ============ */}
                                <div className="tour__reviews mt-4">
                                    <h4>Reviews ({reviews?.length} reviews)</h4>

                                    <Form onSubmit={submitHandler}>
                                        <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} onClick={() => setTourRating(star)}>
                                                    {star} <i className='ri-star-s-fill'></i>
                                                </span>
                                            ))}
                                        </div>

                                        <div className="review__input">
                                            <input type="text" ref={reviewMsgRef} placeholder='Share your thoughts' required />
                                            <button className='btn primary__btn text-white' type='submit'>
                                                Submit
                                            </button>
                                        </div>
                                    </Form>

                                    <ListGroup className='user__reviews'>
                                        {reviewsLoading && <h5>Loading reviews...</h5>}
                                        {reviewsError && <h5>{reviewsError}</h5>}
                                        {
                                            reviews?.map(review => (
                                                <div className="review__item" key={review.id}>
                                                    <img src={avatar} alt="" />

                                                    <div className="w-100">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h5>{review.username}</h5>
                                                                <p>{new Date(review.date_added).toLocaleDateString('en-US', options)}</p>
                                                            </div>

                                                            <span className='d-flex align-items-center'>
                                                                {review.rating}<i className='ri-star-s-fill'></i>
                                                            </span>
                                                        </div>

                                                        <h6>{review.comment}</h6>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </ListGroup>
                                </div>
                                {/* ============ REVIEWS SECTION END ============== */}
                            </div>
                        </Col>

                        <Col lg='4'>
                            <Booking tour={packageData} avgRating={avgRating} />
                        </Col>
                    </Row>
                }
            </Container>
            <Newsletter />
        </section>
    );
};

export default TourDetails;
