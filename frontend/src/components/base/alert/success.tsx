type Props = {
  title: string;
  message?: string;
};

const SuccessAlert = ({ title, message }: Props) => {
  return (
    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100" role="alert">
      <span className="font-medium">{title} </span>
      {message}
    </div>
  );
};

export { SuccessAlert };
