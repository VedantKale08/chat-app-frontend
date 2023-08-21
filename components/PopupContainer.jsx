import React, { useEffect } from "react";
import { motion } from "framer-motion";
import stopOverflow from "./stopOverflow";
import classNames from "classnames";
import { CgClose } from "react-icons/cg";
import { useRouter } from "next/router";

function PopupContainer({
  setPopup = void 0,
  children,
  position = "center",
  closeBtn,
  bgClose = true,
}) {

  const router = useRouter();

  useEffect(() => {
    const handlePopstate = function () {
      setPopup(false);
    };
    window.addEventListener("popstate", handlePopstate);
    stopOverflow.stop();
    return () => {
      stopOverflow.start();
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={() => {
        if (bgClose) {
          setPopup(false);
          window.history.back();
        }
      }}
      className="fixed overflow-scroll scroll scrollbar-none backdrop-blur-[2px] backdrop-brightness-50 top-0 right-0 left-0 bottom-0 z-[90]"
    >
      {closeBtn && (
        <div
          className="absolute right-5 top-5 text-4xl text-white cursor-pointer"
          onClick={(e) => {
            setPopup(false);
            e.stopPropagation();
            window.history.back();
          }}
        >
          <CgClose />
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={classNames(
          "absolute",
          position == "center" &&
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          position == "top" && "left-1/2 top-0 -translate-x-1/2",
          position == "bottomCase" &&
            "left-1/2 md:top-1/2 -translate-x-1/2 bottom-0 md:-translate-y-[70%]"
        )}
      >
        <div className="">{children}</div>
      </div>
    </motion.div>
  );
}

export default PopupContainer;
