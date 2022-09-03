/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tourId, review, rating) => {
  try {
    const tour = tourId;
    const url = 'http://localhost:8000/api/v1/reviews';
    const res = await axios({
      method: 'POST',
      url,
      data: {
        tour,
        rating,
        review,
      },
    });

    console.log('status: ', res.data.status);
    if (res.data.status === 'success') {
      console.log('success');
      showAlert('success', 'Review created Successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
