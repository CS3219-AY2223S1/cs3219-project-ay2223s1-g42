import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Axios } from "src/services";
import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
} from "src/components";
import {
  ApiResponse,
  ChangePasswordInfo,
  ChangePasswordInfoSchema,
} from "src/user/types";

const ChangePasswordForm = () => {
  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInfo>({
    resolver: zodResolver(ChangePasswordInfoSchema),
  });

  const changePasswordMutation = useMutation(
    (params: ChangePasswordInfo) =>
      Axios.post<ApiResponse>(`/users/change-password`, params).then(
        (res) => res.data
      ),
    {
      onError: (error) => {
        console.log({ error });
      },
    }
  );

  // submit function
  const handleResetPassword = async (credentials: ChangePasswordInfo) => {
    changePasswordMutation.mutate(credentials);
    reset();
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
        <>
          <SuccessAlert title="Password changed!" />
        </>
      ) : (
        <></>
      )}
      <form className="flex flex-col gap-4 mb-6" onSubmit={onSubmit}>
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
          Change Password
        </PrimaryButton>
      </form>
    </div>
  );
};

export { ChangePasswordForm };
