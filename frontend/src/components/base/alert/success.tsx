type Props = {
  title: string;
  message?: string;
};

const SuccessAlert = ({ title, message }: Props) => {
  return (
    <div className="mb-4 bg-green-100 p-4 text-sm text-green-700" role="alert">
      <span className="font-medium">{title} </span>
      {message}
    </div>
  );
};

export { SuccessAlert };
