import { BaseListbox } from "src/components";
import { LANGUAGE, useEditorStore } from "src/room";

const RoomListBox = () => {
  const { language, setLanguage } = useEditorStore((state) => {
    return {
      language: state.language,
      setLanguage: state.setLanguage,
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
