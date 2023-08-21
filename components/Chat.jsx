import { chatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { isEmpty } from "lodash";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import Group from "@/lotties/group.png";
import { isMobile } from "react-device-detect";
import { getCookie } from "cookies-next";
import axios from "axios";
import { fetchChatApi, messageApi } from "@/constants/apiEndpoints";
import ChatSection from "./ChatSection";
import { io } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_URL;
import ScrollToBottom from "react-scroll-to-bottom";
import Lottie from "react-lottie";
import { loaderOptions } from "@/lottieOptions/Options";
import Loader from "./Loader";
import { toast } from "react-toastify";
const ENDPOINT = "https://chat-app-backend-35u9.onrender.com";
var socket, selectedChatCompare;

function Chat({ data }) {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState("");
  const [allAllMessages, setAllAllMessages] = useState([]);
  const user = useUserStore((state) => state.user);
  const SetIsProfile = useUserStore((state) => state.setIsProfile);
  const isProfile = useUserStore((state) => state.isProfile);
  const setSelectedChat = chatStore((state) => state.setSelectedChat);
  const selectedChat = chatStore((state) => state.selectedChat);
  const chatId = chatStore((state) => state.chatId);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const setChats = chatStore((state) => state.setChats);
  const chats = chatStore((state) => state.chats);
  const setNotifications = chatStore((state) => state.setNotifications);
  const notifications = chatStore((state) => state.notifications);

  useEffect(() => {
    if (isMobile) {
      const handlePopstate = function () {
        setSelectedChat(false);
      };
      window.addEventListener("popstate", handlePopstate);
      return () => {
        window.removeEventListener("popstate", handlePopstate);
      };
    }
  }, []);


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", data);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);

  const fetchMessages = async () => {
    setAllMessages([]);
    if (!isEmpty(selectedChat)) {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        };
        const response = await axios.get(
          `${URL}${messageApi}/${chatId}`,
          config
        );

        if (response?.data?.status) {
          setMessage("");
          setAllMessages(response?.data?.data);
          socket.emit("join chat", chatId);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      try {
        setMessage("");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        };
        const response = await axios.post(
          `${URL}${messageApi}`,
          {
            content: message,
            chatId: chatId,
          },
          config
        );

        if (response?.data?.status) {
          socket.emit('new message',response.data.data)
          fetchChat();
          setAllMessages([...allMessages, response?.data?.data]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //listing
  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };
      const response = await axios.get(`${URL}${fetchChatApi}`, config);

      if (response?.data?.status) {
        setChats(response?.data?.data);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on('message received', (newMessage) =>{
        if (isEmpty(selectedChat) || chatId !== newMessage.chat._id) {
          setNotifications([...notifications, newMessage]);
          fetchChat();
        } else {
          fetchChat();
          setAllMessages([...allMessages, newMessage]);
        }
    })
  })

  
  useEffect(() => {
    const lastMessage = allMessages[allMessages.length - 1];
    if (!isEmpty(selectedChat) && lastMessage?.chat?._id === chatId) {
      setAllAllMessages(allMessages);
    }
  }, [allMessages, selectedChat, chatId]);

  return (
    <div
      className={`w-full ${
        isProfile
          ? "md:w-[calc(100vw-312px-312px)] md:flex hidden"
          : "md:w-[calc(100vw-312px)]"
      } bg-[#f9818b] chat-bg   flex-col h-screen ${
        isEmpty(selectedChat) ? "hidden md:flex" : "flex"
      }`}
    >
      {!isEmpty(selectedChat) && selectedChat?._id !== user?._id && (
        <>
          <div
            className="flex items-center capitalize px-3 bg-white z-50 py-4 cursor-pointer box-shadow"
            onClick={() => {
              SetIsProfile(true);
              // isMobile ? window.history.pushState("#", null, null) :void 0
            }}
          >
            <div className="">
              <Image
                src={!selectedChat?.isGroupChat ? selectedChat?.image : Group}
                alt=""
                width={40}
                height={0}
                className="rounded-full h-[40px] object-cover border-[#eee] border-[1px]"
              ></Image>
            </div>
            {!selectedChat?.isGroupChat ? (
              <span className="px-4 text-[#1B2430]">
                {selectedChat?.fname}{" "}{selectedChat?.lname}
              </span>
            ) : (
              <span className="px-4 text-[#1B2430]">
                {selectedChat?.chatName}
              </span>
            )}
            <BsThreeDotsVertical className="ml-auto cursor-pointer" />
          </div>
          {!isLoading && (
            <ScrollToBottom className="flex-1 z-50 overflow-auto p-4">
              <ChatSection allMessages={allAllMessages} />
            </ScrollToBottom>
          )}
          {isLoading && (
            <div className="flex-1">
              <Loader />
            </div>
          )}
          <div className="z-50 bg-white p-2 px-4">
            <form onClick={sendMessage} className=" flex gap-2">
              <div className="w-full bg-[#eee] py-3 px-4 rounded-full flex items-center gap-2">
                <BsEmojiSmile className="text-gray-500 text-lg cursor-pointer" />
                <input
                  type="text"
                  placeholder="Type a message"
                  className="bg-transparent focus:outline-none text-sm w-full"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>
              <button
                className="bg-[#f9818b] text-white rounded-full p-4 hover:opacity-80"
                type="submit"
              >
                <AiOutlineSend />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
