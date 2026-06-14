import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser, checkAuth } = useAuthStore();

  // ✅ run once on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // ❌ removed focus re-check (it causes lag + repeated API calls)
  // we’ll rely on socket reconnect instead (better UX)

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