import React from 'react'
import { RxCross2 } from "react-icons/rx";

function SelectedUserCard({ user, deleteUser = () => void 0}) {
  return (
    <div className="bg-[#f9818b] w-fit p-2 rounded-md text-white flex gap-2">
      <span className="text-xs ">
        {user?.fname} {user?.lname}
      </span>
      <span className="cursor-pointer" onClick={() => deleteUser(user)}>
        <RxCross2 />
      </span>
    </div>
  );
}

export default SelectedUserCard