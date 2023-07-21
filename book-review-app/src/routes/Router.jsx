import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { Navigate } from "react-router-dom";
import { BookList } from "../pages/BookList";
// ユーザー情報編集画面
import { UserEdit } from "../pages/UserEdit";
// レビュー登録画面
import { NewReview } from "../pages/NewReview";
// 書籍詳細画面
import { BookDetail } from "../pages/BookDetail";
// 書籍レビュー編集画面
import { ReviewEdit } from "../pages/ReviewEdit"; // 必要に応じて適切にインポートしてください

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          // ログイン済みの場合はリダイレクト
          element={auth ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/signup"
          // ログイン済みの場合はリダイレクト
          element={auth ? <Navigate to="/" /> : <SignUp />}
        />
        <Route path="/" element={<BookList />} />
        <Route
          path="/profile"
          // ログイン済みでない場合はリダイレクト
          element={auth ? <UserEdit /> : <Navigate to="/signin" />}
        />
        <Route
          path="/new"
          // ログイン済みでない場合はリダイレクト
          element={auth ? <NewReview /> : <Navigate to="/signin" />}
        />
        <Route
          path="/books/:id"
          // ログイン済みでない場合はリダイレクト
          element={auth ? <BookDetail /> : <Navigate to="/signin" />}
        />
        <Route
          path="/edit/:id"
          // ログイン済みでない場合はリダイレクト
          element={auth ? <ReviewEdit /> : <Navigate to="/signin" />}
        />
      </Routes>
    </BrowserRouter>
  );
};
