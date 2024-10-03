import { FC } from "react";

export interface UserCardProps {
  type: "students" | "parents" | "teachers" | "staffs";
}

const UserCard: FC<UserCardProps> = ({ type }) => {
  return (
    <div className="min-w-[50px]">
      Enter
      <div className=""></div>
    </div>
  );
};

export default UserCard;
