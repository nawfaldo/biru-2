import { FC } from "react";

interface Props {
  text: string;
  disabled: boolean;
  action: () => void;
}

const SecondaryButton: FC<Props> = ({ text, disabled, action }) => {
  return (
    <button
      className="flex h-full w-full cursor-pointer items-center justify-center rounded-md border-b-[4px] border-l border-r border-t border-gray-400 bg-gray-200 font-light hover:border-l-0 hover:border-r-0 hover:border-t-0 hover:border-black hover:bg-gray-600 hover:text-white"
      onClick={action}
      disabled={disabled}
    >
      <p>{text}</p>
    </button>
  );
};

export default SecondaryButton;
