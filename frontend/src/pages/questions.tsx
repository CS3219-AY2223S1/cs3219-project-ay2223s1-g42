import { BigHeading } from "src/components";
import { QuestionsTable } from "src/features/questions/QuestionsTable";

const QuestionsPage = () => {
  return (
    <div className="flex w-full flex-col justify-start px-4 pt-20 text-center">
      <BigHeading className="mb-4">Questions</BigHeading>
      <QuestionsTable />
    </div>
  );
};

export default QuestionsPage;
