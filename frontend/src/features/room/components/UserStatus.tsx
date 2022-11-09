import { HTMLAttributes } from "react";
import cx from "classnames";

import { RoomUser } from "shared/api";
import { CheckIcon, SpinnerIcon } from "src/components";

const UserStatus = ({
  user,
  className,
}: {
  user: RoomUser;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) => {
  return (
    <div className={cx("flex flex-row gap-1 text-base md:text-sm", className)}>
      {user.connected ? (
        <CheckIcon className="h-4 w-4 stroke-[3px] text-green-500" />
      ) : (
        <SpinnerIcon className="h-4 w-4" />
      )}
      <span>{user.username}</span>
    </div>
  );
};

export { UserStatus };
