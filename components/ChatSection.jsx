import { chatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { isEmpty } from "lodash";
import Image from "next/image";
import React from "react";

function ChatSection({ allMessages = [] }) {
  const user = useUserStore((state) => state.user);
  const setSelectedChat = chatStore((state) => state.setSelectedChat);

  const message = (msg, index) => {
    if (
      !isEmpty(allMessages[index - 1]) &&
      allMessages[index - 1].sender._id === msg.sender._id
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col">
      {!isEmpty(allMessages) &&
        allMessages.map((item, index) => (
          <div
            key={index}
            className={`flex gap-2 ${!message(item, index) ? "mt-4" : 'mt-1'} ${
              item?.sender?._id === user?._id && "self-end"
            }`}
          >
            {item?.sender?._id !== user?._id && (
              <div>
                <Image
                  src={item?.sender?.image}
                  alt=""
                  width={35}
                  height={0}
                  onClick={() => setSelectedChat(item?.sender)}
                  className={`rounded-full w-[35px] h-[35px] object-cover ${
                    message(item, index) && "invisible"
                  }`}
                ></Image>
              </div>
            )}
            <div
              className={`w-fit p-1 px-4 text-base rounded-2xl ${
                item?.sender?._id === user?._id
                  ? ` bg-[#b9f5d0] ${
                      message(item, index) ? "" : "rounded-tr-none"
                    }`
                  : `${message(item, index) ? "" : "rounded-tl-none"} bg-white `
              }`}
            >
              <span className="py-2 px-2">{item.content}</span>
              <span className="text-[8px] text-gray-500">
                {new Date(item?.updatedAt).getHours() +
                  ":" +
                  new Date(item?.updatedAt).getMinutes()}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ChatSection;
