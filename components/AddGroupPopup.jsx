import React, { useEffect, useState } from "react";
import PopupContainer from "./PopupContainer";
import { AiOutlineSearch } from "react-icons/ai";
import { getCookie } from "cookies-next";
import axios from "axios";
import { getAllUsers, group, updateChat } from "@/constants/apiEndpoints";
import Image from "next/image";
import Lottie from "react-lottie";
import { noDataOptions } from "@/lottieOptions/Options";
import { UserSkeleton } from "./Skeleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isEmpty } from "lodash";
import SelectedUserCard from "./SelectedUserCard";
import { chatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
const URL = process.env.NEXT_PUBLIC_URL;

function AddGroupPopup({ setAddGroupPopup, name, members=[], chatId }) {
  const [groupName, setGroupName] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const setChats = chatStore((state) => state.setChats);
  const chats = chatStore((state) => state.chats);
  const setSelectedChat = chatStore((state) => state.setSelectedChat);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if(!isEmpty(name)){
      setGroupName(name);
      setSelectedUser(members);
    }
  }, [name, members]);

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

  const handleGroup = (item) => {
    console.log(item);
    if (!isEmpty(selectedUser.filter((i) => i._id === item._id))) {
      toast.warn("User already added to group!");
      return;
    }
    setSelectedUser([...selectedUser, item]);
  };

  const deleteUser = (user) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== user._id));
  };

  const handleSubmit = async () => {
    if (!groupName || !selectedUser) {
      toast.warn("Please fill all the fields!");
      return;
    }
    if (selectedUser.length === 1) {
      toast.warn("At least two users must be selected!");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };
      let response = null;
      if (isEmpty(name)) {
        response = await axios.post(
          `${URL}${group}`,
          {
            name: groupName,
            users: JSON.stringify(selectedUser.map((u) => u._id)),
          },
          config
        );
      } else {
        const alldata = selectedUser;
        alldata.push(user);
        response = await axios.put(
          `${URL}${updateChat}`,
          {
            chatId: chatId,
            chatName: groupName,
            users: JSON.stringify(alldata.map((u) => u._id)),
          },
          config
        );
      }

      if (response?.data?.status) {
        isEmpty(name) && setChats([...chats, response?.data?.data]);
        setSelectedChat(response?.data?.data);
        setAddGroupPopup(false);
      }
    } catch (error) {
      toast.warn("Something went wrong!");
    }
  };

  return (
    <PopupContainer setPopup={setAddGroupPopup} closeBtn={true}>
      <div className="bg-white rounded-md p-6 md:w-[34vw] md:h-[534px] w-[382px] h-[600px] overflow-auto flex flex-col gap-2 relative">
        <div className="flex flex-col gap-2 sticky top-0 z-50 bg-white pb-2">
          <span className="text-lg py-2">
            {!isEmpty(name) ? `Edit Group` : `New Group`}
          </span>
          <div className="w-full bg-white py-3 px-4 rounded-md border-[1px] flex items-center gap-2">
            <input
              type="text"
              placeholder="Group Name"
              className="bg-transparent focus:outline-none text-sm w-full"
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
            />
          </div>
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
        <div className="flex gap-2">
          {!isEmpty(selectedUser) &&
            selectedUser?.map((user, i) => (
              <SelectedUserCard user={user} key={i} deleteUser={deleteUser} />
            ))}
        </div>
        {data &&
          !isLoading &&
          data.map((item, index) => (
            <div
              className={`flex capitalize items-center p-2 rounded-md cursor-pointer hover:bg-gray-300 duration-500`}
              key={index}
              onClick={() => handleGroup(item)}
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
        <button
          className="bg-[#f9818b] text-white rounded-full px-4 py-2 hover:opacity-80 fixed bottom-4 right-4"
          onClick={() => handleSubmit()}
        >
          {!isEmpty(name) ? "Update a Group" : "Create a Group"}
        </button>
      </div>
      <ToastContainer />
    </PopupContainer>
  );
}

export default AddGroupPopup;
