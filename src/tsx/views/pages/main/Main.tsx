/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { login } from "../../../../features/userSlice";
import { useDispatch } from "react-redux";
import { db, firebaseApp } from "../../../../ts/firebase";
import { Props } from "../top/Top";
import Folder from "../../components/Folder";
import img from "../../../../img/addButton.png";
import AddFolder from "../../components/AddFolder";
import Modal from "react-modal";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";

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
  addBtn: {
    width: 200,
    height: 200,
    "&:hover": {
      opacity: 0.7,
      cursor: "pointer",
    },
  },
  goback: {
    margin: "10px",
  },
}));
//
const Main = (props: Props) => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isShowImg, setIsShowImg] = useState(false);
  const [docName, setDocName] = useState<string[]>([]);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [myFolders, setMyFolders] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");

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
          await getMydates();
          setIsShowImg(true);
        } else {
          props.history.push("/");
        }
      });
    };
    checkIsLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //doc名取得関数
  //最初に固有のアカウントが所有するmyfoldersを取得
  const getMydates = async () => {
    const user = await firebaseApp.auth().currentUser;
    if (user) {
      const uid = user.uid;
      setUserId(uid);
      //ここに元通りにするんゴ
      let datas: string[] = [];
      let docDatas: string[] = [];
      await db
        .collection("folders")
        .doc(uid)
        .collection("myFolders")
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const docData = doc.data();
            docDatas.push(doc.id);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            datas.push(docData.folderName);
          });
        })
        .then(() => {
          setMyFolders(datas);
          setDocName(docDatas);
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };
  //folder名かえる関数君d
  const onSubmit = async (oldFolderName: string, newFolderName: string) => {
    // eslint-disable-next-line array-callback-return
    const check = myFolders.some(function (data) {
      if (data === newFolderName) {
        alert("同じ名前のフォルダーは使用できません。");
        return true;
      }
    });
    if (check) {
      return;
    }
    await db
      .collection("folders")
      .doc(userId)
      .collection("myFolders")
      .get()
      .then((res) => {
        res.forEach((doc) => {
          const data = doc.data();
          if (data.folderName === newFolderName) {
            return;
          }
          if (data.folderName === oldFolderName) {
            db.collection("folders")
              .doc(userId)
              .collection("myFolders")
              .doc(doc.id)
              .update({
                folderName: newFolderName,
              })
              .then(() => {
                getMydates();
              })
              .catch((error) => {
                alert(error.message);
              });
          }
        });
      });
    //レンダリングのためにこいつ呼ぶ
  };
  //フォルダ消す関数
  const onDeleteFolder = async (name: string) => {
    if (window.confirm("本当にいいですか？")) {
      await db
        .collection("folders")
        .doc(userId)
        .collection("myFolders")
        .get()
        .then((res) => {
          res.forEach(async (doc) => {
            const data = doc.data();
            if (data.folderName === name) {
              await db
                .collection("folders")
                .doc(userId)
                .collection("myFolders")
                .doc(doc.id)
                .delete()
                .then(async () => {
                  await db
                    .collection("folders")
                    .doc(userId)
                    .collection("myFolders")
                    .doc(doc.id)
                    .collection("datas")
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.forEach(async (insidedoc) => {
                        await db
                          .collection("folders")
                          .doc(userId)
                          .collection("myFolders")
                          .doc(doc.id)
                          .collection("datas")
                          .doc(insidedoc.id)
                          .delete();
                      });
                    })
                    .catch((error) => {
                      alert(error.message);
                    });
                  getMydates();
                })
                .catch((error) => {
                  alert(error.message);
                });
            }
          });
        });
    } else {
      return;
    }
    //レンダリングのためにこいつ呼ぶ
  };

  //foldersつくる
  const Folders = myFolders.map((name, index) => (
    <Folder
      name={name}
      onSubmit={onSubmit}
      key={index}
      onDeleteFolder={onDeleteFolder}
      docName={docName[index]}
      uid={userId}
    />
  ));
  return (
    <div>
      <Button
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        className={classes.goback}
        onClick={() => {
          history.push("/home");
        }}
      >
        ホームに戻る
      </Button>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4} style={{ textAlign: "center" }}>
            {isShowImg && (
              <img
                src={img}
                alt="追加"
                className={classes.addBtn}
                onClick={() => setIsOpen(true)}
              />
            )}
          </Grid>
          {Folders}
        </Grid>
      </Container>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <AddFolder
          myFolders={myFolders}
          setIsOpen={setIsOpen}
          func={getMydates}
        />
      </Modal>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
};

export default Main;
