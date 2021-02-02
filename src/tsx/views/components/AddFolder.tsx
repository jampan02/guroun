import React from "react";
import { db, firebaseApp } from "../../../ts/firebase";
import Folder from "./Folder";
import firebase from "firebase";

const AddFolder = ({ myFolders, setIsOpen, func }: any) => {
  //フォルダ名変えるやつ
  const onSubmit = async (name: string, folderName: string) => {
    //同名ファイル排除
    // eslint-disable-next-line array-callback-return
    const check = myFolders.some((data: any) => {
      if (data === folderName) {
        alert("同じ名前のフォルダーは作成できません");
        return true;
      }
    });
    if (check) {
      return;
    }
    const user = firebaseApp.auth().currentUser;
    if (user !== null) {
      // User is signed in.
      await db.collection("folders").doc(user.uid).collection("myFolders").add({
        folderName: folderName,
        createdAt: firebase.firestore.Timestamp.now(),
      });
    }
    func();
    setIsOpen(false);
  };
  return (
    <div>
      <Folder submitName="追加" onSubmit={onSubmit} />
    </div>
  );
};

export default AddFolder;
