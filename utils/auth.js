import jwt from 'jsonwebtoken';

const signToken = (user) => {
  // console.log("utils/auth.js signToken() user: \n", user);
  return jwt.sign(
    { 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin, 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

const isAuth = async (req, res, next) => {
  // console.log("utils/auth.js isAuth() req.user \n", req.user);
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = (authorization.slice(7, authorization.length)).trim();
    // console.log("utils/auth.js isAuth() token: \n", `ttt${token}ttt`);
    // console.log("utils/auth.js isAuth() process.env.JWT_SECRET: \n", `ttt${process.env.JWT_SECRET}ttt`);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
      } else {
        req.user = decode;
        // console.log("utils/auth.js isAuth() req.user: \n", `ttt${req.user}ttt`);
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'User token is required.' });
  }
};
const isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'User is not admin' });
  }
};

export { signToken, isAuth, isAdmin };
