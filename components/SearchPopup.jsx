import React, { useEffect, useState } from "react";
import PopupContainer from "./PopupContainer";
import { AiOutlineSearch } from "react-icons/ai";
import { getCookie } from "cookies-next";
import { accessChatApi, getAllUsers } from "@/constants/apiEndpoints";
import axios from "axios";
import Lottie from "react-lottie";
import { noDataOptions } from "@/lottieOptions/Options";
import { UserSkeleton } from "./Skeleton";
import Image from "next/image";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { chatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
const URL = process.env.NEXT_PUBLIC_URL;

function SearchPopup({ setPopup, fetchChat = () => void 0 }) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isChatLoading, setChatLoading] = useState(false);
  const setChatId = chatStore((state) => state.setChatId);

  const user = useUserStore((state) => state.user);
  const setSelectedChat = chatStore((state) => state.setSelectedChat);
  const chats = chatStore((state) => state.chats);
  const setChats = chatStore((state) => state.setChats);

  const searchUser = async (text) => {
    if (getCookie("token") && text && text.length > 2) {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };
      try {
        const response = await axios.get(
          `${URL}${getAllUsers}?search=${text}`,
          config
        );
        if (response.status) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setData([]);
    }
  };

  const accessChat = async (u) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };

      setChatLoading(true);

      const response = await axios.post(
        `${URL}${accessChatApi}`,
        { userId: u?._id },
        config
      );

      if (response.status) {
        // if (!chats?.filter((c) => c.id === response?.data?._id)) {
        //   setChats([response?.data, ...chats]);
        // }
        fetchChat();
        setSelectedChat(
          response?.data?.chat?.users[0]._id === user?._id
            ? response?.data?.chat?.users[1]
            : response?.data?.chat?.users[0]
        );
        setPopup(false);
        setChatId(response?.data?.chat?._id);
        window.history.back();
        setChatLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setChatLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {isChatLoading && <Loader />}
      <PopupContainer closeBtn={true} setPopup={setPopup}>
        <div className="bg-white rounded-md pr-4 pl-4 pb-4 md:w-[34vw] w-[382px] md:h-[434px] h-[500px] overflow-auto">
          <div className="z-50 sticky top-0 bg-white pt-4 pb-2">
            <div className="w-full bg-white py-3 px-4 rounded-md border-[1px] flex items-center gap-2">
              <AiOutlineSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search By Name or Email..."
                className="bg-transparent focus:outline-none text-sm w-full"
                onChange={(e) => searchUser(e.target.value)}
              />
            </div>
          </div>
          <div className="px- py-3">
            {data &&
              !isLoading &&
              data.map((item, index) => (
                <div
                  className={`flex capitalize items-center p-2 rounded-md cursor-pointer hover:bg-gray-300 duration-500`}
                  key={index}
                  onClick={() => accessChat(item)}
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
                    </div>
                    <div className="text-[10px] leading-4 text-gray-600 line-clamp-2">
                      Email : {item?.email}
                    </div>
                  </div>
                </div>
              ))}
            {!data ||
              (data?.length === 0 && !isLoading && (
                <span>
                  <Lottie options={noDataOptions} />
                </span>
              ))}
            {isLoading && <UserSkeleton />}
          </div>
        </div>
        <ToastContainer/>
      </PopupContainer>
    </>
  );
}

export default SearchPopup;
