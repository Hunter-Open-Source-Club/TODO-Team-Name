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
  Hidden,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import debounce from "lodash/debounce";

interface ListEntry {
  visible: boolean;
  course_id: string;
  course_name: string;
}

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
  centralColumn: {
    width: theme.spacing(50),
  },
  spaced: {
    margin: theme.spacing(3),
  },
}));

const fuse = new Fuse(syllabi, {
  keys: ["course_id", "syllabus"],
  shouldSort: true,
  findAllMatches: true,
  isCaseSensitive: false,
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
  const [results, setResults] = useState([
    { visible: true, course_id: "CSCI Bing Bong", course_name: "Bing Studies" },
  ]);
  const [query, updateQuery] = useState("");

  const handleSearch = ({ currentTarget }: any) => {
    updateQuery(currentTarget.value);
    setResults(
      results.map(({ course_id, course_name }: ListEntry) => ({
        course_id: course_id,
        visible: false,
        course_name: course_name,
      }))
    );

    const res = fuse.search(currentTarget.value);
    setTimeout(() => {
      setResults(
        res.map(({ item: { course_id, syllabus } }) => ({
          course_id: course_id,
          visible: true,
          course_name: syllabus.substring(0, 10),
        }))
      );
    }, 500);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.paper}>
      <Typography component="h1" variant="h3" className={classes.paper}>
        Syllabase
      </Typography>
      <Divider variant="fullWidth" color="white" className={classes.spaced} />
      {/* TODO: Animate from narrow width to full width */}
      <TextField
        fullWidth
        autoFocus
        id="standard-search"
        label="Search syllabi..."
        type="search"
        variant="outlined"
        onChange={handleSearch}
        autoComplete="off"
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
        {results.map(({ course_name, visible, course_id }, i) => (
          <Fade
            in={!!visible}
            unmountOnExit={visible}
            style={{ transitionDelay: `${200 * i}ms` }}
          >
            <ListItem button divider key={i} className={classes.centralColumn}>
              <ListItemText primary={course_name} secondary={course_id} />
            </ListItem>
          </Fade>
        ))}
      </List>
      <AppBar position="fixed" color="secondary" className={classes.appBar}>
        <Box padding={1}>
          <Copyright />
        </Box>
      </AppBar>
    </Container>
  );
}
