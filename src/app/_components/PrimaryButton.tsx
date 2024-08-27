import { FC } from "react";

interface Props {
  text: string;
  disabled: boolean;
  action: () => void;
}

const PrimaryButton: FC<Props> = ({ text, disabled, action }) => {
  return (
    <button
      className={`flex h-full items-center font-semibold text-white ${disabled ? "border-blue-700 bg-blue-600" : "border-blue-600 bg-blue-500 hover:border-blue-700 hover:bg-blue-600"} w-full justify-center rounded-lg border-b-[5px]`}
      onClick={action}
      disabled={disabled}
    >
      <p className="text-lg text-white">{text}</p>
    </button>
  );
};

export default PrimaryButton;
