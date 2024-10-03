import Image from "next/image";
import { FC } from "react";

export interface UserCardProps {
  type: "students" | "parents" | "teachers" | "staffs";
}

const UserCard: FC<UserCardProps> = ({ type }) => {
  return (
    <div className="p-4 flex-1 min-w-[130px] rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow ">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="students" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
