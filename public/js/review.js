/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tourId, review, rating) => {
  try {
    const tour = tourId;
    const url = '/api/v1/reviews';
    const res = await axios({
      method: 'POST',
      url,
      data: {
        tour,
        rating,
        review,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review created Successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
