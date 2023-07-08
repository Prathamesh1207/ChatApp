const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router=express.Router();

router.route('/').post(registerUser).get(protect,allUsers);                  // api after the api/user in server.js
router.post('/login',authUser)                           //2 ways 4

module.exports=router;