const AlertInput = ({ children }: { children: React.ReactNode }) =>
  Boolean(children) ? (
    <span role="alert" className="mt-1 text-xs italic text-red-500 ">
      {children}
    </span>
  ) : null

export default AlertInput
