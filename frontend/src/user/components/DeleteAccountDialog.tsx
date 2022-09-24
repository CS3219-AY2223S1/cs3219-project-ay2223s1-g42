import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  ErrorAlert,
  RedButton,
  SecondaryButton,
  TextInput,
} from "src/components/base";
import { PrimaryDialog } from "src/components/base/dialog";
import { useAuthStore } from "src/hooks";
import { DeleteAccountInfo, DeleteAccountInfoSchema } from "src/user/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteAccountDialog = ({ isOpen, onClose }: Props) => {
  const dialogTitle = "Delete account";
  const dialogDescription =
    "Are you sure? Your account will be deleted permanently " +
    "and this action is irreversible! Type your password below " +
    "to confirm this action:";

  const navigate = useNavigate();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountInfo>({
    resolver: zodResolver(DeleteAccountInfoSchema),
  });

  const useDeleteAccountMutation = useAuthStore(
    (state) => state.useDeleteAccountMutation
  );
  const deleteAccountMutation = useDeleteAccountMutation({
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleDeleteAccount = async (info: DeleteAccountInfo) => {
    deleteAccountMutation.mutate(info);
    reset();
  };

  const onSubmit = handleSubmit(handleDeleteAccount);

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      description={dialogDescription}
    >
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        {deleteAccountMutation.isError ? (
          <ErrorAlert
            title="Unable to delete account!"
            message="Invalid password"
          />
        ) : (
          <></>
        )}
        <TextInput
          label="Password"
          type="password"
          placeholder="Very$ecureP4ssword"
          isError={!!errors.password?.message}
          error={errors.password?.message}
          autoComplete="current-password"
          {...register("password", { required: true })}
        />
        <div className="flex gap-3">
          <RedButton type="submit" className="w-full">
            Delete account
          </RedButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </div>
      </form>
    </PrimaryDialog>
  );
};
