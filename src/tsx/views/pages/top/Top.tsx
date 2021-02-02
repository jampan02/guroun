import React, { useEffect, useState } from "react";
import { db, firebaseApp } from "../../../../ts/firebase";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, selectUser } from "../../../../features/userSlice";
import firebase from "firebase";
import Modal from "react-modal";
//material ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Greet from "./greet/Greet";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export interface Props extends RouteComponentProps {}
const Top = (props: Props) => {
  const classes = useStyles();
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    //auth無しで入ってきたらはじき返す
    const checkIsLogin = async () => {
      await firebaseApp.auth().onAuthStateChanged(async (user) => {
        if (user?.displayName && user.photoURL) {
          await dispatch(
            login({
              displayName: user.displayName,
              photoUrl: user.photoURL,
            })
          );
          //初回ログインのときはこいつで挨拶する
          if (localStorage.getItem("key") === null || undefined) {
            setIsFirst(true);
            //最初にフォルダいっこつくってあげる
            const user = firebaseApp.auth().currentUser;
            if (user !== null) {
              await db
                .collection("folders")
                .doc(user.uid)
                .collection("myFolders")
                .add({
                  folderName: "チューリップの観察日記",
                  createdAt: firebase.firestore.Timestamp.now(),
                });
            } else {
              alert("no user");
              return;
            }
          }
          //二回目以降は表示されない
          localStorage.setItem("key", "true");
        } else {
          props.history.push("/");
        }
      });
    };
    checkIsLogin();
  }, [dispatch, props.history]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img src={user.photoUrl} alt="画像" />
        </Avatar>
        <Typography component="h1" variant="h4" style={{ marginTop: "10px" }}>
          {user.displayName}さん
        </Typography>
        <Modal
          ariaHideApp={false}
          isOpen={isFirst}
          onRequestClose={() => setIsFirst(false)}
        >
          <Greet setIsOpen={setIsFirst} username={user.displayName as string} />
        </Modal>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => props.history.push("/main")}
        >
          作品を見る
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() =>
            props.history.push({
              pathname: "/profile",
              state: {
                icon: user.photoUrl,
                username: user.displayName,
              },
            })
          }
        >
          プロフィール設定
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Top;
