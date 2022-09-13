import { useAuthStore } from "src/login";
import { Container } from "./container";
import { TheNavbar } from "./navbar";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  // fetch me query
  const user = useAuthStore((state) => state.user);
  const useGetMe = useAuthStore((state) => state.getMe);
  useGetMe();

  if (user) {
    return (
      <div className="justify-between h-[10000px] min-h-screen bg-neutral-100">
        <TheNavbar />
        <Container>{children}</Container>
      </div>
    );
  } else {
    return <Container>{children}</Container>;
  }
}