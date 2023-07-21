import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import "./newReview.scss";
import { url } from "../const";

export const NewReview = () => {
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(["token"]);
  const [title, setTitle] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const [detail, setDetail] = useState("");
  const [review, setReview] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  // レビューの登録
  const onRegisterReview = () => {
    axios
      .post(
        `${url}/books`,
        { title: title, url: bookUrl, detail: detail, review: review },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        // 登録に成功した場合、書籍一覧画面に遷移
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`書籍の登録に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="newReview">
        <h2 className="newReview__title">新規レビュー登録</h2>
        <p className="newReview__error-message">{errorMessage}</p>
        <label>タイトル:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>URL:</label>
        <input
          type="text"
          value={bookUrl}
          onChange={(e) => setBookUrl(e.target.value)}
        />
        <label>詳細:</label>
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <label>レビュー:</label>
        <input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button onClick={onRegisterReview}>登録</button>
      </main>
    </div>
  );
};
