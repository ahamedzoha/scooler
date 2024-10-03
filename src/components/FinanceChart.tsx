import Image from "next/image";

const FinanceChart = () => {
  return (
    <div className="w-full h-full p-4 bg-white rounded-xl ">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="students" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className=" relative w-full h-[75%]"></div>

      {/* Bottom */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="size-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-sm text-gray-300">Boys (55%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="size-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-sm text-gray-300">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default FinanceChart;
