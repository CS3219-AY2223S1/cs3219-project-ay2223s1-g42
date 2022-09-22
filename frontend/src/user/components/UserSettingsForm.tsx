import { Divider, RedButton } from "src/components";
import { UserProps } from "src/user/types";
import { ChangePasswordForm, EditCredentialsForm } from "src/user/components";

const UserSettingsForm = ({ user }: UserProps) => {
  return (
    <div className="flex flex-col">
      <Divider label="Basic Information" />
      <EditCredentialsForm user={user} />
      <Divider label="Password" />
      <ChangePasswordForm />
      <Divider label="Delete Account" />
      <RedButton type="submit">Delete Account</RedButton>
    </div>
  );
};

export { UserSettingsForm };
