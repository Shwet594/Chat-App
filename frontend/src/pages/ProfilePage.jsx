import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile } =
    useAuthStore();

  const [fullName, setFullName] = useState(
    authUser.fullName
  );

  const [selectedImage, setSelectedImage] =
    useState(authUser.profilePic);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      setSelectedImage(reader.result);
    };
  };

  const handleSave = async () => {
    await updateProfile({
      fullName,
      profilePic: selectedImage,
    });

    alert("Profile Updated");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">
            Profile
          </h2>

          <div className="flex justify-center">
            <img
              src={
                selectedImage ||
                "/avatar.png"
              }
              alt=""
              className="w-28 h-28 rounded-full object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered"
            onChange={handleImageChange}
          />

          <input
            type="text"
            className="input input-bordered"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
          />

          <input
            type="email"
            className="input input-bordered"
            value={authUser.email}
            disabled
          />

          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;