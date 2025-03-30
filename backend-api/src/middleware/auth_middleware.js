const { expressjwt } = require('express-jwt');

function authJwtmiddleware() {
    const secret = process.env.secret;
    return expressjwt({
        secret: secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            { url: '/api/v1/users', methods: ['POST'] }
        ]
    });
    
}

function authorizeRoles(roles) {
    return (req, res, next) => {
      const userRole = req.auth.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
      }
      next();
    };
  }
module.exports = 
{ authJwtmiddleware, authorizeRoles};