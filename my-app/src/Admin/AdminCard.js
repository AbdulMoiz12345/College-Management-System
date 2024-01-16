import { Link } from 'react-router-dom';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
const mystyle={
    width: "250px",
    height: "250px",
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
    backgroundColor: 'white',
    color: 'black',
    flex: '1 0 calc(25% - 20px)', /* Set flex-basis to 25% with a little space between cards */
}
const typostyle={
  height:'30px',
    marginBottom: "20px",
}
const AdminCard = (props) => {
  return (
    <Card variant="outlined" style={mystyle}>
      <CardContent>
        <Typography variant="h5" component="div" style={typostyle}>
         {props.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {props.description}
        </Typography>
        <Button variant="contained" color="primary" style={{ marginTop: '60px', backgroundColor: 'green' }}>
  <Link to={props.link} style={{ textDecoration: 'none', color: 'white' }}>
    {props.name}
  </Link>
</Button>
      </CardContent>
    </Card>
  );
};

export default AdminCard;