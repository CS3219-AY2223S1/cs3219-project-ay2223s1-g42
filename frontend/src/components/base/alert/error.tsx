type Props = {
  title: string;
  message?: string;
};

const ErrorAlert = ({ title, message }: Props) => {
  return (
    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100" role="alert">
      <span className="font-medium">{title} </span>
      {message}
    </div>
  );
};

export { ErrorAlert };
