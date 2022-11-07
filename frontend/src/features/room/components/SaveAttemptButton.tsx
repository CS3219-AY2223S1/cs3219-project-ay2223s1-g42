import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { PrimaryDialog, PrimaryButton, BlueButton } from "src/components";
import { Axios } from "src/services";

type Props = {
  isOpen: boolean;
  onClose: (isConfirm: boolean) => void;
};

export const SaveAttemptDialog = ({ isOpen, onClose }: Props) => {
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

const SaveAttemptButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const saveAttemptMutation = useMutation(
    () => Axios.post("/attempt").then((res) => res.data),
    {}
  );

  const handleDialogClose = (isConfirm: boolean) => {
    setIsDialogOpen(false);
    if (isConfirm) {
      saveAttemptMutation.mutate();
    }
  };
  return (
    <>
      <PrimaryButton
        className="border-[1px] border-l-neutral-900 py-2.5 md:py-2"
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
