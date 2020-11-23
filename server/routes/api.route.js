const express = require('express');
const utils = require('../utils/utils.js');
const { SECRET, TOKEN_LIFE } = require('../config/config.json');
const router = express.Router();
const passport = require('../config/passport.js');
const { 
  getUserController,
  registerController,
  loginController,
  updateController

} = require('../controllers/auth.controller');
const { 
  getFavorite,
  reactionFavorite,
  removeReaction

} = require('../controllers/favorite.controller');
const { 
  getBst,
  getBstById,
  addBst
} = require('../controllers/bst.controller');
const { 
  addCnbst,
  getCnbst,
  removeCnbst
} = require('../controllers/cnbst.controller');
const { deserializeUser } = require('../config/passport.js');
router.post('/register', registerController);
router.post('/login', passport.authenticate('local'), loginController);

const TokenCheckMiddleware = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      try {
        const decoded = await utils.verifyJwtToken(token, SECRET);
        req.decoded = decoded;
        next();
      } catch (err) {
        console.error(err);
        return res.status(401).json({
          message: 'Unauthorized access.',
        });
      }
    } else {
      console.log("null");
      return res.status(403).send({
        message: 'No token provided.',
      });
    }
  }
router.get('/favorites', getFavorite);
router.get('/bst', getBst);
router.get('/user', getUserController);

router.use(TokenCheckMiddleware);

router.post('/checkToken', (req,res) => {
    return res.json(req.decoded);
});
router.post('/user/update', updateController);

router.post('/favorites/reaction', reactionFavorite);
router.post('/favorites/remove-reaction', removeReaction);

router.get('/bst/get', getBstById);
router.post('/bst/add', addBst);

router.get('/cnbst', getCnbst);
router.post('/cnbst/remove', removeCnbst);
router.post('/cnbst/add', addCnbst);

module.exports = router;