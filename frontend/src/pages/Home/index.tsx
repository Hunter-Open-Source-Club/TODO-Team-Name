import React, { useState, useEffect } from "react";

const Home: React.FunctionComponent = () => {
  const [message, setMessage] = useState("Syllabased");

  return (
    <div>
      <p>Syllabase Home page</p>
      <p> {message} </p>
    </div>
  );
};

export default Home;
