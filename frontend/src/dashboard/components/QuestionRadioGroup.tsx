import { useState } from "react";

import { BaseRadioGroup } from "src/components";

const difficulties = [
  {
    title: "easy",
    description:
      "Easy questions include simple data structures and concepts such as arrays, strings, and linked lists",
  },
  {
    title: "medium",
    description:
      "Medium questions include somwhat difficult questions such as trees, graphs, and some dynamic programming",
  },
  {
    title: "hard",
    description:
      "Hard questions include more complex algorithms such as binary search, dynamic programming, and graph traversal",
  },
];

export function QuestionRadioGroup() {
  const [selected, setSelected] = useState(difficulties[0]);
  return (
    <BaseRadioGroup
      value={selected}
      setValue={setSelected}
      values={difficulties}
    />
  );
}
