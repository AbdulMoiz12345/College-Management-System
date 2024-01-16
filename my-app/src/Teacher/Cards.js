import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import image1 from 'C:/db_project_final/my-app/src/images/1pic.jpeg'; // Import images
import image2 from 'C:/db_project_final/my-app/src/images/2pic.jpeg';
import image3 from 'C:/db_project_final/my-app/src/images/3pic.jpeg';
import image4 from 'C:/db_project_final/my-app/src/images/4pic.jpeg';

const imagePaths = [image1, image2, image3, image4];

const Coursecard = ({ id,ClassName,name, description, onClick }) => {
  const randomImagePath = imagePaths[Math.floor(Math.random() * imagePaths.length)];

  return (
    <Card
      className="Coursecard"
      sx={{
        width: '250px',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '12px',
        margin: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardMedia sx={{ height: 140 }} image={randomImagePath} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {ClassName}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={onClick} style={{backgroundColor: 'green',width:'120px' }}>
          enter
        </Button>
      </CardActions>
    </Card>
  );
};

export default Coursecard;
