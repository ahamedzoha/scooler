import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:h-2/3">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between">
          <UserCard type="students" />
          <UserCard type="teachers" />
          <UserCard type="parents" />
          <UserCard type="staffs" />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:h-1/3">r</div>
    </div>
  );
};

export default AdminPage;
