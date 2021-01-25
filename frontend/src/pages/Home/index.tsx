import React, { useState } from "react";
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
  Modal,
  Card,
  CardContent,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Backdrop from "@material-ui/core/Backdrop";
import debounce from "lodash/debounce";
import uniq from "lodash/uniq";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

interface ListEntry {
  visible: boolean;
  course_id: string;
  course_name: string;
}

interface ClassAttrs {
  urls: string[];
}

const SyllabaseLogo = [
  { c: "#4787ed", t: "Sy" },
  { c: "#df523e", t: "ll" },
  { c: "#f6bd3f", t: "a" },
  { c: "#4787ed", t: "ba" },
  { c: "#50a45c", t: "s" },
  { c: "#df523e", t: "e" },
];
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContents: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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

function PDFDocument({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }
  return (
    <div>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={console.error}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Box onClick={() => setPageNumber((pageNumber || 0) + 1)}>{">"}</Box>
    </div>
  );
}

function ModalInnerContents({ crs_id }: { crs_id: string }) {
  const txt = syllabi.find(({ course_id }) => course_id === crs_id);
  return (
    <Fade in={!!crs_id}>
      <Card>
        <CardContent>
          <Typography component="h5" variant="h5" color="textSecondary">
            {txt?.course_id}
          </Typography>
          <List>
            {/* {uniq(txt?.urls).map((url, i) => (
              <ListItem
                button
                divider
                key={i}
                href={url}
                component="a"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemText primary={url.replace(/(.{250})..+/, "$1…")} />
              </ListItem>
            ))} */}
          </List>
          <PDFDocument url="http://syllabi.hunterosc.org/assets/courses/CS_127/CS127_ligorio_syllabus_s20.pdf" />
        </CardContent>
      </Card>
    </Fade>
  );
}

function BottomBar() {
  const classes = useStyles();
  return (
    <AppBar position="fixed" color="secondary" className={classes.appBar}>
      <Box padding={1}>
        <Typography variant="body2" color="textSecondary" align="center">
          Copyleft &#127279;&nbsp;
          <Link color="inherit" href="https://hunterosc.org">
            Open Source Club
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </AppBar>
  );
}

const DefaultSelectedCourse = {
  visible: true,
  course_id: "CS_127",
  course_name: "Intro to Computer Science",
};

export default function Home(): JSX.Element {
  const classes = useStyles();
  const [results, setResults] = useState([DefaultSelectedCourse]);
  const [query, updateQuery] = useState("");
  const [active_course_id, setOpen] = React.useState("");

  const handleOpen = (course_id: string) => {
    setOpen(course_id);
  };

  const handleClose = () => {
    setOpen("");
  };

  const handleSearch = ({ currentTarget }: any) => {
    updateQuery(currentTarget.value);
    setResults(
      results.map(({ course_id, course_name }: ListEntry) => ({
        visible: false,
        course_id: course_id,
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
        <span>
          {SyllabaseLogo.map(({ c, t }) => (
            <span style={{ color: c }}>{t}</span>
          ))}
        </span>
      </Typography>
      <Divider variant="fullWidth" color="white" className={classes.spaced} />
      {/* TODO: Animate from narrow width to full width */}
      <TextField
        fullWidth
        autoFocus
        id="standard-search"
        // label="Search syllabi..."
        type="search"
        variant="outlined"
        autoComplete="off"
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
        {results.map(({ course_name, visible, course_id }, i) => (
          <Fade
            in={!!visible}
            unmountOnExit={visible}
            style={{ transitionDelay: `${200 * i}ms` }}
          >
            <ListItem button divider key={i} className={classes.centralColumn}>
              <ListItemText
                primary={course_name}
                secondary={course_id}
                onClick={() => handleOpen(course_id)}
              />
            </ListItem>
          </Fade>
        ))}
      </List>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={!!active_course_id}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ModalInnerContents crs_id={active_course_id} />
      </Modal>
      <BottomBar />
    </Container>
  );
}
