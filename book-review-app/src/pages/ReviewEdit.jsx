import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./reviewEdit.scss";
import { url } from "../const";

export const ReviewEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 書籍IDをURLパラメータから取得
  const [cookies, ,] = useCookies(["token"]);
  const [title, setTitle] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const [detail, setDetail] = useState("");
  const [review, setReview] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  // 画面表示時に書籍取得APIから書籍詳細を取得
  useEffect(() => {
    axios
      .get(`${url}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTitle(res.data.title);
        setBookUrl(res.data.url);
        setDetail(res.data.detail);
        setReview(res.data.review);
      })
      .catch((err) => {
        setErrorMessage(`書籍情報の取得に失敗しました。${err}`);
      });
  }, [cookies.token, id]);

  // 書籍情報の更新を書籍更新APIで行う
  const onUpdateReview = () => {
    axios
      .put(
        `${url}/books/${id}`,
        { title: title, url: bookUrl, detail: detail, review: review },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        // 更新に成功した場合、書籍一覧画面に遷移
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`書籍情報の更新に失敗しました。${err}`);
      });
  };

  // 書籍の削除を書籍削除APIで行う
  const onDeleteReview = () => {
    axios
      .delete(`${url}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        // 削除に成功した場合、書籍一覧画面に遷移
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`書籍の削除に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="reviewEdit">
        <h2 className="reviewEdit__title">書籍レビュー編集</h2>
        <p className="reviewEdit__error-message">{errorMessage}</p>
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
        <button onClick={onUpdateReview}>編集</button>
        <button onClick={onDeleteReview}>削除</button>
      </main>
    </div>
  );
};
