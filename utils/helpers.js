export const getSizeObjectFromAProduct = (product, sizeId) => {
  let foundSizeObject = null;
  if (!product || !sizeId) { return null; }
  
  product.sizes.forEach((sizeObj) => {
    if (sizeObj._id === sizeId) {
      foundSizeObject = {...sizeObj};
    }
  });
  return foundSizeObject;
};

