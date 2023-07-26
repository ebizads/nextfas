import { useMemo } from "react"

const PasswordChecker = ({ password }: { password: string }) => {
  const hasEnoughCharacter = useMemo(() => {
    return password.length >= 12 && password.length < 20 ? true : false
  }, [password])
  const hasNumber = useMemo(() => {
    const checkNumber = /(?=.*\d)/gm
    return password.match(checkNumber) ? true : false
  }, [password])
  const hasSmallLetter = useMemo(() => {
    const checkSmallLetter = /(?=.*[a-z])/gm
    return password.match(checkSmallLetter) ? true : false
  }, [password])
  const hasCapitalLetter = useMemo(() => {
    const checkCapitalLetter = /(?=.*[A-Z])/gm
    return password.match(checkCapitalLetter) ? true : false
  }, [password])
  const hasSpecialCharacter = useMemo(() => {
    const checkSpecialCharacter = /(?=.*[-+!@#$%^&*.,?_])/gm
    return password.match(checkSpecialCharacter) ? true : false
  }, [password])
  const noConsecutiveNumber = useMemo(() => {
    const checkConsecutiveNumber = /\d{2,}/gm
    return password.match(checkConsecutiveNumber) ? false : true
  }, [password])
  // const notComplexEnough = useMemo(() => {
  //   const fComplex = !/[A-Z]/.test(password)
  //   const sComplex =  !/[a-z]/.test(password)
  //   const tComplex = !/\d/.test(password)
  //   const checkComplexity = {
  //     if(fComplex)
  //   }
  //   return password.match(checkComplexity) ? true : false
  // }, [password])

  const checkAll = useMemo(() => {
    return (
      hasEnoughCharacter &&
      hasNumber &&
      hasSmallLetter &&
      hasCapitalLetter &&
      hasSpecialCharacter &&
      noConsecutiveNumber
    )
  }, [
    hasEnoughCharacter,
    hasNumber,
    hasSmallLetter,
    hasCapitalLetter,
    hasSpecialCharacter,
    noConsecutiveNumber,
  ])

  return (
    <div
      className={`space-y-2 overflow-hidden rounded-md text-xs transition-height duration-150 ${password
        ? checkAll
          ? "border-green-500 bg-green-50 text-green-500"
          : "border-red-500 bg-red-50 text-red-500"
        : ""
        } ${password.length === 0 ? "max-h-0" : "max-h-96 border p-4"}`}
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
      <PasswordMatcher
        matcher={noConsecutiveNumber}
        label={"Must not contain consecutive numbers"}
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
    <p className={`flex items-center gap-2 ${matcher ? "text-green-500" : ""}`}>
      <i className={`fa-solid ${matcher ? "fa-check" : "fa-xmark"}`} />
      {label}
    </p>
  )
}
