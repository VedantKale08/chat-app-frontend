import {
  femaleOptions,
  maleOptions,
  otherOptions,
} from "@/lottieOptions/Options";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import ChatCard from "./ChatCard";
import SearchPopup from "./SearchPopup";
import axios from "axios";
import { fetchChatApi } from "@/constants/apiEndpoints";
import { toast } from "react-toastify";
import { chatStore } from "@/store/chatStore";
import { getCookie } from "cookies-next";
import { UserSkeleton } from "./Skeleton";
import AddGroupPopup from "./AddGroupPopup";
import { isEmpty } from "lodash";
const URL = process.env.NEXT_PUBLIC_URL;

function ChatList() {
  const [popup, setPopup] = useState(false);
  const [addGroupPopup, setAddGroupPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setChats = chatStore((state) => state.setChats);
  const chats = chatStore((state) => state.chats);
  const selectedChat = chatStore((state) => state.selectedChat);
  const SetIsProfile = useUserStore((state) => state.setIsProfile);
  const setSelectedChat = chatStore((state) => state.setSelectedChat);

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };
      setLoading(true);
      const response = await axios.get(`${URL}${fetchChatApi}`, config);

      if (response?.data?.status) {
        setChats(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setLoading;
      false;
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  return (
    <div
      className={`md:w-[312px] px-4 py-4 bg-[#eee]  flex-col gap-6 ${
        isEmpty(selectedChat) ? "flex" : " hidden md:flex"
      }`}
    >
      {/* profile */}
      <div className="flex items-center capitalize px-3">
        <div className="">
          <Image
            src={user?.image}
            alt=""
            width={40}
            height={0}
            className="rounded-full h-[40px] object-cover border-[#eee] border-[1px] cursor-pointer"
            onClick={() => {
              SetIsProfile(true);
              setSelectedChat(user);
            }}
          ></Image>
        </div>
        <span className="px-4 text-[#1B2430]">
          {user?.fname} {user?.lname}
        </span>
        <MdOutlineModeEditOutline className="ml-auto cursor-pointer text-gray-700" />
      </div>
      <div
        className="w-full bg-white py-3 px-4 rounded-full flex items-center gap-2"
        onClick={() => {
          setPopup(true);
          window.history.pushState("#", null, null);
        }}
      >
        <AiOutlineSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search Friends..."
          disabled
          className="bg-transparent focus:outline-none text-sm w-full cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-3 overflow-auto">
        {!loading &&
          chats.map((chat, index) => <ChatCard key={index} chat={chat} />)}
        {loading && <UserSkeleton />}
      </div>
      {popup && <SearchPopup setPopup={setPopup} fetchChat={fetchChat} />}
      <button
        className="bg-[#f9818b] text-white rounded-full p-4 hover:opacity-80 absolute bottom-4"
        onClick={() => {
          setAddGroupPopup(true);
          window.history.pushState("#", null, null);
        }}
      >
        <IoMdAdd className="text-white" />
      </button>
      {addGroupPopup && <AddGroupPopup setAddGroupPopup={setAddGroupPopup} />}
    </div>
  );
}

export default ChatList;
