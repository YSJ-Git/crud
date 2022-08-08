import Image from "next/image";

const TopBar = () => {
  return (
    <div className="top-bar bg-stone-100 max-w-3xl mx-auto my-0 flex justify-end p-1 mt-10">
      <Image src="/pixel/10.png" width={30} height={30} />
      <Image src="/pixel/11.png" width={30} height={30} />
      <Image src="/pixel/12.png" width={30} height={30} />
    </div>
  );
};

export default TopBar;
