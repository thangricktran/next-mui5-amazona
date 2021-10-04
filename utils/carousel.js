const paginate = (itemsArray, itemsPerPage = 4) => {
  const numberOfPages = Math.ceil(itemsArray.length / itemsPerPage);

  const newItemsArray = Array.from({length: numberOfPages}, (_, index) => {
    const start = index * itemsPerPage;
    return itemsArray.slice(start, start + itemsPerPage);
  });

  return newItemsArray;
};

export const getAllowedSize = () => {
  return (window.innerWidth <= 591) ?  1 :
  (window.innerWidth <=  904) ? 2 :
  (window.innerWidth <=  1217) ? 3 : 4;
};
// export const getAllowedSize = () => {
//   return (window.innerWidth <= 600) ?  1 :
//   (window.innerWidth <=  900) ? 2 :
//   (window.innerWidth <=  1217) ? 3 : 4;
// };

export default paginate;
