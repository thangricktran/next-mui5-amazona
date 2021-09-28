import { useState, useEffect, useCallback } from 'react';
import paginate from 'utils/carousel';
// const url = process.env.NEXT_APP_FEATURED_PRODUCTIONS_URL;

const PaginateData = (products, size=4) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);

  const getProducts = useCallback((products) => {
    const data = products;
    setOrigData(data);
    setData(paginate(data, size));
    setLoading(false);
  }, [size]);

  useEffect(() => {
    getProducts(products);
  }, [size, products, getProducts]);
  
  return { loading, data, origData };

};

export default PaginateData;
