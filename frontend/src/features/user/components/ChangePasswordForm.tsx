import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChangePasswordData, ChangePasswordInfoSchema } from "shared/api";
import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
} from "src/components";
import { useGlobalStore } from "src/store";

const ChangePasswordForm = () => {
  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordInfoSchema),
  });

  const useChangePasswordMutation = useGlobalStore(
    (state) => state.useChangePasswordMutation
  );
  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: () => {
      reset();
    },
  });

  // submit function
  const handleResetPassword = async (credentials: ChangePasswordData) => {
    changePasswordMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleResetPassword);

  return (
    <div>
      {changePasswordMutation.isError ? (
        <ErrorAlert
          title={"Password change failed!"}
          message={"Please check your current password again!"}
        />
      ) : changePasswordMutation.isSuccess ? (
        <SuccessAlert title="Password changed!" />
      ) : (
        <></>
      )}
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextInput
          label="Current Password"
          type="password"
          placeholder="Very$ecureP4ssword"
          isError={!!errors.currentPassword?.message}
          error={errors.currentPassword?.message}
          autoComplete="current-password"
          {...register("currentPassword", { required: true })}
        />
        <TextInput
          label="New Password"
          type="password"
          placeholder="Very$ecureP4ssword"
          isError={!!errors.newPassword?.message}
          error={errors.newPassword?.message}
          autoComplete="new-password"
          {...register("newPassword", { required: true })}
        />
        <PrimaryButton
          className="max-w-3xl"
          type="submit"
          isLoading={changePasswordMutation.isLoading}
        >
          Change password
        </PrimaryButton>
      </form>
    </div>
  );
};

export { ChangePasswordForm };
