import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { login, selectDocName } from "../../../../../features/userSlice";
import { db, firebaseApp, storage } from "../../../../../ts/firebase";
import { useHistory } from "react-router-dom";
import img from "../../../../../img/addButton.png";
import Modal from "react-modal";
import AddData from "../../../components/AddData";
import firebase from "firebase";
import Data from "../../../components/DataComponent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HomeIcon from "@material-ui/icons/Home";
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
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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

export type DATA = {
  comment: string | null;
  createdAt: firebase.firestore.Timestamp | null | Date;
  days: number | null;
  imageUrl: string | null;
  id: string | null;
  updatedAt?: firebase.firestore.Timestamp | null | Date;
};

const Datas = (props: any) => {
  const classes = useStyles();
  const [isShowImg, setIsShowImg] = useState(false);
  const [checkedData, setCheckedData] = useState<string[]>([]);
  const [userUid, setUserUid] = useState<string>("");
  const [datas, setDatas] = useState<DATA[]>([]);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const uid = props.location.state;
  const history = useHistory();
  const { id }: any = useParams();
  const dispatch = useDispatch();
  const doc = useSelector(selectDocName);
  useEffect(() => {
    const firstRender = async () => {
      if (!uid) {
        const userData = await firebaseApp.auth().currentUser;
        if (userData) {
          if (userData !== null) {
            setUserUid(userData.uid);
          }
        } else {
          history.push("/");
        }
      }
      await getUid();
      setTimeout(() => {
        setIsShowImg(true);
      }, 500);
    };
    firstRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getUid = async () => {
    await firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user?.displayName && user.photoURL) {
        if (!uid) {
          var userId = firebaseApp.auth().currentUser;
          //直リンク対策
          if (userId != null) {
            const userUID = userId.uid;
            let docData: any[] = [];
            await db
              .collection("folders")
              .doc(userUID)
              .collection("myFolders")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((data) => {
                  docData.push(data.id);
                });
              });

            const res = docData.some((docid: any) => {
              return docid === id;
            });

            if (!res) {
              history.push("/errorpage");
              return;
            }

            let newData: DATA[] = [];
            await db
              .collection("folders")
              .doc(userUID)
              .collection("myFolders")
              .doc(id)
              .collection("datas")
              .orderBy("days", "desc")
              .get()
              .then((res) => {
                res.forEach((data) => {
                  const doc = data.data();
                  newData.push({
                    comment: doc.comment,
                    createdAt: doc.createdAt.toDate(),
                    days: doc.days,
                    imageUrl: doc.imageUrl,
                    id: data.id,
                    updatedAt: doc.updatedAt,
                  });
                });
              });
            setDatas(newData);
            return;
          }
          //
        }
        await dispatch(
          login({
            displayName: user.displayName,
            photoUrl: user.photoURL,
          })
        );
        if (doc.docName !== id) {
          let newData: DATA[] = [];
          await db
            .collection("folders")
            .doc(uid)
            .collection("myFolders")
            .doc(id)
            .collection("datas")
            .orderBy("days", "desc")
            .get()
            .then((res) => {
              res.forEach((data) => {
                const doc = data.data();
                newData.push({
                  comment: doc.comment,
                  createdAt: doc.createdAt.toDate(),
                  days: doc.days,
                  imageUrl: doc.imageUrl,
                  id: data.id,
                  updatedAt: doc.updatedAt,
                });
              });
            });
          setDatas(newData);
        } else {
          let newData: DATA[] = [];
          await db
            .collection("folders")
            .doc(uid)
            .collection("myFolders")
            .doc(doc.docName)
            .collection("datas")
            .orderBy("days", "desc")
            .get()
            .then((res) => {
              res.forEach((data) => {
                const doc = data.data();
                newData.push({
                  comment: doc.comment,
                  createdAt: doc.createdAt.toDate(),
                  days: doc.days,
                  imageUrl: doc.imageUrl,
                  id: data.id,
                  updatedAt: doc.updatedAt,
                });
              });
            });
          setDatas(newData);
        }
      } else {
        history.push("/");
      }
    });
  };
  //data追加するやつ
  const onAddData = async (
    days: string | number,
    image: any,
    comment: string
  ) => {
    if (days === undefined) {
      alert("「忘れた」をタップして！");
      return;
    }
    let newImage;
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join("");
    if (image !== undefined) {
      const fileName = randomChar + "_" + image.name;
      await storage.ref(`/dataimages/${fileName}`).put(image);
      newImage = await storage
        .ref(`/dataimages`)
        .child(fileName)
        .getDownloadURL();
    } else {
      newImage = await storage
        .ref(`/default`)
        .child("unnamed.png")
        .getDownloadURL();
    }
    let uidForAddnewDoc = uid;
    if (!uid) {
      uidForAddnewDoc = userUid;
    }

    await db
      .collection("folders")
      .doc(uidForAddnewDoc)
      .collection("myFolders")
      .doc(id)
      .collection("datas")
      .add({
        days: days,
        imageUrl: newImage,
        createdAt: firebase.firestore.Timestamp.now(),
        comment: comment,
      });
    getUid();
  };

  //timestampから、時差を取得
  const onGetDays = async (setDays: any) => {
    let lostUid = uid;
    let docId = doc.docName;
    if (!docId || !lostUid) {
      const user = await firebase.auth().currentUser;
      if (user !== null) {
        lostUid = user.uid;
        docId = id;
      }
    }
    let daysData: number[] = [];
    let lastDays: number[] = [];
    const now = new Date();
    await db
      .collection("folders")
      .doc(lostUid)
      .collection("myFolders")
      .doc(docId)
      .collection("datas")
      .orderBy("days", "desc")
      .get()
      .then((querySnapshop) => {
        querySnapshop.forEach((doc) => {
          const docData = doc.data();
          const date = docData.createdAt.toDate();
          const prevDate = date.getDate();
          daysData.push(prevDate);
          lastDays.push(docData.days);
        });
      })
      .catch((error) => {
        alert(error.message);
      });
    const nowDate = now.getDate();
    const difference = nowDate - daysData[0];
    const result = difference + lastDays[0];
    if (!result) {
      setDays(1);
      return;
    }
    setDays(result);
  };
  //いっこ消す
  const onDeleteDoc = async (dataId: any) => {
    if (window.confirm("本当に削除していいですか？")) {
      let newArray: string[] = [];
      if (!uid) {
        //チェックされたデータが消された場合、配列からも消す（checkedData）
        await db
          .collection("folders")
          .doc(userUid)
          .collection("myFolders")
          .doc(id)
          .collection("datas")
          .get()
          .then(async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              newArray = checkedData.filter(
                (checkedDoc) => doc.id === checkedDoc
              );
            });

            setCheckedData(newArray);
            await db
              .collection("folders")
              .doc(userUid)
              .collection("myFolders")
              .doc(id)
              .collection("datas")
              .doc(dataId)
              .delete();
            getUid();
          });
      } else {
        //チェックされたデータが消された場合、配列からも消す（checkedData）
        await db
          .collection("folders")
          .doc(uid)
          .collection("myFolders")
          .doc(id)
          .collection("datas")
          .get()
          .then(async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              newArray = checkedData.filter(
                (checkedDoc) => doc.id !== checkedDoc
              );
            });

            setCheckedData(newArray);
            await db
              .collection("folders")
              .doc(uid)
              .collection("myFolders")
              .doc(id)
              .collection("datas")
              .doc(dataId)
              .delete();
            getUid();
          });
      }
    }
  };

  //全部削除
  const onAllDelete = async () => {
    if (window.confirm("本当にすべて削除しますか？")) {
      let uidForAllDelete = uid;
      if (!uid) {
        uidForAllDelete = userUid;
      }
      await db
        .collection("folders")
        .doc(uidForAllDelete)
        .collection("myFolders")
        .doc(id)
        .collection("datas")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (allDeleteDoc) => {
            await db
              .collection("folders")
              .doc(uidForAllDelete)
              .collection("myFolders")
              .doc(id)
              .collection("datas")
              .doc(allDeleteDoc.id)
              .delete();
            setCheckedData([]);
            getUid();
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  //data更新関数
  const updateData = async (docId: string, image: any, comment: string) => {
    let uidForAllDelete = uid;
    if (!uid) {
      uidForAllDelete = userUid;
    }
    let newImage;
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join("");
    if (image !== undefined) {
      const fileName = randomChar + "_" + image.name;
      await storage.ref(`/dataimages/${fileName}`).put(image);
      newImage = await storage
        .ref(`/dataimages`)
        .child(fileName)
        .getDownloadURL();
    } else {
      //画像なかった場合、もともとのヤツ使う
      await db
        .collection("folders")
        .doc(uidForAllDelete)
        .collection("myFolders")
        .doc(id)
        .collection("datas")
        .doc(docId)
        .update({
          comment: comment,
          updatedAt: firebase.firestore.Timestamp.now(),
        })
        .then(() => {
          getUid();
        })
        .catch((error) => {
          alert(error.message);
        });
      return;
    }
    await db
      .collection("folders")
      .doc(uidForAllDelete)
      .collection("myFolders")
      .doc(id)
      .collection("datas")
      .doc(docId)
      .update({
        comment: comment,
        imageUrl: newImage,
        updatedAt: firebase.firestore.Timestamp.now(),
      })
      .then(() => {
        getUid();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const data = datas.map((data, index) => (
    <Data
      id={id}
      data={data}
      key={index}
      uid={uid}
      onDeleteDoc={onDeleteDoc}
      setCheckedData={setCheckedData}
      updateData={updateData}
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
      <Button
        variant="contained"
        size="large"
        startIcon={<ArrowBackIcon />}
        className={classes.goback}
        onClick={() => {
          history.goBack();
        }}
      >
        前に戻る
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
          {data}
        </Grid>
      </Container>
      {!!datas.length && (
        <Button size="small" color="secondary" onClick={onAllDelete}>
          全削除
        </Button>
      )}
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <AddData onGetDays={onGetDays} setIsOpen={setIsOpen} func={onAddData} />
      </Modal>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
};

export default Datas;
