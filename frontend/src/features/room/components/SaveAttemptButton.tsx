import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import shallow from "zustand/shallow";
import cx from "classnames";

import { AttemptInfo, GetSummariesResponse } from "shared/api";
import { PrimaryDialog, PrimaryButton, BlueButton } from "src/components";
import { Axios } from "src/services";
import { useGlobalStore } from "src/store";

type DialogProps = {
  isOpen: boolean;
  onClose: (isConfirm: boolean) => void;
};

type ButtonProps = {
  questionSummaries: GetSummariesResponse;
};

export const SaveAttemptDialog = ({ isOpen, onClose }: DialogProps) => {
  const dialogTitle = "Save attempt";
  const dialogDescription =
    "Are you sure? This will overwrite your previously " +
    "saved attempts for this question in this room!";

  const handleCancel = () => {
    onClose(false);
  };

  const handleConfirm = () => {
    onClose(true);
  };

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={handleCancel}
      title={dialogTitle}
      description={dialogDescription}
    >
      <div className="mt-3 flex flex-col gap-2">
        <BlueButton onClick={handleConfirm} className="w-full">
          Yes
        </BlueButton>
        <PrimaryButton onClick={handleCancel} className="w-full">
          No
        </PrimaryButton>
      </div>
    </PrimaryDialog>
  );
};

const SaveAttemptButton = ({ questionSummaries }: ButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { room, input, questionIdx } = useGlobalStore((state) => {
    return {
      room: state.room,
      input: state.editorInput,
      questionIdx: state.questionIdx,
    };
  }, shallow);

  const saveAttemptMutation = useMutation((body: AttemptInfo) =>
    Axios.post("/attempt", body).then((res) => res.data)
  );

  const handleDialogClose = (isConfirm: boolean) => {
    setIsDialogOpen(false);
    if (isConfirm && room?.id && input) {
      const questionSummary = questionSummaries[questionIdx];
      const titleSlug = questionSummary.titleSlug;
      const title = questionSummary.title;
      const roomId = room.id;

      saveAttemptMutation.mutate({
        titleSlug,
        title,
        roomId,
        content: input,
      });
    }
  };
  return (
    <>
      <PrimaryButton
        className={cx("border-[1px] border-l-neutral-900 py-2.5 md:py-2", {
          hidden: !input,
        })}
        disabled={!input}
        onClick={() => setIsDialogOpen(true)}
        isLoading={saveAttemptMutation.isLoading}
      >
        Save attempt
      </PrimaryButton>
      <SaveAttemptDialog onClose={handleDialogClose} isOpen={isDialogOpen} />
    </>
  );
};

export { SaveAttemptButton };
