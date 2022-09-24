import { useNavigate } from "react-router";

import { NormalHeading, PrimaryButton } from "src/components";
import { Container } from "./Container";

type Props = {
  title?: string;
};

const UnauthorizedPage = ({
  title = "Unauthorized. Please log in to continue.",
}: Props) => {
  const navigate = useNavigate();
  return (
    <Container className="flex flex-col gap-8">
      <NormalHeading>{title}</NormalHeading>
      <PrimaryButton className="w-full" onClick={() => navigate("/login")}>
        Head to log in page
      </PrimaryButton>
    </Container>
  );
};

export { UnauthorizedPage };
