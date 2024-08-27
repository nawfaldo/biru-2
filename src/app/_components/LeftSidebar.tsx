"use client";

import { usePathname, useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { useContext, useEffect, useState } from "react";

import HomeIconOutline from "@/icons/HomeIconOutline.png";
import HomeIconSolid from "@/icons/HomeIconSolid.png";
import ExploreIconOutline from "@/icons/ExploreIconOutline.png";
import ExploreIconSolid from "@/icons/ExploreIconSolid.png";
import PlusIconOutline from "@/icons/PlusIconOutline.png";
import ProfileIconOutline from "@/icons/ProfileIconOutline.png";
import ProfileIconSolid from "@/icons/ProfileIconSolid.png";

import CreatePostForm from "./CreatePostForm";
import { AuthContext } from "@/utils/AuthContext";

const LeftSidebar = () => {
  const { user } = useContext(AuthContext);

  const list: {
    name: string;
    url: string;
    iconOutline: StaticImageData;
    iconSolid: StaticImageData;
  }[] = [
    {
      name: "Home",
      url: "/",
      iconOutline: HomeIconOutline,
      iconSolid: HomeIconSolid,
    },
    {
      name: "Explore",
      url: "/explore",
      iconOutline: ExploreIconOutline,
      iconSolid: ExploreIconSolid,
    },
    {
      name: "Profile",
      url: `/profile/${user?.name}`,
      iconOutline: ProfileIconOutline,
      iconSolid: ProfileIconSolid,
    },
  ];

  const router = useRouter();
  const pathname = usePathname();

  const [show, setShow] = useState<boolean>(false);
  const [ok, setOk] = useState<boolean>(true);

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") {
      setOk(false);
    } else {
      setOk(true);
    }
  }, [pathname]);

  if (!ok) return null;

  return (
    <>
      <div className="fixed z-50 h-screen space-y-2 border-r border-gray-400 px-[20px] pt-[30px]">
        {list
          .filter((l) => l.name === "Home")
          .map((l, index) => (
            <div
              className={`flex h-[55px] w-[250px] items-center space-x-3 rounded-xl pl-[15px] ${
                pathname !== l.url && "cursor-pointer hover:bg-gray-200"
              }`}
              key={index}
              onClick={() => router.push(l.url)}
            >
              <Image
                src={pathname === l.url ? l.iconSolid : l.iconOutline}
                alt=""
                width={30}
                height={30}
              />
              <p
                className={`text-lg ${
                  pathname === l.url ? "font-medium" : "font-light"
                }`}
              >
                {l.name}
              </p>
            </div>
          ))}
        <div
          className={`flex h-[55px] w-[250px] cursor-pointer items-center space-x-3 rounded-xl pl-[15px] hover:bg-gray-200`}
          onClick={() => setShow(true)}
        >
          <Image src={PlusIconOutline} alt="" width={30} height={30} />
          <p className={`text-lg font-light`}>Create</p>
        </div>
        {list
          .filter((l) => l.name !== "Home")
          .map((l, index) => (
            <div
              className={`flex h-[55px] w-[250px] items-center space-x-3 rounded-xl pl-[15px] ${
                !pathname.startsWith(l.url) &&
                "cursor-pointer hover:bg-gray-200"
              }`}
              key={index}
              onClick={() => router.push(l.url)}
            >
              <Image
                src={pathname.startsWith(l.url) ? l.iconSolid : l.iconOutline}
                alt=""
                width={30}
                height={30}
              />
              <p
                className={`text-lg ${
                  pathname.startsWith(l.url) ? "font-medium" : "font-light"
                }`}
              >
                {l.name}
              </p>
            </div>
          ))}
      </div>
      {show && <CreatePostForm setShow={setShow} />}
    </>
  );
};

export default LeftSidebar;
