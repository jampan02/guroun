import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import img from "../../../../img/siteicon.png";
import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://guroun.com/">
        ぐろうん
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
  },
  img: {
    height: "30vh",
  },
}));

const ErrorPage = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h2">Page was not found</Typography>
      <img src={img} alt="画像" className={classes.img} />
      <br />
      <Button size="large" onClick={() => history.push("")}>
        Go back to home
      </Button>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
};

export default ErrorPage;
