import { useState } from "react";

import { Divider, RedButton } from "src/components";
import {
  ChangePasswordForm,
  EditCredentialsForm,
  UserProps,
} from "src/features";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

const UserSettingsForm = ({ user }: UserProps) => {
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState<boolean>(false);

  const handleDeleteAccountButtonClick = () => {
    setIsDeleteAccountDialogOpen(true);
  };

  const handleDeleteAccountDialogClose = () => {
    setIsDeleteAccountDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <Divider label="Basic Information" />
        <EditCredentialsForm user={user} />
      </div>
      <div className="flex flex-col">
        <Divider label="Password" />
        <ChangePasswordForm />
      </div>
      <div className="flex flex-col">
        <Divider label="Delete Account" />
        <RedButton onClick={handleDeleteAccountButtonClick}>
          Delete account
        </RedButton>
        <DeleteAccountDialog
          isOpen={isDeleteAccountDialogOpen}
          onClose={handleDeleteAccountDialogClose}
        />
      </div>
    </div>
  );
};

export { UserSettingsForm };
