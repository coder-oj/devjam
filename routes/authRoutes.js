const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/login', authController.login_get);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

router.get('/adminlogin', authController.adminlogin_get);
router.post('/adminlogin', authController.adminlogin_post);
router.get('/adminsignup', authController.adminsignup_get);
router.post('/adminsignup', authController.adminsignup_post);

router.get('/logout', authController.logout_get);
router.get('/adminlogout', authController.adminlogout_get);

module.exports = router;