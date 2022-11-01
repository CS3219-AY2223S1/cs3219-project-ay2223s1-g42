import { QuestionsTable } from "src/features/questions/QuestionsTable";

const QuestionsPage = () => {
  console.log("questions page rendered");
  return (
    <div className="w-full pb-8 pt-10 lg:min-w-fit">
      <QuestionsTable />
    </div>
  );
};

export default QuestionsPage;
