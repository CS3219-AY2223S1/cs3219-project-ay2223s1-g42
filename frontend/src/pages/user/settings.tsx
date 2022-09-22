import { ErrorPage } from "src/components";
import { useAuthStore } from "src/hooks";
import { UserSettingsForm } from "src/user/components";

const ProfileSettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      {!user ? (
        <ErrorPage />
      ) : (
        <div className="w-full px-4 flex flex-col text-center mx-auto">
          <h1 className="font-display font-bold leading-tight text-5xl mt-20 text-neutral-900">
            Settings
          </h1>
          <UserSettingsForm user={user} />
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;
