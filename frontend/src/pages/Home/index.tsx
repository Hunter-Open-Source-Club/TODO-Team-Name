import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Fuse from "fuse.js";
import syllabi from "../../fixtures/syllabi";
import {
  Divider,
  List,
  ListItem,
  Link,
  ListItemText,
  IconButton,
  AppBar,
  Fade,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import debounce from "lodash/debounce";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  appBar: {
    top: "auto",
    bottom: 0,
  },
}));

const fuse = new Fuse(syllabi, {
  keys: ["course_id", "syllabus"],
  shouldSort: true,
  findAllMatches: true,
  isCaseSensitive: false,
  // threshold
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyleft &#127279;&nbsp;
      <Link color="inherit" href="https://hunterosc.org">
        Open Source Club
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Home() {
  const classes = useStyles();
  const [results, setResults] = useState(["asdf", "asdf2"]);
  const [query, updateQuery] = useState("");

  const handleSearch = ({ currentTarget }: any) => {
    updateQuery(currentTarget.value);
    setResults(results.map(() => ""));

    const res = fuse.search(currentTarget.value);
    setTimeout(() => {
      setResults(
        res.map(({ item: { course_id, urls } }) =>
          JSON.stringify({ course_id, urls })
        )
      );
    }, 1000);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Syllabase
        </Typography>
        <Divider variant="middle" />
        {/* TODO: Animate from narrow width to full width */}
        <TextField
          fullWidth
          autoFocus
          id="standard-search"
          label="Search syllabi..."
          type="search"
          variant="outlined"
          onChange={handleSearch}
          value={query}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <List>
          {results.map((res, i) => (
            <Fade
              in={!!res}
              unmountOnExit={true}
              style={{ transitionDelay: `${150 * i}ms` }}
            >
              <ListItem button divider key={i}>
                <ListItemText primary={res} />
              </ListItem>
            </Fade>
          ))}
        </List>
      </div>
      <AppBar position="fixed" color="secondary" className={classes.appBar}>
        <Box padding={1}>
          <Copyright />
        </Box>
      </AppBar>
    </Container>
  );
}
