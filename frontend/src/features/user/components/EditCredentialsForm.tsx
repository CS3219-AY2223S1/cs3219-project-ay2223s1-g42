import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  EditableCredentials,
  EditableCredentialsSchema,
  EditUserResponse,
} from "shared/api";
import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
} from "src/components";
import { UserProps } from "src/features";
import { Axios } from "src/services";

const EditCredentialsForm = ({ user }: UserProps) => {
  const queryClient = useQueryClient();
  const { id, email, username } = user;

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditableCredentials>({
    resolver: zodResolver(EditableCredentialsSchema),
    defaultValues: { username },
  });

  // edit credentials mutation
  const editCredentialsMutation = useMutation(
    (params: EditableCredentials) =>
      Axios.patch<EditUserResponse>(`/users/${id}`, params).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["me"]);
      },
      onError: (error) => {
        console.error({ error });
        reset();
      },
    }
  );

  // submit function
  const handleResetPassword = async (credentials: EditableCredentials) => {
    editCredentialsMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleResetPassword);

  // reset form username if username updated
  useEffect(() => {
    if (!username) {
      return;
    }
    reset({ username });
  }, [username, reset]);

  return (
    <div>
      {editCredentialsMutation.isSuccess ? (
        <SuccessAlert title="Username changed!" />
      ) : editCredentialsMutation.isError ? (
        <ErrorAlert title={"Username taken!"} message={"Please try again"} />
      ) : (
        <></>
      )}
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextInput
          label="Email"
          defaultValue={email}
          type="email"
          placeholder="name@company.com"
          disabled
        />
        <TextInput
          label="Username"
          type="text"
          placeholder="Username123"
          isError={!!errors.username?.message}
          error={errors.username?.message
            ?.toString()
            .replace("String", "Username")}
          autoComplete="username"
          {...register("username", { required: true })}
        />
        <PrimaryButton
          type="submit"
          isLoading={editCredentialsMutation.isLoading}
        >
          Save changes
        </PrimaryButton>
      </form>
    </div>
  );
};

export { EditCredentialsForm };
