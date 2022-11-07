import { ErrorPage } from "src/components";
import { UserAttemptTable } from "src/features";
import { useGlobalStore } from "src/store";

const UserAttemptsPage = () => {
  const user = useGlobalStore((state) => state.user);
  return user ? (
    <div className="w-full pb-8 pt-10 lg:min-w-fit">
      <UserAttemptTable />
    </div>
  ) : (
    <ErrorPage />
  );
};

export default UserAttemptsPage;
