import { Spinner } from "../icons";
import { Container } from "./container";

export default function Loading() {
  return (
    <Container>
      <Spinner className="h-6 w-6" />
    </Container>
  );
}
