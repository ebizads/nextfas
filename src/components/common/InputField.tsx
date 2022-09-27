type InputFieldType = {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
};

export function InputField({
  label,
  name,
  placeholder,
  type,
  required,
}: InputFieldType) {
  return (
    <div className="flex flex-col space-y-2 text-gray-700">
      <label htmlFor={name} className="font-semibold">
        {label}
      </label>
      <input
        type={type ?? "text"}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        className="focus:outline-none focus:ring-2 ring-amber-200/40 px-4 py-2 rounded-md border-2 border-gray-400 focus:border-amber-200 text-gray-600"
      />
    </div>
  );
}
