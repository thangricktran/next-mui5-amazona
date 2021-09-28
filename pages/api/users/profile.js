import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from 'models/User';
import db from 'utils/db';
import { signToken, isAuth } from 'utils/auth';
import { onError } from 'utils/error';

const handler = nc({
  onError, 
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);

  if (user && bcrypt.compareSync(req.body.currentPassword, user.password)) {

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password)
      : user.password;
    await user.save();
    await db.disconnect();

    const token = signToken(user);
    //console.log("pages/api/users/profile.js aftersignToken(user) token:\n", token);
    return res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: 'Invalid email or current password' });
  }
});

export default handler;
