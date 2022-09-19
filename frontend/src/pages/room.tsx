import { NextPage } from "next";
import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("src/room"), { ssr: false });
const RoomPage: NextPage = () => {
  return (
    <div className="bg-yellow-50 w-full h-screen">
      <DynamicEditor />
    </div>
  );
};

export default RoomPage;
