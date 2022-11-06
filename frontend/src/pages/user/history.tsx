import { ErrorPage } from "src/components";
import { UserHistoryTable } from "src/features";
import { useGlobalStore } from "src/store";

const UserHistoryPage = () => {
  const user = useGlobalStore((state) => state.user);
  return user ? (
    <div className="w-full pb-8 pt-10 lg:min-w-fit">
      <UserHistoryTable />
    </div>
  ) : (
    <ErrorPage />
  );
};

export default UserHistoryPage;
