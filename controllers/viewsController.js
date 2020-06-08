const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      'Your booking was successful....If your booking does not show up here immediatly please come back later';
  }
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  //1)Get tour data from collection
  const tours = await Tour.find();

  //2)Build Template

  //3)Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up as a user'
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

// exports.updateUserData = (req, res, next) => {
//   console.log(req.body);
// };
