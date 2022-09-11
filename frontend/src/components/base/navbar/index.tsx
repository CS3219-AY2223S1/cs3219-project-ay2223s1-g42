import { PrimaryButton } from "../button";

const LINKS = [
  {
    href: "/mmr",
    title: "match",
  },
  {
    href: "/history",
    title: "history",
  },
  {
    href: "/questions",
    title: "questions",
  },
];

export function Navbar() {
  return (
    <nav className="sticky h-16 text-lg top-0 z-50 bg-red-200">
      <div className=" h-full justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div className="flex items-center justify-between md:block">
          <a href="/dashboard">
            <h2 className="text-2xl font-bold text-white">PeerPrep</h2>
          </a>
        </div>
        <div>
          <div
            className={
              "text-lg flex-1 justify-self-center pb-3 md:block md:pb-0 md:mt-0"
            }
          >
            <ul className="text-white items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {LINKS.map(({ href, title }) => (
                <li key={href} className="hover:text-gray-600 capitalize">
                  <a href={href}>{title}</a>
                </li>
              ))}
              <li className="hover:text-gray-600">
                <div>
                  <PrimaryButton>Profile</PrimaryButton>
                  {/* <div className="group relative">
                    <PrimaryButton>Profile</PrimaryButton>
                    <nav className="bg-red-500 invisible border-gray-800 rounded w-60 absolute left-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1">
                      <ul className="py-1">
                        <li>
                          <a href="#" className="block px-4 py-2">
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div> */}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
