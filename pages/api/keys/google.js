// pages/api/keys/google.js
import nc from "next-connect";
import { isAuth } from "utils/auth";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await res.send(process.env.GOOGLE_API_KEY || 'nokey');
});

export default handler;
