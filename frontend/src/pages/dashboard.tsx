import { Navbar } from "../components/layout/navbar";

export default function dashboard() {
  return (
    <div className="justify-between text-gray-100 min-h-screen bg-black">
      <Navbar />
      <div className="flex h-screen items-center">
        <div className="m-auto space-y-10">
          <h1 className="text-5xl">Welcome to PeerPrep</h1>
          <div className="flex flex-col">
            <button className="outline outline-offset-2 outline-2 rounded-md p-1">
              Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
