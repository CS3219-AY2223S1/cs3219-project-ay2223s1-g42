type ApiResponse = {
  message: string;
};

type FormType = "signup" | "signin";

type FormProps = {
  setForm: (form: FormType) => void;
};

export type { ApiResponse, FormProps, FormType };
