import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { SignIn } from "../pages/Signin.jsx";

// モックストアの初期状態を設定
const initialState = {
  auth: {
    isSignIn: false,
  },
};
const mockStore = configureMockStore();
const store = mockStore(initialState);

test("renders the sign in form", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    </Provider>
  );

  // emailとPasswordのラベルが表示されていることを確認
  expect(screen.getByText(/メールアドレス/i)).toBeInTheDocument();
  expect(screen.getByText(/パスワード/i)).toBeInTheDocument();

  // EmailとPasswordの入力フィールドが表示されていることを確認
  expect(screen.getByPlaceholderText(/メールアドレス/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/パスワード/i)).toBeInTheDocument();

  // サインインボタンが表示されていることを確認
  expect(
    screen.getByRole("button", { name: /サインイン/i })
  ).toBeInTheDocument();
});
