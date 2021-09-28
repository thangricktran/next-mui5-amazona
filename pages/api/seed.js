// import Product from "models/Product";
// import User from "models/User";
import nc from "next-connect";
// import data from "utils/data";
import db from "utils/db";
import { isAdmin, isAuth } from 'utils/auth';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  // await Product.deleteMany();
  // await Product.insertMany(data.products);
/*
  data.products.forEach(async (pData) => {    
    try {
      const pModel = new Product(pData); 
      // DON'T NEED to run lines below, it will produce duplicate sizes object 
      // pData.sizes.forEach(pSize => pModel.sizes.push({...pSize}));
      await pModel.save();      
    } catch (error) {
      console.log("try/catch error", error);
    }
  });
*/  
  // await User.deleteMany();
  // await User.insertMany(data.users);
  await db.disconnect();
  // await res.json(products);
  await res.send({message: 'seeded successfully.'});
  // await res.send({message: 'No data specify to be seeded right now.'});
});


export default handler;