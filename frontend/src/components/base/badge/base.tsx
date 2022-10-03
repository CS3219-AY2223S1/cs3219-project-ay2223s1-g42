import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  value?: any;
  styling?: any;
};

const Badge = (props: Props) => {
  return (
    <div className="flex flex-col space-y-4 bg-slate-300">
      <div>{props.value}</div>
    </div>
  );
};

export { Badge };
