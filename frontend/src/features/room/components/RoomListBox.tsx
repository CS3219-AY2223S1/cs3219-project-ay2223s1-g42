import shallow from "zustand/shallow";

import { BaseListbox } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";

const languages = Object.values(LANGUAGE);

const RoomListBox = () => {
  const { language, setLanguage } = useGlobalStore((state) => {
    return {
      language: state.editorLanguage,
      setLanguage: state.setEditorLanguage,
    };
  }, shallow);
  return (
    <BaseListbox
      className="z-10 h-full w-48 border-r-[1px] border-b-[1px] border-neutral-900"
      value={language}
      setValue={(value) => setLanguage(value as LANGUAGE)}
      values={languages}
    />
  );
};

export { RoomListBox };
