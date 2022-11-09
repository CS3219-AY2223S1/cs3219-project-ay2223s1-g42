import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import shallow from "zustand/shallow";
import cx from "classnames";
import toast from "react-hot-toast";

import { AttemptInfo, FlattenedQuestionSummary } from "shared/api";
import { PrimaryDialog, PrimaryButton, BlueButton } from "src/components";
import { Axios } from "src/services";
import { useGlobalStore } from "src/store";

type DialogProps = {
  isOpen: boolean;
  onClose: (isConfirm: boolean) => void;
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
      autoClose={true}
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

const SaveAttemptButton = ({
  questionSummary,
}: {
  questionSummary: FlattenedQuestionSummary;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { room, input } = useGlobalStore((state) => {
    return {
      room: state.room,
      input: state.editorInput,
    };
  }, shallow);
  const queryClient = useQueryClient();
  const saveAttemptMutation = useMutation(
    (body: AttemptInfo) => Axios.post("/attempt", body).then((res) => res.data),
    {
      onSuccess: () => {
        const titleSlug = questionSummary.titleSlug;
        queryClient.invalidateQueries([`${titleSlug}-attempts`]);
        toast.success("Attempt saved!");
      },
    }
  );

  const handleDialogClose = (isConfirm: boolean) => {
    setIsDialogOpen(false);
    if (!isConfirm || !room?.id || !input) {
      return;
    }
    const titleSlug = questionSummary.titleSlug;
    const title = questionSummary.title;
    const roomId = room.id;
    saveAttemptMutation.mutate({
      titleSlug,
      title,
      roomId,
      content: input,
    });
  };

  return (
    <>
      <PrimaryButton
        className={cx(
          "w-full border-[1px] py-2.5 md:border-0 md:border-l-[1px] md:py-2",
          { "cursor-not-allowed bg-neutral-900 text-neutral-100": !input }
        )}
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
