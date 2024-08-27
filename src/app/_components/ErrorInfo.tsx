import { FC } from "react";

interface Props {
  error: string;
}

const ErrorInfo: FC<Props> = ({ error }) => {
  return <p className="text-sm font-light text-red-500">{error}</p>;
};

export default ErrorInfo;
