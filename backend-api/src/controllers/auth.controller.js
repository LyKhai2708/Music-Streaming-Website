const usersService = require('../services/user.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');
const  bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  console.log(req.body.email);
  const { email, password } = req.body;
  const secret = process.env.secret;
  try {
    const user = await usersService.login(email);
    if (!user) {
      return next(new ApiError(404, 'Email không chính xác'));
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return next(new ApiError(401, 'Mật khẩu không chính xác vui lòng kiểm tra lại'));
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      secret,
      { expiresIn: '1h' }
    );

    return res.json(JSend.success({ user: user, token: token }));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'An error occurred while logging in'));
  }
}


module.exports = {
    login
  };