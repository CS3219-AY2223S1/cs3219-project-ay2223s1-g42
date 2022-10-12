import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import {
  DeleteAccountData,
  DeleteAccountInfoSchema,
  DeleteAccountResponse,
} from "shared/api";
import {
  ErrorAlert,
  RedButton,
  TextInput,
  PrimaryDialog,
  SuccessAlert,
  PrimaryButton,
} from "src/components";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";

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
  } = useForm<DeleteAccountData>({
    resolver: zodResolver(DeleteAccountInfoSchema),
  });

  const clearUser = useGlobalStore((state) => state.clearUser);
  const deleteAccountMutation = useMutation(
    (params: DeleteAccountData) =>
      Axios.post<DeleteAccountResponse>(`/auth/delete-account`, params).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        reset();
        clearUser();
        navigate("/");
      },
      onError: (error) => {
        console.error({ error });
      },
    }
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDeleteAccount = async (info: DeleteAccountData) => {
    deleteAccountMutation.mutate(info);
  };
  const onSubmit = handleSubmit(handleDeleteAccount);

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={dialogTitle}
      description={dialogDescription}
    >
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        {deleteAccountMutation.isSuccess ? (
          <SuccessAlert title="Account deleted!" message="Redirecting..." />
        ) : deleteAccountMutation.isError ? (
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
        <div className="mt-3 flex flex-col gap-3">
          <RedButton type="submit" className="w-full">
            Delete account
          </RedButton>
          <PrimaryButton onClick={handleClose} className="w-full">
            Cancel
          </PrimaryButton>
        </div>
      </form>
    </PrimaryDialog>
  );
};
