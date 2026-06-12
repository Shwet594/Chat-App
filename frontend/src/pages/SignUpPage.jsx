import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const SignUpPage = () => {
const [formData, setFormData] = useState({
fullName: "",
email: "",
password: "",
});
const { signup } = useAuthStore();
const handleSubmit = async (e) => {
e.preventDefault();
await signup(formData);
};
return (
<div className="flex items-center justify-center h-screen">
<form
onSubmit={handleSubmit}
className="space-y-4 w-80"
>
<input
type="text"
placeholder="Full Name"
className="input input-bordered w-full"
value={formData.fullName}
onChange={(e) =>
setFormData({
...formData,
fullName: e.target.value,
})
}
/>
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
<button className="btn btn-primary w-full">
Create Account
</button>
<Link to="/login">
Already have an account?
</Link>
</form>
</div>
);
};
export default SignUpPage;