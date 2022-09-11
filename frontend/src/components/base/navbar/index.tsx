import React from "react";

export default function index() {
  return (
    <nav className="fixed w-full bg-gray-750">
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
              "text-lg flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0"
            }
          >
            <ul className="text-white items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="hover:text-gray-600">
                <a href="/mmr">Match</a>
              </li>
              <li className="hover:text-gray-600">
                <a href="/me/history">History</a>
              </li>
              <li className="hover:text-gray-600">
                <a href="/questions">Questions</a>
              </li>
              <li className="hover:text-gray-600">
                <div className="p-4">
                  <div className="group relative">
                    <button className="bg-gray-800 text-white px-5 h-10 rounded">
                      Profile
                    </button>
                    <nav className="bg-white invisible border-gray-800 rounded w-60 absolute left-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1">
                      <ul className="py-1">
                        <li>
                          <a href="#" className="block px-4 py-2">
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
