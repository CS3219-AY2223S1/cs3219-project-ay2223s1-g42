import { BigHeading, ErrorPage } from "src/components";
import { useGlobalStore } from "src/store";
import { UserSettingsForm } from "src/features";

const ProfileSettingsPage = () => {
  const user = useGlobalStore((state) => state.user);
  return (
    <>
      {!user ? (
        <ErrorPage />
      ) : (
        <div className="mx-auto flex w-full flex-col px-4 text-center">
          <BigHeading>Settings</BigHeading>
          <UserSettingsForm user={user} />
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;
