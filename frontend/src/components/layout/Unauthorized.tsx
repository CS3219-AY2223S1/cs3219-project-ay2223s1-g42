import { useNavigate } from "react-router";

import { PrimaryButton } from "src/components";
import { Container } from "./Container";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <Container className="flex flex-col gap-8">
      <h1 className="font-display font-bold text-center leading-tight text-2xl text-neutral-900">
        Unauthorized. Please log in to continue.
      </h1>
      <PrimaryButton className="w-full" onClick={() => navigate("/login")}>
        Head to log in page
      </PrimaryButton>
    </Container>
  );
};

export { UnauthorizedPage };
