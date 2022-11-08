import { forwardRef, useState } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from "@dnd-kit/core";
import {
  createSnapModifier,
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
  restrictToWindowEdges,
  snapCenterToCursor,
} from "@dnd-kit/modifiers";
import type { Coordinates } from "@dnd-kit/utilities";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import cx from "classnames";

import styles from "./draggable.module.css";
import { Wrapper } from "./wrapper";

// type Props = {
//   id: string;
// } & React.HTMLAttributes<HTMLDivElement>;

// const Draggable = ({ id, children, className, ...other }: Props) => {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//   });
//   const style = transform
//     ? {
//         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//       }
//     : undefined;

//   return (
//     <div
//       ref={setNodeRef}
//       className={cx("z-999 absolute", className)}
//       style={style}
//       {...listeners}
//       {...attributes}
//       {...other}
//     >
//       {children}
//     </div>
//   );
// };

// export { Draggable };

interface Props {
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
  children?: React.ReactNode;
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      handle,
      label,
      listeners,
      transform,
      style,
      buttonStyle,
      children,
      ...props
    },
    ref
  ) {
    return (
      <div
        className={cx(styles.Draggable)}
        style={
          {
            ...style,
            "--translate-x": `${transform?.x ?? 0}px`,
            "--translate-y": `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        <button
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          tabIndex={handle ? -1 : undefined}
          ref={ref}
          style={buttonStyle}
        >
          {children}
        </button>
        {label ? <label>{label}</label> : null}
      </div>
    );
  }
);

interface DraggableItemProps {
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

function DraggableItem({
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
  children,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: "draggable",
    });

  return (
    <Wrapper>
      <Draggable
        ref={setNodeRef}
        dragging={isDragging}
        handle={handle}
        label={label}
        listeners={listeners}
        style={{ ...style, top, left }}
        buttonStyle={buttonStyle}
        transform={transform}
        {...attributes}
      >
        {children}
      </Draggable>
    </Wrapper>
  );
}

const defaultCoordinates = {
  x: 0,
  y: 0,
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
}

function DraggableStory({
  activationConstraint,
  handle,
  label = "Go ahead, drag me.",
  modifiers,
  style,
  buttonStyle,
}: Props) {
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
      modifiers={modifiers}
    >
      <div>
        <DraggableItem
          label={label}
          handle={handle}
          top={y}
          left={x}
          style={style}
          buttonStyle={buttonStyle}
        />
      </div>
    </DndContext>
  );
}

export { DraggableItem };
