import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />
        <button className="btn btn-primary w-full">Login</button>
        <Link to="/signup">Create account</Link>
      </form>
    </div>
  );
};
export default LoginPage;
