import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import "./bookList.scss";
import { url } from "../const";

export const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [errorMessage, setErrorMessage] = useState();
  const [cookies, ,] = useCookies(["token"]);

  useEffect(() => {
    fetchBooks();
  }, [offset]);

  const fetchBooks = () => {
    const headers = {};
    // ログイン済みの場合はトークンをヘッダーに追加
    if (cookies.token) {
      headers.Authorization = `Bearer ${cookies.token}`;
    }
    axios
      // ログイン済みの場合はログイン済みAPIを使用
      .get(`${url}${cookies.token ? "/books" : "/public/books"}`, {
        params: {
          offset: offset,
        },
        // ヘッダーをリクエストに追加
        headers: headers,
      })
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        if (err.response) {
          setErrorMessage(
            `書籍の取得に失敗しました。${err.response.data.ErrorMessageJP}`
          );
        } else {
          setErrorMessage(`書籍の取得に失敗しました。${err}`);
        }
      });
  };

  const onNextPage = () => {
    setOffset(offset + 10);
  };

  // ユーザー情報編集画面への遷移
  const navigateToUserEdit = () => {
    navigate("/profile");
  };

  // 新規レビュー登録画面への遷移
  const navigateToNewReview = () => {
    navigate("/new");
  };

  // 書籍詳細画面への遷移とログAPIの呼び出し
  const navigateToBookDetail = (id) => {
    navigate(`/books/${id}`); // 書籍詳細画面に遷移
    axios
      .post(
        `${url}/logs`,
        { selectBookId: id },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .catch((err) => {
        console.error(`ログの送信に失敗しました。${err}`);
      });
  };

  // 書籍レビュー編集画面への遷移
  const navigateToReviewEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div>
      <Header />
      <main className="booklist">
        <h2 className="booklist__title">書籍一覧</h2>
        <p className="booklist__error-message">{errorMessage}</p>
        {cookies.token && (
          // ログイン済みの場合のみユーザー情報編集ボタンとレビュー登録ボタンを表示
          <div>
            <button onClick={navigateToUserEdit}>ユーザー情報編集</button>
            <button onClick={navigateToNewReview}>レビュー登録</button>
          </div>
        )}
        {books.map((book, index) => (
          <div key={index} className="booklist__item">
            <p>
              <strong>Title:</strong>
              <span className="booklist__item__title">{book.title}</span>
            </p>
            <p>
              <strong>Detail:</strong>
              <span className="booklist__item__detail">{book.detail}</span>
            </p>
            <p>
              <strong>URL:</strong>
              <span className="booklist__item__url">
                <a href={book.url}>URL</a>
              </span>
            </p>
            <p>
              <strong>Review:</strong>
              <span className="booklist__item__review">{book.review}</span>
            </p>
            <p>
              <strong>Reviewer:</strong>
              <span className="booklist__item__reviewer">{book.reviewer}</span>
            </p>
            <button
              className="booklist__item__button"
              onClick={() => navigateToBookDetail(book.id)}
            >
              詳細
            </button>
            {book.isMine && (
              // ログインユーザーが作成したレビューの場合、編集ボタンを表示
              <button
                className="booklist__item__button"
                onClick={() => navigateToReviewEdit(book.id)}
              >
                編集
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="booklist__next-button"
          onClick={onNextPage}
        >
          次のページ
        </button>
      </main>
    </div>
  );
};
