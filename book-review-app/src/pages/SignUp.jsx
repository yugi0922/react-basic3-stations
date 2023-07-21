import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Redirect } from "react-router-dom";
import { signIn } from "../authSlice";
import { Header } from "../components/Header";
import { url } from "../const";
import "./signUp.scss";
import Compressor from "compressorjs";

export const SignUp = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const fileInputRef = useRef();
  const [file, setFile] = useState(null);

  // useEffectを追加し、ログイン済みの場合に一覧画面にリダイレクト
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleIconChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.size > 1024 * 1024) {
      try {
        const compressedFile = await new Promise((resolve, reject) => {
          new Compressor(selectedFile, {
            quality: 0.6,
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        });
        setFile(compressedFile);
      } catch (err) {
        setErrorMessage(`ファイルの圧縮に失敗しました。 ${err}`);
        setFile(null);
      }
    } else {
      setFile(selectedFile);
    }
  };

  const onFileInputClick = () => {
    fileInputRef.current.value = "";
  };

  const onSignUp = async () => {
    let errorFlag = false;

    if (!email) {
      setErrorMessage("メールアドレスは必須です");
      errorFlag = true;
    }

    if (!name) {
      setErrorMessage("ユーザ名は必須です");
      errorFlag = true;
    }

    if (!password) {
      setErrorMessage("パスワードは必須です");
      errorFlag = true;
    }

    if (!file) {
      setErrorMessage("ユーザーアイコンは必須です");
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }

    const data = {
      email: email,
      name: name,
      password: password,
    };

    try {
      const res = await axios.post(`${url}/users`, data);
      const token = res.data.token;
      dispatch(signIn());
      setCookie("token", token);

      const formData = new FormData();
      formData.append("icon", file);
      await axios.post(`${url}/uploads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/");
    } catch (err) {
      setErrorMessage(`サインアップに失敗しました。 ${err}`);
    }
  };

  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form">
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            onChange={handleEmailChange}
            className="email-input"
          />
          <br />
          <label>ユーザ名</label>
          <br />
          <input
            type="text"
            onChange={handleNameChange}
            className="name-input"
          />
          <br />
          <label>パスワード</label>
          <br />
          <input
            type="password"
            onChange={handlePasswordChange}
            className="password-input"
          />
          <br />
          <label>ユーザーアイコン</label>
          <br />
          <input
            type="file"
            ref={fileInputRef}
            onClick={onFileInputClick}
            onChange={handleIconChange}
            className="icon-input"
          />
          <br />
          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
        <p>
          アカウントをお持ちですか？ <a href="/signin">ログイン</a>
        </p>
      </main>
    </div>
  );
};
