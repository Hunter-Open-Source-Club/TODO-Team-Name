import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Input,
  Grid,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Fuse from "fuse.js";

import syllabi from "../../fixtures/syllabi";
let results: Array<String> = [];

const fuse = new Fuse(syllabi, {
  keys: ["course_id", "syllabus"],
  shouldSort: true,
  findAllMatches: true,
  isCaseSensitive: false,
  // threshold
});

const Home: React.FunctionComponent = () => {
  const [results, setResults] = useState(["asdf", "asdf2"]);
  const [query, updateQuery] = useState("");

  const onSearch = ({ currentTarget }: any) => {
    updateQuery(currentTarget.value);
    const res = fuse.search(currentTarget.value);
    console.log(res);
    setResults(
      res.map(({ item: { course_id, urls } }) =>
        JSON.stringify({ course_id, urls })
      )
    );
    fuse.search(currentTarget.value);
    console.log(currentTarget);
  };

  return (
    <Container>
      <Typography variant="h3">Syllabase Home page</Typography>
      <Container>
        <TextField
          id="standard-search"
          label="Find..."
          type="search"
          variant="outlined"
          onChange={onSearch}
          value={query}
        />
        {results.map((res, i) => (
          <Container key={i}>{res}</Container>
        ))}
      </Container>
    </Container>
  );
};

export default Home;
