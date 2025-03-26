import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import settings from '../assets/settings.webp';

const roleOptions = [
  { value: "Team member", label: "Team Member" },
  { value: "Scrum master", label: "Scrum Master" },
  { value: "Product owner", label: "Product Owner" },
];

const Profile = () => {
  const { register, handleSubmit, control, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Updated Profile:", data);
  };

  return (
    <div className="h-screen flex justify-center items-center">
    <div className="max-w-md mx-auto p-2 bg-white border border-[#a40ff3] rounded-lg m-0">
      <h2 className="text-xl font-semibold text-center mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Change Name:</label>
          <input
            {...register("name")}
            className="w-full border p-2 rounded-md"
            placeholder="Enter new name"
          />
        </div>

        <div>
          <label className="block font-medium">Change Password:</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border p-2 rounded-md"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block font-medium">Change Email:</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border p-2 rounded-md"
            placeholder="Enter new email"
          />
        </div>

        <div>
          <label className="block font-medium">Change Role:</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select {...field} options={roleOptions} className="w-full" />
            )}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-300 px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-purple-400"
          >
            Update
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
        <p className="text-gray-600 text-sm mb-2">
          Deleting your account will remove all records permanently.
        </p>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-red-400">
          Delete
        </button>
      </div>
    </div>
    <div className="hidden lg:w-1/2 lg:flex lg:justify-center">
            <img src={settings} alt="Profile" className="w-58 h-58 object-contain rounded-lg hover:scale-110" />
        </div>
    </div>
  );
};

export default Profile;