import { FC } from "react";
import ErrorInfo from "./ErrorInfo";

interface Props {
  value: string;
  setValue: (value: string) => void;
  label: string;
  error?: string | undefined;
  disable: boolean;
}

const TextInput: FC<Props> = ({ value, setValue, label, error, disable }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-light">{label}</label>
      <input
        className={`rounded-lg border-[1.5px] border-gray-400 px-3 py-2 text-xl font-light focus:outline-none ${
          disable ? "bg-gray-200" : "bg-transparent"
        }`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="..."
        disabled={disable}
      />
      {error && <ErrorInfo error={error} />}
    </div>
  );
};

export default TextInput;
