import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-between">
      {/* SEARCH BAR*/}
      <div className="group hidden md:flex items-center gap-2 ring-[1.5px] ring-gray-300 bg-white rounded-full py-1 px-2 text-xs focus-within:ring-purple-400 transition-all">
        <Image
          className="bg-transparent"
          src="/search.png"
          alt="search"
          width={14}
          height={14}
        />
        <input
          className="w-[200px] bg-transparent px-2 py-1 outline-none "
          type="text"
          placeholder="Search .."
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex flex-1 items-center gap-x-6 justify-end">
        <div className="bg-white rounded-full size-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="message" width={20} height={20} />
        </div>
        <div className="relative bg-white rounded-full size-7 flex items-center justify-center cursor-pointer">
          <Image
            src="/announcement.png"
            alt="announcement"
            width={20}
            height={20}
          />
          <span className="absolute bg-purple-500 rounded-full size-5 text-xs flex items-center justify-center text-white -top-3 -right-3">
            1
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs leading-3 font-medium">Hello, User</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>

        <Image
          src="/avatar.png"
          alt="avatar"
          className="rounded-full cursor-pointer"
          width={36}
          height={36}
        />
      </div>
    </div>
  );
};

export default Navbar;
