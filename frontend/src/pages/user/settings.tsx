import { BigHeading, ErrorPage } from "src/components";
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
          <BigHeading>Settings</BigHeading>
          <UserSettingsForm user={user} />
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;
