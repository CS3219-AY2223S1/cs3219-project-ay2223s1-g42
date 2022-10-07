import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { EditableCredentials, EditableCredentialsSchema } from "shared/api";
import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
} from "src/components";
import { UserProps } from "src/features";
import { useGlobalStore } from "src/store";

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
  const useEditCredentialsMutation = useGlobalStore(
    (state) => state.useEditCredentialsMutation
  );
  const editCredentialsMutation = useEditCredentialsMutation(id, {
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
    onError: () => {
      reset();
    },
  });

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
      {editCredentialsMutation.isError ? (
        <ErrorAlert title={"Username taken!"} message={"Please try again"} />
      ) : editCredentialsMutation.isSuccess ? (
        <SuccessAlert title="Username changed!" />
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
