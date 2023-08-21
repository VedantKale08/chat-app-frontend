import LandingPage from "@/components/LandingPage";
import Image from "next/image";
import Lottie from "react-lottie";
import Logo from "../lotties/chat-logo.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import { setCookie } from "cookies-next";
import { defaultOptions1, maleOptions } from "@/lottieOptions/Options";
import { login } from "@/constants/apiEndpoints";

const URL = process.env.NEXT_PUBLIC_URL;

export default function Home() {
  const [type, setType] = useState(true);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  const togglePassword = (id) => {
    let input = document.getElementById(id);
    setType(!type);
    if (input.type == "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  const submitData = async (data) => {
    try {
      const response = await axios.post(`${URL}${login}`, data);
      if (response?.data?.status) {
        setUser(response?.data);
        setCookie("token", response?.data?.token);
        reset();
        toast.success("Login Successful!");
        setTimeout(() => {
          router.push("/chat");
        }, 1000);
      } else {
        toast.error(response?.data?.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* <LandingPage/> */}
      <div className="flex min-h-screen md:flex-row flex-col">
        <div className="md:w-[60%] bg-[#f9818b] flex items-center justify-center">
          <div className="w-[60%] m-auto">
            <Lottie options={defaultOptions1} />
          </div>
        </div>
        <div className="md:w-[40%] md:px-10 md:py-6 flex flex-col justify-center">
          <Image src={Logo} width={150} alt=""></Image>
          <p className="text-base font-extrabold pt-4">Log In</p>
          <p className="text-xs text-[#838186]">
            Not a member?{" "}
            <a className="text-[#f9818b]" href="/register">
              Sign Up Now
            </a>
          </p>
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(submitData)}
          >
            <div className="w-1/2 m-auto">
              <Lottie options={maleOptions} />
            </div>
            <div className="input-group w-full">
              <input
                id="email"
                type="text"
                required
                className="input"
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: "Email is invalid",
                  },
                })}
              />
              <label for="email" className="placeholder">
                Email
              </label>
              {errors.email && errors.email.type === "required" && (
                <span className="text-red-600 text-xs">Email is required</span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span className="text-red-600 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="input-group w-full">
              <input
                id="password"
                type="password"
                required
                className="input"
                {...register("password", { required: true })}
              />
              <label for="password" className="placeholder">
                Password
              </label>
              <p
                className="absolute right-[10px] top-[11px] cursor-pointer"
                onClick={() => togglePassword("password")}
              >
                {type ? (
                  <AiFillEye className="text-[#808080] text-xl" />
                ) : (
                  <AiFillEyeInvisible className="text-[#808080] text-xl" />
                )}
                {errors.password && errors.password.type === "required" && (
                  <span className="text-red-600 text-xs">
                    Password is required
                  </span>
                )}
              </p>
            </div>
            <button
              className="bg-[#f9818b] text-white p-3 rounded-full hover:opacity-80"
              type="submit"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  if(token){
    return {
      redirect: {
        destination: `/chat`,
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
}
