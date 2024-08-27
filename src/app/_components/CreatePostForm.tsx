import { FC, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import ProfileIconOutline from "@/icons/ProfileIconOutline.png";
import Image from "next/image";
import { api } from "@/utils/trpc";
import PostFileInput from "./PostFileInput";
import XIconOutline from "@/icons/XIconOutline.png";
import axios from "axios";

interface Props {
  setShow: (value: boolean) => void;
}

const CreatePostForm: FC<Props> = ({ setShow }) => {
  const [text, setText] = useState<string>("");

  const createPost = api.post.createPost.useMutation({
    onSuccess() {
      setShow(false);
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!selectedFile && !text) {
      return false;
    }

    setIsLoading(true);

    let inputs: any = {};

    if (text !== "") {
      inputs.text = text;
    }

    if (fileType) {
      inputs.fileType = fileType;
    } else {
      inputs.fileType = "text";
    }

    if (selectedFile) {
      const fileFormData = new FormData();

      fileFormData.append("file", selectedFile);
      fileFormData.append("upload_preset", "ahluettu");

      let file = "";

      await axios
        .post(
          `https://api.cloudinary.com/v1_1/ddvaattcn/${fileType}/upload`,
          fileFormData,
        )
        .then((response) => {
          file = response.data["secure_url"];
        });

      inputs.file = file;
    }

    await createPost.mutateAsync(inputs);

    setIsLoading(false);
  };

  return (
    <div className="fixed z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-20">
      <div className="w-[600px] rounded-xl bg-[#EEEEEE]">
        <div className="flex items-center justify-between border-b border-gray-400 px-[20px] py-[10px]">
          <p className="text-lg font-medium">Post</p>
          <div className="flex items-center space-x-2">
            <div className="h-[45px] w-[80px]">
              <PrimaryButton disabled={isLoading} action={submit} text="Save" />
            </div>
            <div className="h-[45px] w-[80px]">
              <SecondaryButton
                disabled={false}
                action={() => setShow(false)}
                text="Cancel"
              />
            </div>
          </div>
        </div>
        <div className="px-[20px] py-[10px]">
          <div className="flex space-x-4">
            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-300">
              <Image src={ProfileIconOutline} alt="" width={20} height={20} />
            </div>
            <input
              className="bg-transparent text-xl font-light focus:outline-none"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder="Hello World!"
              disabled={false}
            />
          </div>
          <PostFileInput
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            fileType={fileType}
            setFileType={setFileType}
          />
          {selectedFile && (
            <div className="relative mt-[15px] w-full overflow-hidden">
              {fileType === "image" && (
                <div className="relative inline-block">
                  <div className="absolute right-0 top-0 z-20 m-2">
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setFileType(null);
                      }}
                      className="rounded-full bg-white p-1 shadow-lg hover:bg-gray-200"
                    >
                      <Image
                        className="cursor-pointer"
                        src={XIconOutline}
                        alt=""
                        width={25}
                        height={25}
                      />
                    </button>
                  </div>
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Uploaded file"
                    layout="intrinsic"
                    width={700}
                    height={500}
                    objectFit="cover"
                    className="h-auto max-h-[300px] w-auto rounded-lg shadow"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
