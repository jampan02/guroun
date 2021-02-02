import React, { useState } from "react";
import img from "../../../img/unnamed.png";
//material ui
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputFileBtnHide: {
    opacity: 0,
    appearance: "none",
    position: "absolute",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    lineHeight: "6px",
    color: "#888",
  },
  content: {
    fontSize: "18px",
    color: "#555",
    lineHeight: "30px",
    marginTop: "20px",
  },
  img: {
    maxHeight: "300px",
    maxWidth: "100%",
  },
  editmodeImg: {
    height: "300px",
    maxWidth: "100%",
    "&:hover": {
      cursor: "pointer",
    },
  },
  closeBtn: {
    marginTop: "15px",
  },
  editBtn: {
    marginTop: "15px",
  },
}));

const Result = ({ data, setIsOpen, updateData }: any) => {
  const classes = useStyles();
  const [image, setImage] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [changedComment, setChangedComment] = useState(data.comment);
  const formatDate = () => {
    const year = data.createdAt.getFullYear();
    const manth = data.createdAt.getMonth() + 1;
    const theDate = data.createdAt.getDate();
    const hour = data.createdAt.getHours();
    let minutes = data.createdAt.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    const formatedDate = `${year}年/${manth}月/${theDate}日/${hour}:${minutes}`;
    return formatedDate;
  };

  const formatUpdateDate = () => {
    const preparedUpdatedDate = data.updatedAt.toDate();
    const year = preparedUpdatedDate.getFullYear();
    const manth = preparedUpdatedDate.getMonth() + 1;
    const theDate = preparedUpdatedDate.getDate();
    const hour = preparedUpdatedDate.getHours();
    let minutes = preparedUpdatedDate.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    const formatedUpdateDate = `${year}年/${manth}月/${theDate}日/${hour}:${minutes}`;
    return formatedUpdateDate;
  };

  const onEditDoc = () => {
    setEditMode(true);
  };

  const onApply = async () => {
    await updateData(data.id, image, changedComment);
    setIsOpen(false);
    setImage(undefined);
    setChangedComment("");
  };

  //画像選択
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ textAlign: "center" }}>
        {!!imageSrc ? (
          editMode ? (
            <label>
              <input
                id="image"
                accept=".png, .jpg, .jpeg, .pdf, .doc"
                type="file"
                onChange={onFileChange}
                className={classes.inputFileBtnHide}
              />
              <img src={imageSrc} alt="画像" className={classes.editmodeImg} />
            </label>
          ) : (
            <img src={imageSrc} alt="画像" className={classes.img} />
          )
        ) : editMode ? (
          <label>
            <input
              id="image"
              accept=".png, .jpg, .jpeg, .pdf, .doc"
              type="file"
              onChange={onFileChange}
              className={classes.inputFileBtnHide}
            />
            <img
              src={data.imageUrl}
              alt="画像"
              className={classes.editmodeImg}
            />
          </label>
        ) : (
          <img src={data.imageUrl} alt="画像" className={classes.img} />
        )}
      </div>
      {editMode ? (
        <div>
          <TextField
            variant="outlined"
            multiline
            fullWidth
            className={classes.content}
            type="text"
            value={changedComment}
            onChange={(e) => setChangedComment(e.target.value)}
          />
        </div>
      ) : (
        <p className={classes.content}>{data.comment} </p>
      )}
      <span className={classes.date}>投稿日：</span>
      <span className={classes.date}>{formatDate()}</span>
      <br />
      {!!data.updatedAt && (
        <>
          <span className={classes.date}>更新日：</span>
          <span className={classes.date}>{formatUpdateDate()}</span>
        </>
      )}
      <div>
        <Button
          size="small"
          color="primary"
          onClick={() => setIsOpen(false)}
          className={classes.closeBtn}
        >
          閉じる
        </Button>
        {!editMode && (
          <Button
            size="small"
            color="primary"
            onClick={onEditDoc}
            className={classes.editBtn}
          >
            編集
          </Button>
        )}
        {editMode && (
          <Button
            size="small"
            color="primary"
            onClick={onApply}
            className={classes.editBtn}
          >
            適用
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Result;
