import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white p-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start "
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">Scooler</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div
        className="
        w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]
        bg-[#F7F8FA] p-4
        overflow-scroll
      "
      >
        <Navbar />
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
