type Props = {
  title: string;
  message?: string;
};

const ErrorAlert = ({ title, message }: Props) => {
  return (
    <div className="mb-4 bg-red-100 p-4 text-sm text-red-700" role="alert">
      <span className="font-medium">{title} </span>
      {message}
    </div>
  );
};

export { ErrorAlert };
