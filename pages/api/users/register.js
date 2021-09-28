import User from "models/User";
import nc from "next-connect";
import db from "utils/db";
import bcrypt from 'bcryptjs';
import { signToken } from "utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });

  try {
    const user = await newUser.save();
    await db.disconnect();

    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });    
  } catch (error) {
    // await db.disconnect();
    return res.status(400).send({ message: error.message });
  }
});


export default handler;