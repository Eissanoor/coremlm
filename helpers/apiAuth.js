import HttpStatus from 'http-status';
import jwtHelper from '../helpers/jwt_Token.js';

const checkAuthentication = async (req, res, next) => {
  try {
    const token = getToken(req) // function to retrieve the token from header|query|body

    let verifiedToken = await jwtHelper.verifyToken(token); // Check whether JWT token is valid or not 
    // if verify token is valid then save the token in req object
    req.token = verifiedToken;
    return next();

  } catch (error) {
    return res.status(401).json({ // If JWT token is not valid, return error message
      message: 'Invalid Token.',
      https: HttpStatus.UNAUTHORIZED,
    });
  }
};
// check roles
const checkRole = (roles) => {
  return (req, res, next) => {
    const assignedRoles = req?.token?.assignedRoles;
    console.log(assignedRoles)
    const hasRole = roles.some(role => assignedRoles?.includes(role));
    if (hasRole) {
      return next();
    } else {
      return res.status(401).json({
        message: 'Unauthorized.',
        https: HttpStatus.UNAUTHORIZED,
      });
    }
  };
};
const generateToken = async (req, res, next) => {
  try {
    let token = await jwtHelper.createToken()
    return res.json({
      message: 'token',
      token: token,
    });
  } catch (error) {
    return res.status(500).json({

      message: 'Invalid Token.',
      https: HttpStatus.UNAUTHORIZED,
    });
  }
};

const getToken = (req) => {
  let token = '';
  let authorization = req.headers.authorization || req.headers['authorization'] || req.query.token;
  // accepts toekn from browser cookies as well 
  if (req.cookies && req.cookies.token) {
    authorization = req.cookies.token;
  }
  console.log("authorization ", authorization)
  if (!authorization) {
    throw new Error('Token is not provided.');
  }

  const parts = authorization.split(' ');
  // console.log("parts ",parts.length);
  if (parts.length === 2) {
    if (!(/^Bearer$/i.test(parts[0]))) {
      throw new Error('Token is not properly formatted.');
    }
    token = parts[1];
  }
  else {
    token = authorization;
  }

  return token;
}
export {
  checkAuthentication,
  generateToken,
  checkRole

};
// checkAuthentication()