import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import "./userEdit.scss";
import { url } from "../const";

export const UserEdit = () => {
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(["token"]);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  // 画面表示時にユーザー情報取得APIからユーザー名を取得
  useEffect(() => {
    axios
      .get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setName(res.data.name);
      })
      .catch((err) => {
        setErrorMessage(`ユーザー情報の取得に失敗しました。${err}`);
      });
  }, [cookies.token]);

  // 名前の変更をユーザー情報更新APIで行う
  const onUpdateName = () => {
    axios
      .put(
        `${url}/users`,
        { name: name },
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
        setErrorMessage(`ユーザー情報の更新に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="userEdit">
        <h2 className="userEdit__title">ユーザー情報編集</h2>
        <p className="userEdit__error-message">{errorMessage}</p>
        <label>名前:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={onUpdateName}>変更</button>
      </main>
    </div>
  );
};
