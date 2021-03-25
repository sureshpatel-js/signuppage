const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
  .route("/")
  .get(userController.protect, userController.getUser)
  .post( userController.protect, userController.deleteField)
  .patch(userController.protect, userController.updateUser);

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
/*Here in update password we first  run middleware to velidate token 
and then we run update password function.
 */
router.post(
  "/updatepassword",
  userController.protect,
  userController.updatePassword
);

module.exports = router;
