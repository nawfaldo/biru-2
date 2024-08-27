"use client";

import { api } from "@/utils/trpc";
import Image from "next/image";
import ProfileIconOutline from "@/icons/ProfileIconOutline.png";

const page = () => {
  const { data } = api.post.getHomePosts.useQuery();

  return (
    <div className="flex w-screen justify-center pt-[30px]">
      <div className="space-y-8">
        {data?.map((d) => (
          <div className="flex w-[600px] space-x-3">
            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-300">
              <Image src={ProfileIconOutline} alt="" width={20} height={20} />
            </div>
            <div className="flex-grow space-y-1">
              <p className="font-medium">@{d.user.name}</p>
              <p className="font-light">{d.text}</p>
              {d.file && (
                <div className="relative h-[500px]">
                  <Image
                    alt="file"
                    src={d.file}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl border border-gray-400"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
