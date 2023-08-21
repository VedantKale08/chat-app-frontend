import { chatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import Group from "@/lotties/group.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { forEach, isEmpty } from "lodash";

function ChatCard({ chat }) {
  const setSelectedChat = chatStore((state) => state.setSelectedChat);
  const selectedChat = chatStore((state) => state.selectedChat);
  const [chatUser, setChatUser] = useState(null);
  const user = useUserStore((state) => state.user);
  const SetIsProfile = useUserStore((state) => state.setIsProfile);
  const setChatId = chatStore((state) => state.setChatId);
  const notifications = chatStore((state) => state.notifications);

  useEffect(() => {
    setChatUser(
      chat?.users[0]._id === user?._id ? chat?.users[1] : chat?.users[0]
    );
  }, []);

  return (
    <div
      className={`flex min-h-[60px] items-center p-2 rounded-md cursor-pointer hover:bg-white duration-500 border-b-[1px] ${
        (
          !chat?.isGroupChat
            ? selectedChat._id === chatUser?._id
            : chat._id === selectedChat._id
        )
          ? "bg-white"
          : ""
      }`}
      onClick={() => {
        setChatId(chat?._id);
        setSelectedChat(!chat?.isGroupChat ? chatUser : chat);
        isMobile ? window.history.pushState("#", null, null) : void 0;
      }}
    >
      <div className="w-[35px]">
        <Image
          src={!chat?.isGroupChat ? chatUser?.image : Group}
          alt=""
          width={35}
          height={0}
          className="rounded-full w-[35px] h-[35px] object-cover"
          onClick={() => SetIsProfile(true)}
        ></Image>
      </div>
      <div className="px-4 text-sm flex-1">
        <div className="flex">
          {!chat?.isGroupChat ? (
            <span className="flex-1 capitalize">
              {chatUser?.fname} {chatUser?.lname}
            </span>
          ) : (
            <span className="flex-1">{chat?.chatName}</span>
          )}
          {!isEmpty(chat?.latestMessage) && (
            <span className="text-[8px] text-gray-600">
              {new Date(chat?.latestMessage[0]?.updatedAt).getHours() +
                ":" +
                new Date(chat?.latestMessage[0]?.updatedAt).getMinutes()}
            </span>
          )}
        </div>
        <div className="flex w-full">
          <div className="text-[10px] leading-4 text-gray-600 line-clamp-2 flex-1" style={{wordBreak:"break-word"}}>
            {chat?.latestMessage[0]?.sender?._id === user?._id && "You : "}
            {chat?.latestMessage[0]?.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
