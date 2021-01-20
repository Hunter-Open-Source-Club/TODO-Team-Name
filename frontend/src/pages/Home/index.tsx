import React, { useState, useEffect } from "react";
import { Container, Typography, Button } from "@material-ui/core";

const Home: React.FunctionComponent = () => {
  const [message, setMessage] = useState("Syllabased");

  return (
    <Container>
      <Typography variant="h1">Syllabase Home page</Typography>
      <Typography variant="h1"> {message} </Typography>
    </Container>
  );
};

export default Home;
