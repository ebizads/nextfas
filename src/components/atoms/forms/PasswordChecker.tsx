import { useMemo } from "react";

const PasswordChecker = ({ password }: { password: string }) => {
  const hasEnoughCharacter = useMemo(() => {
    return password.length >= 12 && password.length < 20 ? true : false;
  }, [password]);
  const hasNumber = useMemo(() => {
    const checkNumber = /(?=.*\d)/gm;
    return password.match(checkNumber) ? true : false;
  }, [password]);
  const hasSmallLetter = useMemo(() => {
    const checkSmallLetter = /(?=.*[a-z])/gm;
    return password.match(checkSmallLetter) ? true : false;
  }, [password]);
  const hasCapitalLetter = useMemo(() => {
    const checkCapitalLetter = /(?=.*[A-Z])/gm;
    return password.match(checkCapitalLetter) ? true : false;
  }, [password]);
  const hasSpecialCharacter = useMemo(() => {
    const checkSpecialCharacter = /(?=.*[-+_!@#$%^&*.,?])/gm;
    return password.match(checkSpecialCharacter) ? true : false;
  }, [password]);

  const checkAll = useMemo(() => {
    return (
      hasEnoughCharacter &&
      hasNumber &&
      hasSmallLetter &&
      hasCapitalLetter &&
      hasSpecialCharacter
    );
  }, [
    hasEnoughCharacter,
    hasNumber,
    hasSmallLetter,
    hasCapitalLetter,
    hasSpecialCharacter,
  ]);

  return (
    <div
      className={`text-xs rounded-md overflow-hidden space-y-2 transition-height duration-150 ${
        checkAll
          ? "border-green-500 bg-green-50 text-green-500"
          : "border-red-500 bg-red-50 text-red-500"
      } ${password.length === 0 ? "max-h-0" : "max-h-96 p-4 border"}`}
    >
      <PasswordMatcher
        matcher={hasEnoughCharacter}
        label={"Must have 12 to 20 characters"}
      />
      <PasswordMatcher
        matcher={hasNumber}
        label={"Must contain at least 1 number"}
      />
      <PasswordMatcher
        matcher={hasCapitalLetter}
        label={"Must contain 1 capital letter"}
      />
      <PasswordMatcher
        matcher={hasSmallLetter}
        label={"Must contain 1 small letter"}
      />
      <PasswordMatcher
        matcher={hasSpecialCharacter}
        label={"Must contain 1 special character"}
      />
    </div>
  );
};

export default PasswordChecker;

const PasswordMatcher = ({
  matcher,
  label,
}: {
  matcher: boolean;
  label: string;
}) => {
  return (
    <p className={`flex gap-2 items-center ${matcher ? "text-green-500" : ""}`}>
      <i className={`fa-solid ${matcher ? "fa-check" : "fa-xmark"}`} />
      {label}
    </p>
  );
};
