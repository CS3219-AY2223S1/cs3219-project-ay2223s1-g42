import { ErrorPage } from "src/components";
import { useGlobalStore } from "src/store";
import { UserSettingsForm } from "src/user";

const ProfileSettingsPage = () => {
  const user = useGlobalStore((state) => state.user);
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
