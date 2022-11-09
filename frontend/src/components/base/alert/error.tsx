import { BaseAlert, Props } from "./base";

const ErrorAlert = ({ title, message }: Props) => {
  return (
    <BaseAlert
      title={title}
      message={message}
      className="bg-red-100 text-red-700"
    />
  );
};

export { ErrorAlert };
