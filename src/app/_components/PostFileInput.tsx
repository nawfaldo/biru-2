import Image from "next/image";
import { FC, useEffect, useRef } from "react";

import PhotoPlusIconOutline from "@/icons/PhotoPlusIconOutline.png";
import EmojiPlusIconOutline from "@/icons/EmojiPlusIconOutline.png";

interface Props {
  selectedFile?: File | null;
  setSelectedFile: (value: File | null) => void;
  fileType?: "image" | "video" | null;
  setFileType: (value: "image" | "video" | null) => void;
}

const PostFileInput: FC<Props> = ({
  selectedFile,
  setSelectedFile,
  fileType,
  setFileType,
}) => {
  const videoUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, []);

  const getFileType = (type: string): "image" | "video" | null => {
    if (type.startsWith("image/")) {
      return "image";
    } else if (type.startsWith("video/")) {
      return "video";
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        event.target.value = "";
        setSelectedFile(null);
        setFileType(null);
        return;
      }
      setSelectedFile(file);

      const fileType = getFileType(file.type);
      setFileType(fileType);
    }
  };

  return (
    <div className="mt-[15px] flex items-center space-x-3">
      <label>
        <Image
          className="cursor-pointer"
          src={PhotoPlusIconOutline}
          alt=""
          width={25}
          height={25}
        />
        <input
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/jpg, video/mp4"
          onChange={handleFileChange}
        />
      </label>
      <Image
        className="cursor-pointer"
        src={EmojiPlusIconOutline}
        alt=""
        width={25}
        height={25}
      />
    </div>
  );
};

export default PostFileInput;
