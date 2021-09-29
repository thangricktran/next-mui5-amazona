import React, { useState, useEffect, useCallback } from 'react';
import paginateData from 'components/carousel/PaginateData';
import CarouselCard from 'components/carousel/CarouselCard';
import paginate, { getAllowedSize } from 'utils/carousel';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

function CarouselMain(props) {
  const useStyles = makeStyles(() => ({
    carousel: {
      // border: '3px solid green',
      width: '100%',
      maxWidth: '1170px',
      margin: '.5rem auto 0px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    itemsWrapper: {
      // border: '3px solid blue',
      position: 'relative',
      width: '100%',
      height: '330px',
    },

    container: {
      // border: '3px solid red',
      position: 'absolute',
      display: 'grid',
      gap: '1rem',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gridAutoFlow: 'column',
      // border: '3px solid blue',
      margin: '10px auto 2rem',
      opacity: 0,
      // -webkit-transition: all 4s ease;
      // -moz-transition: all 4s ease;
      // -ms-transition: all 4s ease;
      // -o-transition: all 4s ease;
      webkitTransition: 'all 0.3s linear',
      mozTransition: 'all 0.3s linear',
      msTransition: 'all 0.3s linear',
      oTransition: 'all 0.3s linear',
      transition: 'all 0.3s linear',
      '&.activeSlide': {
        opacity: 1,
        webkitTransform: 'translateX(0)',
        mozTransform: 'translateX(0)',
        msTransform: 'translateX(0)',
        oTransform: 'translateX(0)',
        transform: 'translateX(0)',
      },
      '&.lastSlide': {
        webkitTransform: 'translateX(-100%)',
        mozTransform: 'translateX(-100%)',
        msTransform: 'translateX(-100%)',
        oTransform: 'translateX(-100%)',
        transform: 'translateX(-100%)',
      },
      '&.nextSlide': {
        webkitTransform: 'translateX(100%)',
        mozTransform: 'translateX(100%)',
        msTransform: 'translateX(100%)',
        oTransform: 'translateX(100%)',
        transform: 'translateX(100%)',
      },
    //   ex. ["@media (min-height:800px)"]: { marginTop: 10 }
    //   '@media (min-width: 576px)' : {
    //  ["@media screen and (min-width:576px)"]: {
    //     'grid-template-columns': 'repeat(auto-fill, minmax(250px, 1fr))',
    //   },
    },

    // @media screen and (min-width: 775px) {
    //   .btn-container {
    //     margin: 0 auto;
    //     max-width: 700px;
    //   }
    // }
    btnContainer: {
      // border: '3px solid purple',
      position: 'absolute',
      display: 'flex',
      top: '100%',
      left: '50%',
      webkitTransform: 'translate(-50%, -50%)',
      mozTransform: 'translate(-50%, -50%)',
      msTransform: 'translate(-50%, -50%)',
      oTransform: 'translate(-50%, -50%)',
      transform: 'translate(-50%, -50%)',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      ["@media screen and (min-width: 775px)"]: {
        margin: '0 auto',
        maxWidth: '700px',
      },
    },

    pageBtn: {
      width: '2rem',
      height: '2rem',
      background: 'hsl(205, 90%, 76%)',
      borderColor: 'transparent',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '0.5rem',
      webkitTransition: 'all 0.3s linear',
      mozTransition: 'all 0.3s linear',
      msTransition: 'all 0.3s linear',
      oTransition: 'all 0.3s linear',
      transition: 'all 0.3s linear',
      outline: 'none',
    },
    prevBtn: {
      background: 'transparent',
      borderColor: 'transparent',
      color: '#D4AF37',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      letterSpacing: '0.1rem',
      margin: '0.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      outline: 'none',
    },
    nextBtn: {
      background: 'transparent',
      borderColor: 'transparent',
      color: '#D4AF37',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      letterSpacing: '0.1rem',
      margin: '0.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      outline: 'none',
    },
  }));
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
    <div style={{marginTop: '1.5rem'}}>
      <div className={classes.carousel}>
        <div className={classes.itemsWrapper}>
          {carouselData.map((item, index) => {
            let position = 'nextSlide';
            if (index === page) {
              position = 'activeSlide';
            }
            if (
              index === page - 1 ||
              (page === 0 && index === carouselData.length - 1)
            ) {
              position = 'lastSlide';
            }
            return (
              <div className={`${classes.container} ${position}`} key={index}
                  onMouseOver={() => {handleOnMouseOverOut(false)}}
                  onMouseOut={() => {handleOnMouseOverOut(true)}}
                  // onMouseEnter={() => {handleOnMouseOverOut(false)}}
                  // onMouseLeave={() => {handleOnMouseOverOut(true)}}
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
        </div>
        {!loading && (
          <div className={classes.btnContainer}>
            <Button variant="outlined" size="small" className={classes.prevBtn} onClick={prevPage}>
              prev
            </Button>
            {/*carouselData.map((item, index) => {
              return (
                <button
                  key={index}
                  className={`page-btn ${index === page ? 'active-btn' : null}`}
                  onClick={() => handlePage(index)}
                >
                  {index + 1}
                </button>
              );
            })*/}
          <Button variant="outlined" size="small" className={classes.nextBtn} onClick={nextPage}>
             next
           </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarouselMain;
