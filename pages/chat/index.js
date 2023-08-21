import Chat from "@/components/Chat";
import ChatList from "@/components/ChatList";
import Profile from "@/components/Profile";
import { user } from "@/constants/apiEndpoints";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import React, { useEffect } from "react";
const URL = process.env.NEXT_PUBLIC_URL;

function index({ data }) {
  const setUser = useUserStore((state) => state.setUser);
  const isProfile = useUserStore((state) => state.isProfile);
  useEffect(()=>{
    setUser(data);
  },[data])
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatList />
      <Chat data={data}/>
      {isProfile && <Profile />}
    </div>
  );
}

export default index;


export async function getServerSideProps(context) {
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let data = [];

  try {
    const response = await axios.get(`${URL}${user}`, config);
    data = response.data; // Accessing the response data here
  } catch (error) {
    console.log(error);
  }

  return {
    props: { data },
  };
}