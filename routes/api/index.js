const router = require('express').Router();
const thoughtRoute = require('./Thought-route');
const userRoute = require('./User-route');

router.use('/Thought', thoughtRoute);
router.use('/User', userRoute);

module.exports = router;
