import { useNavigate } from "react-router";

import { PrimaryButton } from "src/components";
import { Container } from "./Container";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Container className="flex flex-col gap-8">
      <h1 className="font-display font-bold text-center leading-tight text-3xl text-neutral-900">
        OOPS. 404 error occurred.
      </h1>
      <PrimaryButton className="w-full" onClick={() => navigate("/login")}>
        Head to log in page
      </PrimaryButton>
    </Container>
  );
};

export { ErrorPage };
