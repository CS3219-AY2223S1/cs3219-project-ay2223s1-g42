import { BaseListbox } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";

const RoomListBox = () => {
  const { language, setLanguage } = useGlobalStore((state) => {
    return {
      language: state.editorLanguage,
      setLanguage: state.setEditorLanguage,
    };
  });
  return (
    <BaseListbox
      value={language}
      setValue={(value) => setLanguage(value as LANGUAGE)}
      values={Object.values(LANGUAGE)}
    />
  );
};

export { RoomListBox };
