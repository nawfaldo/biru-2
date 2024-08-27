"use client";

import SearchIconOutline from "@/icons/SearchIconOutline.png";
import XIconOutline from "@/icons/XIconOutline.png";
import Image from "next/image";
import { useState } from "react";
import SecondaryButton from "../_components/SecondaryButton";
import { api } from "@/utils/trpc";
import { useRouter } from "next/navigation";

const page = () => {
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { data: imagesData } = api.post.getExplorePosts.useQuery();

  const { data: searchData, refetch } = api.user.getUsersByName.useQuery(
    {
      name: search,
    },
    { enabled: false },
  );

  const handleSearch = () => {
    if (isSearching === false) {
      setIsSearching(true);
      refetch();
    }
  };

  const router = useRouter();

  return (
    <div className="flex w-screen justify-center pt-[30px]">
      <div className="">
        <div className="fixed left-1/2 top-[30px] flex w-[600px] -translate-x-1/2 transform space-x-3 rounded-full border border-gray-400 bg-[#EEEEEE] px-5 py-2">
          <div className="flex h-[25px] w-[25px] items-center justify-center">
            <Image
              src={SearchIconOutline}
              alt=""
              width={60}
              height={60}
              className="mt-2"
            />
          </div>
          <input
            className="flex-grow bg-transparent focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search..."
          />
          {isSearching === true && (
            <div className="flex h-[25px] w-[25px] items-center justify-center">
              <Image
                className="mt-3 cursor-pointer"
                src={XIconOutline}
                alt=""
                width={25}
                height={25}
                onClick={() => {
                  setIsSearching(false);
                  setSearch("");
                }}
              />
            </div>
          )}
          <div className="h-[35px] w-[60px]">
            <SecondaryButton
              text="Go!"
              action={handleSearch}
              disabled={false}
            />
          </div>
        </div>

        {isSearching === false ? (
          <div className="mt-[80px] grid w-[900px] grid-cols-3 gap-2">
            {imagesData?.map((d, index) => (
              <div key={index} className="relative h-[300px] w-full">
                {d.file && (
                  <Image
                    alt="file"
                    src={d.file}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-[80px] w-[600px] space-y-3">
            {searchData?.map((d, index) => (
              <p
                key={index}
                className="cursor-pointer"
                onClick={() => router.push(`/profile/${d.name}`)}
              >
                {d.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
