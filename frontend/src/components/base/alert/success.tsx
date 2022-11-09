import { BaseAlert, Props } from "./base";

const SuccessAlert = ({ title, message }: Props) => {
  return (
    <BaseAlert
      title={title}
      message={message}
      className="bg-green-100 text-green-700"
    />
  );
};

export { SuccessAlert };
