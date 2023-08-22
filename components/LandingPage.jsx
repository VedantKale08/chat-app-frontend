import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import Image from "next/image";
import Logo from "../lotties/chat-logo.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserStore } from "@/store/userStore";
import { setCookie } from "cookies-next";
import {
  defaultOptions1,
  femaleOptions,
  maleOptions,
  otherOptions,
} from "@/lottieOptions/Options";
import { registerUser } from "@/constants/apiEndpoints";
import Loader from "./Loader";

const API_URL = process.env.NEXT_PUBLIC_URL;

function LandingPage() {
  const setUser = useUserStore((state) => state.setUser);
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const [type, setType] = useState(true);
  const [confirmType, setConfirmType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const SetIsProfile = useUserStore((state) => state.setIsProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();

  const router = useRouter();

  const submitData = async (data) => {
    if (!gender) {
      setGenderError("Please select a gender");
    } else {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}${registerUser}`, data);
        if (response?.data?.status) {
          setUser(response?.data);
          setCookie("token", response?.data?.token);
          reset();
          toast.success("Registration Successful!");
          // setTimeout(() => {
          router.push("/chat");
          setLoading(false);

          // }, 1000);
        } else {
          toast.error(response?.data?.error);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setValue("gender", gender);
  }, [gender]);

  const togglePassword = (id) => {
    let input = document.getElementById(id);
    id === "password" ? setType(!type) : setConfirmType(!confirmType);
    if (input.type == "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  const uploadImage = (file) => {
    if (file === undefined) {
      toast.warn("Invalid Image!");
      return;
    }
    if (
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg"
    ) {
      setImage(URL.createObjectURL(file));
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "chat-app-08");
      fetch("https://api.cloudinary.com/v1_1/chat-app-08/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.url);
          setValue("image", res.url.toString());
        });
    } else {
      toast.warn("Invalid Image!");
    }
  };

  useEffect(() => {
    SetIsProfile(false);
  }, []);

  return (
    <div className="flex min-h-screen md:flex-row flex-col">
      <div className="md:w-[60%] bg-[#f9818b] md:flex items-center justify-center hidden">
        <div className="w-[60%] m-auto">
          <Lottie options={defaultOptions1} />
        </div>
      </div>
      <div className="md:w-[40%] md:px-10 md:py-4 px-4 py-8">
        <Image src={Logo} width={150} alt=""></Image>
        <p className="text-base font-extrabold pt-4">Sign Up</p>
        <p className="text-xs text-[#838186]">
          Already a member?{" "}
          <a className="text-[#f9818b]" href="/">
            Log In Now
          </a>
        </p>
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(submitData)}
        >
          <label className="w-1/2 m-auto relative" for="image">
            {!image && (gender === "male" || gender === "") ? (
              <Lottie options={maleOptions} />
            ) : !image && gender === "female" ? (
              <Lottie options={femaleOptions} />
            ) : !image && gender === "other" ? (
              <Lottie options={otherOptions} />
            ) : null}

            {image && (
              <img
                src={image}
                alt=""
                className="rounded-full w-[140px] h-[140px] object-contain m-auto"
              />
            )}

            <input
              id="image"
              type="file"
              accept="image/*"
              required
              className="opacity-0 text-[0.4rem] absolute"
              onChange={(e) => uploadImage(e.target.files[0])}
            />
          </label>
          <div className="flex gap-4 w-full ">
            <div className="input-group w-full">
              <input
                id="first_name"
                type="text"
                required
                className="input"
                {...register("fname", { required: true, maxLength: 30 })}
              />
              <label for="first_name" className="placeholder">
                First Name
              </label>
              {errors.fname && errors.fname.type === "required" && (
                <span className="text-red-600 text-xs">
                  First Name is required
                </span>
              )}
              {errors.fname && errors.fname.type === "maxLength" && (
                <span className="text-red-600 text-xs">
                  Max length exceeded
                </span>
              )}
            </div>
            <div className="input-group w-full">
              <input
                id="last_name"
                type="text"
                required
                className="input"
                {...register("lname", { required: true, maxLength: 30 })}
              />
              <label for="last_name" className="placeholder">
                Last Name
              </label>
              {errors.lname && errors.lname.type === "required" && (
                <span className="text-red-600 text-xs">
                  Last Name is required
                </span>
              )}
              {errors.lname && errors.lname.type === "maxLength" && (
                <span className="text-red-600 text-xs">
                  Max length exceeded
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full">
            <div
              className={`w-full border-[1px] p-3 text-sm  border-[#C0C0C0] rounded-l-md cursor-pointer text-center ${
                gender === "male" ? "bg-[#f9818b] text-white" : "text-[#808080]"
              }`}
              onClick={() => {
                setGender("male");
                setGenderError("");
              }}
            >
              Male
            </div>
            <div
              className={`w-full border-[1px] p-3 text-sm  border-[#C0C0C0] cursor-pointer text-center ${
                gender === "female"
                  ? "bg-[#f9818b] text-white"
                  : "text-[#808080]"
              }`}
              onClick={() => {
                setGender("female");
                setGenderError("");
              }}
            >
              Female
            </div>
            <div
              className={`w-full border-[1px] p-3 text-sm  border-[#C0C0C0] rounded-r-md cursor-pointer text-center ${
                gender === "other"
                  ? "bg-[#f9818b] text-white"
                  : "text-[#808080]"
              }`}
              onClick={() => {
                setGender("other");
                setGenderError("");
              }}
            >
              Other
            </div>
          </div>
          <span className="text-red-600 text-xs">{genderError}</span>
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
            </p>
            {errors.password && errors.password.type === "required" && (
              <span className="text-red-600 text-xs">Password is required</span>
            )}
          </div>
          <div className="input-group w-full">
            <input
              id="confirm_password"
              type="password"
              required
              className="input"
              {...register("confirm_password", {
                required: true,
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || "Passwords should match!";
                },
              })}
            />
            <label for="confirm_password" className="placeholder">
              Confirm Password
            </label>
            <p
              className="absolute right-[10px] top-[11px] cursor-pointer"
              onClick={() => togglePassword("confirm_password")}
            >
              {confirmType ? (
                <AiFillEye className="text-[#808080] text-xl" />
              ) : (
                <AiFillEyeInvisible className="text-[#808080] text-xl" />
              )}
            </p>
            {errors.confirm_password &&
              errors.confirm_password.type === "required" && (
                <span className="text-red-600 text-xs">
                  Password is required
                </span>
              )}
            {errors.confirm_password &&
              errors.confirm_password.type === "validate" && (
                <span className="text-red-600 text-xs">
                  {errors.confirm_password.message}
                </span>
              )}
          </div>
          <button
            className="bg-[#f9818b] text-white p-3 rounded-full hover:opacity-80"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToastContainer />
      {loading && <Loader />}
    </div>
  );
}

export default LandingPage;
