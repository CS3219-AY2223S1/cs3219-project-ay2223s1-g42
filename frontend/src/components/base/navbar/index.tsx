import React from "react";

export default function index() {
  return (
    <nav className="w-full bg-gray-750">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <a href="/dashboard">
              <h2 className="text-2xl font-bold text-white">PeerPrep</h2>
            </a>
          </div>
        </div>
        <div>
          <div
            className={
              "flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0"
            }
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-white hover:text-gray-850">
                <a href="/mmr">Match</a>
              </li>
              <li className="text-white hover:text-gray-850">
                <a href="/me/history">History</a>
              </li>
              <li className="text-white hover:text-gray-850">
                <a href="/questions">Questions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
