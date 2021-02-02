import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import img from "../../../../../img/siteicon.png";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  img: {
    maxHeight: "200px",
    maxWidth: "100%",
  },
}));

const Greet = ({ username, setIsOpen }: any) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ textAlign: "center" }}>
        <Typography variant="h2" style={{ marginTop: "20px" }}>
          初めまして！
        </Typography>
        <Typography
          variant="h3"
          style={{ marginTop: "20px", maxWidth: "600px" }}
        >
          {username}さん！
        </Typography>
        <img src={img} alt="画像" className={classes.img} />
        <br />
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => history.push("/main")}
          style={{ marginTop: "20px" }}
        >
          作品を見る
        </Button>
      </div>
    </Container>
  );
};

export default Greet;
