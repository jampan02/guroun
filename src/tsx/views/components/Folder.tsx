import React, { useState } from "react";
import img from "../../../img/folderIcon.png";
import { useHistory } from "react-router-dom";
import { setDocName } from "../../../features/userSlice";
import { useDispatch } from "react-redux";

//material ui
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  folder: {
    "&:hover": {},
  },
  addFolder: {},
  addFolderimg: {
    width: "180px",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  img: {
    maxWidth: "200px",
  },
}));

const Folder = ({
  name = "",
  submitName = "変更",
  onSubmit,
  onDeleteFolder = undefined,
  docName = undefined,
  uid = undefined,
}: any) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [folderName, setFolderName] = useState("");
  if (docName) {
    return (
      <Grid item xs={12} sm={6} md={4} className={classes.folder}>
        <Card className={classes.card}>
          <div
            onClick={() => {
              dispatch(setDocName({ docName: docName as string }));
              history.push({ pathname: `/main/${docName}`, state: uid });
            }}
            style={{ textAlign: "center" }}
          >
            <img src={img} alt="folder" className={classes.img} />
            <Typography variant="h5" align="center">
              {name}
            </Typography>
          </div>

          <Button
            size="small"
            color="primary"
            onClick={() => {
              isEditMode ? setIsEditMode(false) : setIsEditMode(true);
            }}
          >
            編集
          </Button>
          {isEditMode && (
            <div>
              <TextField
                autoFocus
                type="text"
                onChange={(e) => setFolderName(e.target.value)}
                value={folderName}
              />
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  if (!folderName) {
                    alert("フォルダ名を入力してください。");
                    return;
                  }
                  onSubmit(name, folderName);
                  setFolderName("");
                  setIsEditMode(false);
                }}
              >
                {submitName}
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  onDeleteFolder(name);
                }}
                style={{ margin: "5px" }}
              >
                削除
              </Button>
            </div>
          )}
        </Card>
      </Grid>
    );
  } else {
    return (
      <Container component="main" maxWidth="xs" className={classes.addFolder}>
        <CssBaseline />
        <div className={classes.paper}>
          <img src={img} alt="folder" className={classes.addFolderimg} />
          <TextField
            type="text"
            onChange={(e) => setFolderName(e.target.value)}
            value={folderName}
            label="チューリップの観察日記"
            autoFocus
          />
          <Button
            size="small"
            color="primary"
            onClick={() => {
              if (!folderName) {
                alert("フォルダ名を入力してください。");
                return;
              }
              onSubmit(name, folderName);
              setFolderName("");
              setIsEditMode(false);
            }}
          >
            {submitName}
          </Button>
        </div>
      </Container>
    );
  }
};

export default Folder;
