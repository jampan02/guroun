import React, { useState } from "react";
import img from "../../../img/docImage.png";
import Result from "../pages/main/datas/Result/Result";
import Modal from "react-modal";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  img: {
    marginTop: "10px",
    marginBottom: "10px",
    maxWidth: "200px",
  },
}));
//

const Data = ({ data, onDeleteDoc, updateData }: any) => {
  const classes = useStyles();
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <div style={{ textAlign: "center" }} onClick={() => setIsOpen(true)}>
          <img src={img} alt="ドキュメント" className={classes.img} />
          <Typography variant="h5" align="center">
            {`${data.days}日目`}
          </Typography>
        </div>
        <Button
          size="small"
          color="secondary"
          onClick={() => onDeleteDoc(data.id)}
        >
          削除
        </Button>

        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
        >
          <Result data={data} setIsOpen={setIsOpen} updateData={updateData} />
        </Modal>
      </Card>
    </Grid>
  );
};

export default Data;
