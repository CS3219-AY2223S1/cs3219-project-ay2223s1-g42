import { SpinnerIcon } from "../icons";
import { Container } from "./Container";

const LoadingLayout = () => {
  return (
    <Container>
      <SpinnerIcon className="h-6 w-6" />
    </Container>
  );
};

export { LoadingLayout };
