import { chatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { RxCross2 } from "react-icons/rx";
import Group from "@/lotties/group.png";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddGroupPopup from "./AddGroupPopup";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";
import { updateChat } from "@/constants/apiEndpoints";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
const URL = process.env.NEXT_PUBLIC_URL;

function Profile() {
  const SetIsProfile = useUserStore((state) => state.setIsProfile);
  const setSelectedChat = chatStore((state) => state.setSelectedChat);
  const selectedChat = chatStore((state) => state.selectedChat);
  const user = useUserStore((state) => state.user);
  const [popup, setPopup] = useState(false);
  const [members, setMembers] = useState([]);
  const setChatId = chatStore((state) => state.setChatId);
  const router = useRouter();
  
  useEffect(() => {
    if (isMobile) {
      const handlePopstate = function () {
        SetIsProfile(false);
      };
      window.addEventListener("popstate", handlePopstate);
      return () => {
        window.removeEventListener("popstate", handlePopstate);
      };
    }
  }, []);

  useEffect(() => {
    if (selectedChat?.isGroupChat) {
      const updatedUsers = selectedChat?.users.map((u) => {
        if (u._id === selectedChat?.groupAdmin?._id) {
          return {
            ...u,
            isAdmin: "Admin",
          };
        }
        return u;
      });
      const adminUser = updatedUsers.find(
        (user) => user._id === selectedChat?.groupAdmin?._id
      );

      const filteredUsers = updatedUsers.filter(
        (user) => user._id !== selectedChat?.groupAdmin?._id
      );

      const finalUsersArray = [adminUser, ...filteredUsers];

      setMembers(finalUsersArray);
    } else {
      setMembers([]);
    }
  }, [selectedChat]);

  const leaveGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };
      const response = await axios.put(
        `${URL}${updateChat}`,
        {
          chatId: selectedChat?._id,
          chatName: selectedChat?.chatName,
          users: JSON.stringify(
            members.filter((u) => u._id !== user?._id).map((u) => u._id)
          ),
        },
        config
      );

      if (response?.data?.status) {
        setSelectedChat(response?.data?.data);
        window.location.reload();
      }
    } catch (error) {}
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`md:w-[312px] w-screen overflow-auto duration-150`}
    >
      <div className="flex py-6 px-3 items-center gap-4 box-shadow sticky top-0 bg-white">
        <RxCross2
          onClick={() => SetIsProfile(false)}
          className="cursor-pointer md:block hidden"
        />
        <span>
          {!selectedChat?.isGroupChat
            ? selectedChat?._id === user?._id
              ? "Your"
              : "Friend"
            : "Group"}{" "}
          Info
        </span>
      </div>
      <div>
        <Image
          src={!selectedChat?.isGroupChat ? selectedChat?.image : Group}
          alt=""
          width={312}
          height={0}
          className="md:m-0 m-auto"
        ></Image>
      </div>
      <div className="capitalize p-2 flex flex-col items-center gap-1 shadow-md py-8">
        <span className="text-xl flex items-center gap-2">
          {!selectedChat?.isGroupChat
            ? selectedChat?.fname + " " + selectedChat?.lname
            : selectedChat?.chatName}
          {selectedChat?.isGroupChat && (
            <MdOutlineModeEditOutline
              className="cursor-pointer text-sm"
              onClick={() => {
                setPopup(true);
                window.history.pushState("#", null, null);
              }}
            />
          )}
        </span>
        <span className="text-xs text-gray-500">
          {!selectedChat?.isGroupChat
            ? selectedChat?.email
            : "Group " + selectedChat?.users?.length + " participants"}
        </span>
        <span className="mt-10">
          {selectedChat?._id === user?._id && (
            <button
              className="bg-red-500 text-white text-[14px] rounded-md px-2 py-1 hover:opacity-75"
              onClick={() => {
                deleteCookie("token");
                router.push("/");
              }}
            >
              Logout
            </button>
          )}
        </span>
      </div>
      {selectedChat?.isGroupChat && (
        <div className="p-2 shadow-md text-sm mt-4 flex items-center">
          <span className="flex-1">Participants</span>
          <button
            className="bg-red-500 text-white text-[10px] rounded-md px-2 py-1 hover:opacity-75"
            onClick={leaveGroup}
          >
            Leave group
          </button>
        </div>
      )}
      <div className="p-2 my-4 mb-10">
        {members?.map((item, index) => (
          <div
            className={`flex capitalize items-center p-2 rounded-md cursor-pointer hover:bg-gray-300 duration-500`}
            key={index}
            onClick={() => {
              setSelectedChat(item);
              setChatId(selectedChat?._id);
            }}
          >
            <div className="w-[35px]">
              <Image
                src={item?.image}
                alt=""
                width={35}
                height={0}
                className="rounded-full w-[35px] h-[35px] object-cover"
              ></Image>
            </div>
            <div className="px-4 text-sm flex-1">
              <div className="flex">
                <span className="flex-1">
                  {item?.fname} {item?.lname}
                </span>
                {item?.isAdmin && (
                  <span className="text-[10px] bg-[#f9818b] px-1 text-white rounded-md">
                    {item?.isAdmin}
                  </span>
                )}
              </div>
              <div className="text-[10px] leading-4 text-gray-600 line-clamp-2">
                Email : {item?.email}
              </div>
            </div>
          </div>
        ))}
      </div>
      {popup && (
        <AddGroupPopup
          name={selectedChat?.chatName}
          members={selectedChat?.users?.filter((i) => i?._id !== user?._id)}
          setAddGroupPopup={setPopup}
          chatId={selectedChat?._id}
        />
      )}
    </motion.div>
  );
}

export default Profile;
