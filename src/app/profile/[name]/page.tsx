"use client";

import Image from "next/image";
import ProfileIconOutline from "@/icons/ProfileIconOutline.png";
import { api } from "@/utils/trpc";
import SecondaryButton from "@/app/_components/SecondaryButton";
import { QueryClient } from "@tanstack/react-query";
import SignOutButton from "@/app/_components/SignOutButton";
import { signOut } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/utils/AuthContext";

const Profile = ({ params }: { params: { name: string } }) => {
  const utils = api.useUtils();

  const { user } = useContext(AuthContext);

  const { data: userPostsData } = api.post.getPostsByUserName.useQuery({
    name: params.name,
  });

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const { data: userData } = api.user.getUserProfileByName.useQuery({
    name: params.name,
  });

  useEffect(() => {
    if (userData) {
      setIsFollowing(userData.isFollowing);
    }
  }, [userData]);

  const deletePost = api.post.deletePost.useMutation();

  const handleDeletePost = async (postId: string) => {
    await deletePost.mutateAsync({ postId });
    await utils.post.getPostsByUserName.invalidate({ name: params.name });
  };

  const follow = api.user.follow.useMutation();
  const unfollow = api.user.unfollow.useMutation();

  return (
    <div className="flex w-screen justify-center">
      <div className="mt-[50px] w-[600px] space-y-[80px]">
        <div className="flex space-x-[100px]">
          <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full border border-gray-400 bg-gray-300">
            <Image src={ProfileIconOutline} alt="" width={50} height={50} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-6">
              <p className="text-xl font-medium">{userData?.profile.name}</p>
              {user?.name === params.name ? (
                <div className="flex space-x-2">
                  <div className="h-[45px] w-[100px]">
                    <SecondaryButton
                      disabled={false}
                      text="Edit Profile"
                      action={() => {}}
                    />
                  </div>
                  <div className="h-[45px] w-[90px]">
                    <SecondaryButton
                      text="Signout"
                      disabled={false}
                      action={async () =>
                        await signOut({ callbackUrl: "/login" })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="h-[45px] w-[90px]">
                  <SecondaryButton
                    disabled={
                      isFollowing ? unfollow.isPending : follow.isPending
                    }
                    text={isFollowing ? "Unfollow" : "Follow"}
                    action={() => {
                      if (userData?.profile.id) {
                        if (isFollowing) {
                          unfollow.mutate({ userID: userData?.profile.id });
                          setIsFollowing(false);
                        } else {
                          follow.mutate({ userID: userData?.profile.id });
                          setIsFollowing(true);
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-6">
              <p className="text-lg font-light">{userData?.postCount} Post</p>
              <p className="text-lg font-light">
                {userData?.followerCount} Follower
              </p>
              <p className="text-lg font-light">
                {userData?.followingCount} Following
              </p>
            </div>
          </div>
        </div>
        <div>
          {userPostsData?.map((d) => (
            <div>
              <div className="flex space-x-3">
                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-300">
                  <Image
                    src={ProfileIconOutline}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">@{d.user.name}</p>
                      <p className="font-light">{d.text}</p>
                    </div>
                    {d.user.name === user?.name && (
                      <div className="h-[45px] w-[80px]">
                        <SecondaryButton
                          text="Delete"
                          action={() => handleDeletePost(d.id)}
                          disabled={deletePost.isPending}
                        />
                      </div>
                    )}
                  </div>
                  {d.file && (
                    <div className="relative h-[500px] w-full">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
