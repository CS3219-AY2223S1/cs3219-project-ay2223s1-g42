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
      className="z-10 h-full w-full border-b-[1px] border-neutral-900 md:w-48 md:border-r-[1px]"
      value={language}
      setValue={(value) => setLanguage(value as LANGUAGE)}
      values={languages}
      editorPadding={true}
    />
  );
};

export { RoomListBox };
