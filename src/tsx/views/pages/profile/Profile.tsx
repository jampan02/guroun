import React, { useEffect, useState } from "react";
import {
  login,
  selectUser,
  updateUserProfile,
} from "../../../../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { firebaseApp, storage } from "../../../../ts/firebase";
//material ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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
  inputFileBtnHide: {
    opacity: 0,
    appearance: "none",
    position: "absolute",
  },
  settingImg: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const Profile = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const users = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>(users.displayName);
  const [image, setImage] = useState<any>("");
  const [imageSrc, setImageSrc] = useState<string>();
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
          setNewUsername(user.displayName);
        } else {
          props.history.push("/");
        }
      });
    };
    checkIsLogin();
  }, [dispatch, props.history]);
  //画像変更
  const onFileChange = (e: any) => {
    if (e.target.files === null) {
      return;
    }
    const file = e.target.files.item(0);
    if (file === null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    const image = e.target.files[0];
    setImage(image);
  };
  //名前変えるやつ
  const changeProfile = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    //画像storageにu
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join("");
    if (image !== "") {
      const fileName = randomChar + "_" + image.name;
      await storage.ref(`/images/${fileName}`).put(image);
      const newImage = await storage
        .ref(`/images`)
        .child(fileName)
        .getDownloadURL();
      const user = await firebaseApp.auth().currentUser;
      if (user) {
        if (newUsername !== "") {
          await user
            .updateProfile({
              displayName: newUsername,
              photoURL: newImage,
            })
            .then(function () {
              // Update successful.
              dispatch(
                updateUserProfile({
                  photoUrl: newImage,
                  displayName: newUsername,
                })
              );
              props.history.goBack();
            })
            .catch(function (error) {
              // An error happened.
              alert(error.message);
            });
        } else {
          alert("ユーザーネームは必須です");
          return;
        }
        setIsLoading(false);
      }
    } else {
      //画像変えないバージョン
      const user = await firebaseApp.auth().currentUser;
      if (user && user.photoURL !== null) {
        if (newUsername !== "") {
          await user
            .updateProfile({
              displayName: newUsername,
            })
            .then(function () {
              // Update successful.
              dispatch(
                updateUserProfile({
                  photoUrl: users.photoUrl,
                  displayName: newUsername,
                })
              );
              props.history.goBack();
            })
            .catch(function (error) {
              // An error happened.
              alert(error.message);
            });
        } else {
          alert("ユーザーネームは必須です");
          return;
        }
      }
    }
  };
  //logou
  const logOut = async () => {
    await firebaseApp
      .auth()
      .signOut()
      .then(async () => {
        // Sign-out successful.
        await props.history.push("/");
      })
      .catch(function (error) {
        // An error happened.
        alert(error.message);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {imageSrc ? (
          <Avatar className={classes.avatar}>
            <label className={classes.settingImg}>
              <input
                type="file"
                onChange={(e) => onFileChange(e)}
                accept=".png, .jpg, .jpeg, .pdf, .doc"
                className={classes.inputFileBtnHide}
              />
              <img src={imageSrc} alt="画像" />
            </label>
          </Avatar>
        ) : (
          <Avatar className={classes.avatar}>
            <label className={classes.settingImg}>
              <input
                type="file"
                onChange={(e) => onFileChange(e)}
                accept=".png, .jpg, .jpeg, .pdf, .doc"
                className={classes.inputFileBtnHide}
              />
              <img src={users.photoUrl} alt="画像" />
            </label>
          </Avatar>
        )}
        <TextField
          margin="normal"
          fullWidth
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={changeProfile}
        >
          {isLoading ? "適用中..." : "適用"}
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={logOut}
        >
          ログアウト
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Profile;
