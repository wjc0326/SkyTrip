/* eslint-disable */
/* global Stripe */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51Ld4uoD1GqQWWhwRGnLuPGmXovaNOejjzfPnzX0WCHs64o7ogdC6SnkY8mhUh3F9nM0QHUlVqjX6HNkpVQsl0Yjt00qf1znvg8'
  );
  try {
    // 1) Get checkout-session from API
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log('session:', session);

    // 2) Create checkout form & charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
