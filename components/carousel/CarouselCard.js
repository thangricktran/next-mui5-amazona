import * as React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import MuiNextLink from "components/MuiNextLink";
// import useStyles from 'utils/styles';
import { makeStyles } from '@material-ui/styles';

const CarouselCard = ({  featuredImage, slug, name  }) => {
  const useStyles = makeStyles(() => ({
    imgCenter: {
      // ["@media (min-width:275px)"]: {
        margin: '0 auto',
        borderRadius: '4%',
        // '&:hover': {
        //   cursor: 'pointer',
        // },
      // },
    },
 
  }));

  const classes = useStyles();
  const featureItem = name;

  return (    
    <Card sx={{margin: 0, padding: 0, width: 230 }}>
      <CardMedia component='img' className={classes.imgCenter} 
        sx={{width: 220, height: 200, margin: 0, padding: 0 }} 
        image={featuredImage} title={featureItem} 
      />
      <CardContent sx={{textAlign: 'center', marginBottom: 0, marginTop: 0 }}>
        <Typography variant="h5" sx={{marginBottom: 0, marginTop: 0 }}>
          {name}
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent: 'center', height: 30 }}>
        <MuiNextLink href={`/product/${slug}`} underline="none" sx={{marginBottom: 3, marginTop: 0 }}>
          <Button variant="contained" size="small" sx={{marginBottom: 0, marginTop: 0 }}>
            View Detail
          </Button>
        </MuiNextLink>
      </CardActions>
    </Card>
  );
};

export default CarouselCard;
