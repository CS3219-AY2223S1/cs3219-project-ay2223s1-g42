import { useNavigate } from "react-router";

import { NormalHeading, PrimaryButton } from "src/components";
import { Container } from "./Container";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Container className="flex flex-col gap-8">
      <NormalHeading>OOPS. 404 error occurred.</NormalHeading>
      <PrimaryButton className="w-full" onClick={() => navigate("/login")}>
        Head to log in page
      </PrimaryButton>
    </Container>
  );
};

export { ErrorPage };
