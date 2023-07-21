import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signOut } from "../authSlice";
import "./header.scss";
import { url } from "../const";

export const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [username, setUsername] = useState(""); // ユーザー名
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ

  // ユーザー情報取得
  useEffect(() => {
    if (auth) {
      axios
        .get(`${url}/users`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }) // ヘッダーに認証情報を付加してAPIを呼び出す
        .then((res) => {
          setUsername(res.data.name); // レスポンスからユーザー名を取得
        })
        .catch((err) => {
          setErrorMessage(`ユーザー情報の取得に失敗しました。${err}`); // エラーメッセージをセット
        });
    }
  }, [auth]);

  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie("token");
    navigate("/signin");
  };

  // ユーザー情報編集画面への遷移
  const handleUserEdit = () => {
    navigate("/profile");
  };

  return (
    <header className="header">
      <h1>書籍レビューアプリ</h1>
      {auth ? (
        // ログイン済みの場合はユーザー名を表示し、ユーザー情報編集ボタンを追加
        <div>
          <span>ようこそ、{username}さん</span>
          <button onClick={handleSignOut} className="sign-out-button">
            サインアウト
          </button>
          <button onClick={handleUserEdit} className="user-edit-button">
            ユーザー情報編集
          </button>
        </div>
      ) : (
        // 未ログインの場合はログインボタンを表示
        <button onClick={() => navigate("/signin")} className="sign-in-button">
          ログイン
        </button>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {/* エラーメッセージを表示 */}
    </header>
  );
};
