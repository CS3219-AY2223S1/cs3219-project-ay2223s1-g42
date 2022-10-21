import { MatchType } from "shared/api";
import {
  BaseCheckGroup,
  BaseRadioGroup,
  CheckGroupValue,
  RadioGroupValue,
} from "src/components";

type Props = {
  selectedType: MatchType[];
  setType: (types: MatchType) => void;
  types: CheckGroupValue<MatchType>[];
};

const MatchTypeCheckGroup = ({ selectedType, setType, types }: Props) => {
  return (
    <BaseCheckGroup
      selectedValues={selectedType}
      updateSelectedValues={setType}
      values={types}
    />
  );
};

export { MatchTypeCheckGroup };
