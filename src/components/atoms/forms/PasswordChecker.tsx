import { useMemo } from "react"

const PasswordChecker = ({ password }: { password: string }) => {
  const checkNumber = /(?=.*\d)/gm
  const checkSmallLetter = /(?=.*[a-z])/gm
  const checkCapitalLetter = /(?=.*[A-Z])/gm
  const checkSpecialCharacter = /(?=.*[-+_!@#$%^&*.,?])/gm

  const hasEnoughCharacter = useMemo(() => {
    return password.length >= 12 && password.length < 20 ? true : false
  }, [password])
  const hasNumber = useMemo(() => {
    return password.match(checkNumber) ? true : false
  }, [password])
  const hasSmallLetter = useMemo(() => {
    return password.match(checkSmallLetter) ? true : false
  }, [password])
  const hasCapitalLetter = useMemo(() => {
    return password.match(checkCapitalLetter) ? true : false
  }, [password])
  const hasSpecialCharacter = useMemo(() => {
    return password.match(checkSpecialCharacter) ? true : false
  }, [password])

  const checkAll = useMemo(() => {
    return (
      hasEnoughCharacter &&
      hasNumber &&
      hasSmallLetter &&
      hasCapitalLetter &&
      hasSpecialCharacter
    )
  }, [
    hasEnoughCharacter,
    hasNumber,
    hasSmallLetter,
    hasCapitalLetter,
    hasSpecialCharacter,
  ])

  return (
    <div
      className={`border text-xs p-4 rounded-md space-y-2 ${
        checkAll
          ? "border-green-500 bg-green-50 text-green-500"
          : "border-red-500 bg-red-50 text-red-500"
      } ${password.length === 0 ? "" : ""}`}
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
  )
}

export default PasswordChecker

const PasswordMatcher = ({
  matcher,
  label,
}: {
  matcher: boolean
  label: string
}) => {
  return (
    <p className={`flex gap-2 items-center ${matcher ? "text-green-500" : ""}`}>
      <i className={`fa-solid ${matcher ? "fa-check" : "fa-xmark"}`} />
      {label}
    </p>
  )
}
