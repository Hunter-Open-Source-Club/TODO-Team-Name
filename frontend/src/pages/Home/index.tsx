import {
  AppBar,
  Divider,
  Fade,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import Fuse from "fuse.js";
import { uniq } from "lodash";
import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import syllabi from "../../fixtures/syllabi";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

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
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  container: {
    display: "flex",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContents: {
    backgroundColor: theme.palette.background.paper,
    height: "100vh",
    width: "100vw",
    alignItems: "center",
    flexDirection: "column",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
  link: {
    color: "blue",
  },
}));

const fuse = new Fuse(syllabi, {
  keys: ["course_id", "syllabus", "course_name"],
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
    <Container>
      <Grid container justify="center">
        <Grid item xs={12} alignItems="center">
          <Typography variant="body1">
            Page {pageNumber} of {numPages}
          </Typography>
          <Button
            onClick={(e) => {
              e.preventDefault();
              // wrap pages 1-indexed
              setPageNumber(((pageNumber || 0) % (numPages || Infinity)) + 1);
            }}
          >
            <ArrowRightAltIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            renderMode="svg"
          >
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              height={800}
            />
          </Document>
        </Grid>
      </Grid>
    </Container>
  );
}

function ModalInnerContents({
  crs_id,
  path,
}: {
  crs_id: string;
  path: string;
}) {
  const classes = useStyles();
  const txt = syllabi.find(({ course_id }) => course_id === crs_id);

  return (
    <Fade in={!!crs_id}>
      <Grid container className={classes.modalContents} direction="row">
        <Grid item xs={12} sm={6}>
          <Typography component="h5" variant="h5" color="textSecondary">
            {txt?.course_id}
          </Typography>
          <Typography component="h6" variant="h6" className={classes.paper}>
            Links In This Syllabus:
          </Typography>
          <List>
            {uniq(txt?.urls).map((url, i) => (
              <ListItem
                button
                divider
                key={i}
                href={url}
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                <ListItemText primary={url.replace(/(.{250})..+/, "$1…")}>
                  {" "}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} sm={6}>
          <PDFDocument url={`http://syllabi.hunterosc.org/${path}`} />
        </Grid>
      </Grid>
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
  visible: false,
  course_id: "CS_127",
  course_name: "Intro to Computer Science",
};

export default function Home(): JSX.Element {
  const classes = useStyles();
  const [results, setResults] = useState([DefaultSelectedCourse]);
  const [query, updateQuery] = useState("");
  const [active_course_id, setOpen] = useState("");
  const [activeCoursePath, setActiveCoursePath] = useState("");

  const handleOpen = async (course_id: string) => {
    const files: any = await axios.get(
      `https://api.github.com/repos/RichAguil/HunterCS_CourseSyllabi/contents/assets/courses/${course_id}`
    );
    console.log(files);
    setActiveCoursePath(files.data[0].path);
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
        res.map(({ item: { course_id, course_name, syllabus } }) => ({
          course_id: course_id,
          visible: true,
          course_name: course_name ? course_name : syllabus.substring(0, 10),
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
      <Dialog
        className={classes.modal}
        open={!!active_course_id}
        onClose={handleClose}
        onEscapeKeyDown={handleClose}
        closeAfterTransition
        fullScreen
        fullWidth
      >
        <MuiDialogTitle disableTypography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <ModalInnerContents crs_id={active_course_id} path={activeCoursePath} />
      </Dialog>
      <BottomBar />
    </Container>
  );
}
