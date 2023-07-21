import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./bookDetail.scss";
import { url } from "../const";

export const BookDetail = () => {
  const { id } = useParams(); // 書籍idを取得
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(["token"]);
  const [book, setBook] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(true); // ローディングの状態

  // 画面表示時に書籍取得APIから書籍情報を取得
  useEffect(() => {
    axios
      .get(`${url}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setBook(res.data);
        setLoading(false); // ローディングを終了
      })
      .catch((err) => {
        setErrorMessage(`書籍情報の取得に失敗しました。${err}`);
        setLoading(false); // ローディングを終了
      });
  }, [cookies.token, id]);

  // 書籍一覧画面に戻る
  const onBack = () => {
    navigate("/");
  };

  return (
    <div>
      <Header />
      <main className="bookDetail">
        <h2 className="bookDetail__title">書籍詳細</h2>
        <p className="bookDetail__error-message">{errorMessage}</p>
        {loading ? (
          <p>Loading...</p> // ローディング中の表示
        ) : book ? (
          <div>
            <label>タイトル:</label>
            <p>{book.title}</p>
            <label>URL:</label>
            <p>{book.url}</p>
            <label>詳細:</label>
            <p>{book.detail}</p>
            <label>レビュー:</label>
            <p>{book.review}</p>
            <label>レビュアー:</label>
            <p>{book.reviewer}</p>
          </div>
        ) : (
          <p>書籍情報がありません。</p>
        )}
        <button onClick={onBack}>戻る</button>
      </main>
    </div>
  );
};
