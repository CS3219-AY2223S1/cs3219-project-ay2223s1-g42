import { useLocation } from "react-router";
import { useAuthStore } from "src/hooks";
import { Container } from "./container";
import { TheNavbar } from "./navbar";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  // fetch me query
  const user = useAuthStore((state) => state.user);
  const useGetMe = useAuthStore((state) => state.useGetMe);
  useGetMe();

  // current pathname
  const location = useLocation();
  const pathname = location.pathname;

  // layout for room page
  if (user && pathname.startsWith("/room")) {
    return (
      <div className="justify-between min-h-screen h-screen md:max-h-screen bg-neutral-100">
        <TheNavbar />
        <div className="pt-[76px] md:pt-[72px] h-full">{children}</div>
      </div>
    );
  }

  // layout for authenticated pages
  if (user) {
    return (
      <div className="justify-between h-[10000px] min-h-screen bg-neutral-100">
        <TheNavbar />
        <Container>{children}</Container>
      </div>
    );
  }

  // layout for public pages
  return <Container>{children}</Container>;
}
