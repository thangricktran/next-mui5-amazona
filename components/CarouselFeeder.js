import React, { useState, useEffect, useCallback } from 'react';
import paginateData from 'components/carousel/PaginateData';
import CarouselCard from 'components/carousel/CarouselCard';
import paginate, { getAllowedSize } from 'utils/carousel';
import useStyles from 'utils/styles';
import Carousel from 'react-material-ui-carousel';

function CarouselFeeder(props) {
  const classes = useStyles();
  const { featuredProducts } = props;
  const {loading, data, origData} = paginateData(featuredProducts, 4);
  const [page, setPage] = useState(0);
  const [featureProducts, setFeatureProducts] = useState([]);
  const [carouselData, setCarouselData] = useState(data);
  const [sizeAllowed, setSizeAllowed] = useState(getAllowedSize());
  const [prevSide, setPrevSide] = useState(0);
  const [continueSlider, setContinueSlider] = useState(true);

  const nextPage = useCallback(() => {
    setPage((oldPage) => {
      let nextPage = oldPage + 1;
      if (nextPage > carouselData.length - 1) {
        nextPage = 0;
      }
      return nextPage;
    });
  },[carouselData]);
  /* eslint-disable-next-line no-unused-vars */
  const prevPage = () => {
    setPage((oldPage) => {
      let prevPage = oldPage - 1;
      if (prevPage < 0) {
        prevPage = carouselData.length - 1;
      }
      return prevPage;
    });
  };
  /* eslint-disable-next-line */
  const handlePage = (index) => {
    setPage(index);
  };
  const handleOnMouseOverOut = (boolVal) => {
    (boolVal) ? setContinueSlider(true) : setContinueSlider(false);
  };

  useEffect(() => {
    function handleResize() {
      setSizeAllowed(() => {
        return getAllowedSize();
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sizeAllowed]);
  useEffect(() => {
    if (loading) return ;
    if (sizeAllowed !== prevSide) {
      const size = getAllowedSize();
      setSizeAllowed(() => { return size; });
      setPrevSide(() => { return size; });
      setCarouselData(paginate(origData, sizeAllowed));
    }
    setFeatureProducts(carouselData[page]);
  },[loading, page, sizeAllowed, prevSide, carouselData, origData]);
  useEffect(() => {
    let pageSlider = null;
    if (continueSlider) {
      pageSlider = setTimeout(() => {
        nextPage();
      }, 9000);
      return () => {
        clearTimeout(pageSlider);
      };
    } else {
      if (pageSlider) clearTimeout(pageSlider);
    }
  }, [page, continueSlider, nextPage]);

  return (    
    <Carousel className={classes.carbanner} animation="slide" 
      interval={6500} timeout={600}
      indicatorContainerProps={{
        style: {
          width: '100%',
          // width: '90vw',
          maxWidth: '1170px',
          marginTop: '10px',
          display: 'grid',
          gap: '.5rem',
          gridAutoFlow: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden'
        }
      }}      
    >
      {carouselData.map((item, index) => {
        return (
          <div className="carousefeederitem" key={index}
              onMouseOver={() => {handleOnMouseOverOut(false)}}
              onMouseOut={() => {handleOnMouseOverOut(true)}}
          >
            {(index === page) ?
              featureProducts && featureProducts.length > 0 && (featureProducts.map((feature) => {
                const cardProps = {
                  featuredImage: feature.featuredImage,
                  slug: feature.slug,
                  name: feature.name
                };
                return <CarouselCard key={feature._id} {...cardProps} />
              })) :
              (item.map((feature) => {
                const cardProps = {
                  featuredImage: feature.featuredImage,
                  slug: feature.slug,
                  name: feature.name
                };
                return <CarouselCard key={feature._id} {...cardProps} />
              }))
            }
          </div>
        );
      })}
    </Carousel>

   );
}

export default CarouselFeeder;
