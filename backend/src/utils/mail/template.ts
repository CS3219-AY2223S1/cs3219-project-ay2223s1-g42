export const generateEmailFromField = (name: string, email: string): string => {
  return '"' + name + '"' + "<" + email + ">";
};
