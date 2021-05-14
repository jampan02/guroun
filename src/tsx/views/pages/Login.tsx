import React, { useEffect, useState } from "react";
import { firebaseApp, storage } from "../../../ts/firebase";
import "firebase/storage";
import { useDispatch } from "react-redux";
import { login } from "../../../features/userSlice";
import { Props } from "./top/Top";
import img from "../../../img/topimage.png";
//material ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

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
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${img})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "top",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
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
  avatarImg: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginLeft: "10px",
  },
  avatarImgContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  //
  headerContainer: {
    position: "relative",
  },
  imgContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    textAlign: "center",
  },
  img: {
    height: "40vh",
  },
}));

const Login = (props: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [load, setLoading] = useState<boolean>(false);
  const [testLoad, setTestLoading] = useState<boolean>(false);
  const [image, setImage] = useState<any>("");
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  useEffect(() => {
    const checkIsLogin = () => {
      firebaseApp.auth().onAuthStateChanged((user) => {
        if (user?.displayName && user.photoURL) {
          dispatch(
            login({
              displayName: user.displayName,
              photoUrl: user.photoURL,
            })
          );
          props.history.push("/home");
        } else {
          return;
        }
      });
    };
    checkIsLogin();
  }, [dispatch, props.history]);
  //テストログイン
  const testLogin = async (e: any) => {
    e.preventDefault();
    const sampleEmail = "emailforsample";
    const samplePassword = "passwordforsample";
    setTestLoading(true);
    await firebaseApp
      .auth()
      .signInWithEmailAndPassword(sampleEmail, samplePassword)
      .then(() => {
        setLoading(false);
        console.log("success");
        props.history.push("/home");
      })
      .catch((error) => {
        setTestLoading(false);
        console.log("failed");
        alert(error.message);
      });
  };
  //ログイン
  const doLogin = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    if (email === "") {
      alert("メールアドレスは必須です。");
      return;
    } else if (password === "") {
      alert("パスワードは必須です。");
      return;
    }
    setLoading(true);
    await firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        props.history.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };
  //新規作成
  const createNewAccount = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    //
    if (password === "" || userName === "" || email === "") {
      alert("必須項目が未入力です。");
      return;
    }
    //
    setLoading(true);

    await firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
    //画像storageにup
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
      if (firebaseApp.auth().currentUser) {
        const user = await firebaseApp.auth().currentUser;
        if (user) {
          await user.updateProfile({
            displayName: userName,
            photoURL: newImage,
          });
          dispatch(
            login({
              displayName: userName,
              photoUrl: newImage,
            })
          );
        }
      } else {
        return;
      }
    } else {
      const newImage = await storage
        .ref(`/default`)
        .child("businnes.png")
        .getDownloadURL();
      if (firebaseApp.auth().currentUser) {
        const user = await firebaseApp.auth().currentUser;
        if (user) {
          await user.updateProfile({
            displayName: userName,
            photoURL: newImage,
          });
          dispatch(
            login({
              displayName: userName,
              photoUrl: newImage,
            })
          );
        }
      } else {
        return;
      }
    }
    setLoading(false);
    props.history.push("/home");
  };
  //画像うけとって表示するやつ
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

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image}></Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "ログイン" : "新規作成"}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogin && (
              <TextField
                variant="outlined"
                label="ユーザーネーム"
                margin="normal"
                required
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            )}
            {!isLogin && (
              <div className={classes.avatarImgContainer}>
                <Button
                  style={{ marginTop: "16px" }}
                  variant="contained"
                  color="primary"
                  component="label"
                >
                  アップロード
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .pdf, .doc"
                    onChange={(e) => onFileChange(e)}
                    className={classes.inputFileBtnHide}
                  />
                </Button>
                {!!imageSrc && (
                  <img
                    src={imageSrc}
                    alt="画像"
                    className={classes.avatarImg}
                  />
                )}
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e: any) => {
                isLogin ? doLogin(e) : createNewAccount(e);
              }}
            >
              {isLogin
                ? load
                  ? "ログイン中..."
                  : "ログイン"
                : load
                ? "新規作成中..."
                : "新規作成"}
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={(e) => testLogin(e)}
            >
              {isLogin && testLoad ? "テストログイン中..." : "テストログイン"}
            </Button>
            <Grid container>
              {isLogin && (
                <Grid item xs>
                  <Link
                    variant="body2"
                    onClick={() => props.history.push("/reset_password")}
                  >
                    パスワードを忘れましたか？
                  </Link>
                </Grid>
              )}
              <Grid item>
                <Link variant="body2" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "新規作成" : "ログイン"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
