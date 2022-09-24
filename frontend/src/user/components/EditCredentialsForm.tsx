import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
} from "src/components";
import { EditableCredentials, EditableCredentialsSchema } from "src/user/types";
import { UserProps } from "src/user/types";
import { useAuthStore } from "src/hooks";

const EditCredentialsForm = ({ user }: UserProps) => {
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

  const useEditCredentialsMutation = useAuthStore(
    (state) => state.useEditCredentialsMutation
  );
  const editCredentialsMutation = useEditCredentialsMutation(id, {
    onSuccess: () => {
      reset();
    },
  });

  // submit function
  const handleResetPassword = async (credentials: EditableCredentials) => {
    editCredentialsMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleResetPassword);

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
          error={errors.username?.message?.replace("String", "Username")}
          autoComplete="username"
          {...register("username", { required: true })}
        />
        <PrimaryButton
          type="submit"
          isLoading={editCredentialsMutation.isLoading}
        >
          Save Changes
        </PrimaryButton>
      </form>
    </div>
  );
};

export { EditCredentialsForm };
