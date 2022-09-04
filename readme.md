<h1 align="center">
  <br>
  <a href="https://lakshman-natours.herokuapp.com/"><img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/public/img/logo-long.png" alt="SkyTrip" width="400"></a>
  <br>
  <br>
</h1>

<h4 align="center">Built using modern technologies: node.js, express, mongoDB, mongoose</h4>
<h4 align="center">Together with Yuqi Shi</h4>

 <p align="center">
 <a href="#website">Website</a> •
  <a href="#build-with">Build With</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#installation">Installation</a> •
  <a href="#future-updates">Future Updates</a> • 
  <a href="#reference">Reference</a>
</p>

## Website
👉 : https://skytrip-app.herokuapp.com/

<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/homepage.jpg" alt="login" width="800">
</div>

## Build With

* __Frontend__: HTML, CSS, JavaScript, Pug
* __Backend__: NodeJS, Express, RESTful API
* __Database__: MongoDB, Mongoose, Compass
* __Authentication & Authorization__: JSON Web Token
* __Cloud Platform__: Heroku, Git, Atlas
* __Other Tools__: Postman, [Stripe](https://stripe.com/), [Leaflet](https://leafletjs.com/reference.html),  [Mailtrap](https://mailtrap.io/) & [SendInBlue](https://www.sendinblue.com/)

## How To Use

### Sign Up & Log In
* Sign up
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/signup.jpg" alt="signup" width="800">
</div>

When you sign up, you will receive an active account email first. Then a welcome email after activating your account.

<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/activeaccount_email.png" alt="activate_email" width="500">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/welcome_email.png" alt="welcome_email" width="500">
</div>


* Log in

You can log in with laura@example.com and password test1234

<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/login.png" alt="login" width="800">
</div>

### Book a Trip
* Our home page
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/overview_vedio.gif" alt="overview_vedio" width="800">
</div>

* Check for trip details
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/tripdetails.gif" alt="tripdetails" width="800">
</div>

* Book a trip and ckeckout
```
Test mood card details:
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 02 / 23
  - CVV: 222
 ```
 <div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/checkout.gif" alt="checkout" width="800">
</div>

* Finished!

### Manage your Account
* Update your own username, profile photo, email and password.

User Account:
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/user.jpg" alt="login" width="500">
</div>

Admin Account:
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/admin.jpg" alt="login" width="500">
</div>

Change new photo in user account:
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/changephoto.gif" alt="changephoto" width="800">
</div>

* Check the trip you have booked in "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/booking.png" alt="booking" width="800">
</div>
  
* Write review for booked trip
<div align="center">
  <img src="https://github.com/Yuqi-Shi/SkyTrip/blob/main/readme_img/review.gif" alt="review" width="800">
</div>

## Installation
### Environment variables
Database:
```
NODE_ENV=
PORT=
DATABASE=
DATABASE_PASSWORD=
```
JWT configuration:
```
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=
```
Mailtrap:
```
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_FROM=
```
SendInBlue:
```
SENDINBLUE_API=
SENDINBLUE_USERNAME=
SENDINBLUE_PASSWORD=
```
Stripe:
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET
```
### Install steps
```
$ npm install
create config.env and set your environment variables
$ npm start
$ npm run dev (for development)
$ npm run start:prod (for production)
```

## Future Updates
* __Complete all the remaining pages on user account page__
* __Implement "like trip" functionality with fav trip page__
* __Keep user logged in with refresh tokens__
* __Design the function of filting and sorting trips on overview page:__ already implemented on backend using API.
* __Two-factor authentication:__ users are granted access to SkyTrip Website only after successfully presenting the randomly generated and frequently changing codes send to their email addresses.
* __Improve tour dates:__ add a participants and soldOut field to each date. When the user wants to book a specific trip, he/she needs to check if trip on the selected date is still available.

## Reference

* Modified from the Natours project by Jonas' Udemy course: [Node.js, Express, MongoDB & More: The Complete Bootcamp 2022](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)
