import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/signup"
        element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
export default App;
