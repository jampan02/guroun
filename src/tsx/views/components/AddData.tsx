import React, { useState, useEffect } from "react";
import img from "../../../img/unnamed.png";
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
    maxHeight: "300px",
    maxWidth: "100%",
    "&:hover": {
      cursor: "pointer",
    },
  },
  addBtn: {
    marginTop: "15px",
  },
  comment: {
    marginTop: "5px",
  },
  days: {
    marginTop: "20px",
  },
  daysContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
}));

const AddData = ({ func, setIsOpen, onGetDays }: any) => {
  const classes = useStyles();

  const [days, setDays] = useState<number>();
  const [comment, setComment] = useState<string>("");

  //img表示のためのuseState
  const [image, setImage] = useState<any>();
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    onGetDays(setDays);
  }, [onGetDays]);

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
        <label>
          {imageSrc ? (
            <img src={imageSrc} alt="画像" className={classes.settingImg} />
          ) : (
            <img src={img} alt="ドキュメント" className={classes.settingImg} />
          )}
          <input
            id="image"
            accept=".png, .jpg, .jpeg, .pdf, .doc"
            type="file"
            onChange={onFileChange}
            className={classes.inputFileBtnHide}
          />
        </label>
      </div>
      <div className={classes.daysContainer}>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="経過日数"
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          autoFocus
          className={classes.days}
        />
        <Button
          onClick={() => onGetDays(setDays)}
          style={{ margin: "0 0 0 auto" }}
        >
          忘れた
        </Button>
      </div>
      <br />
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="コメント"
        variant="outlined"
        multiline
        fullWidth
        name="name"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className={classes.comment}
      />
      <br />
      <Button
        size="small"
        color="primary"
        type="submit"
        onClick={() => {
          func(days, image, comment);
          setIsOpen(false);
        }}
        className={classes.addBtn}
      >
        追加
      </Button>
      <Button
        size="small"
        color="primary"
        type="submit"
        onClick={() => {
          setIsOpen(false);
        }}
        className={classes.addBtn}
      >
        閉じる
      </Button>
    </Container>
  );
};

export default AddData;
