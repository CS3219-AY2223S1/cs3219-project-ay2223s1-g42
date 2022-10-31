import { QuestionsTable } from "src/features/questions/QuestionsTable";

const QuestionsPage = () => {
  console.log("questions page rendered");
  return (
    <div className="flex w-full flex-col justify-start bg-blue-400 px-4 pb-4 pt-20 text-center lg:min-w-fit">
      <QuestionsTable />
    </div>
  );
};

export default QuestionsPage;
