import { useDroppable } from "@dnd-kit/core";
import cx from "classnames";

type Props = {
  id: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Droppable = ({ id, children, className, ...other }: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cx(className, {
        "bg-green-400": isOver,
      })}
      {...other}
    >
      {children}
    </div>
  );
};

export { Droppable };
