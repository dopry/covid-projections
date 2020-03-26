import React from 'react';
import Typography from '@material-ui/core/Typography';
import '../../App.css'; /* optional for styling like the :hover pseudo-class */
import Map from '../../components/Map/Map';

export default function Embed() {
  return (
    <>
      <Map />
      <Typography variant="h3">Check us out</Typography>
    </>
  );
}
