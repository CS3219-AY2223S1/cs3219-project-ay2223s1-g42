import { ErrorPage } from "src/components";
import { UserAttemptsTable } from "src/features";
import { useGlobalStore } from "src/store";

const UserAttemptsPage = () => {
  const user = useGlobalStore((state) => state.user);
  return user ? (
    <div className="w-full pb-8 pt-10 lg:min-w-fit">
      <UserAttemptsTable />
    </div>
  ) : (
    <ErrorPage />
  );
};

export default UserAttemptsPage;
