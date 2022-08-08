import Image from "next/image";

const Sticker = () => {
  return (
    <div>
      <ul>
        <li className="absolute -left-12 -top-12 z-30">
          <Image src="/pixel/01.png" width={116} height={114} />
        </li>
        <li className="absolute right-10 bottom-14 z-30">
          <Image src="/pixel/02.png" width={135} height={140} />
        </li>
        <li className="absolute right-24 bottom-52 animate-[wiggle_1s_ease-in-out_infinite] z-30">
          <Image src="/pixel/03.png" width={106} height={101} />
        </li>
        <li className="absolute top-10 -left-32 z-30">
          <Image src="/pixel/04.png" width={43} height={42} />
        </li>
        <li className="absolute top-20 -right-20 z-30">
          <Image src="/pixel/04.png" width={43} height={42} />
        </li>
        <li className="absolute right-1 top-1 z-30">
          <Image src="/pixel/05.png" width={126} height={188} />
        </li>
        <li className="absolute -right-32 top-48 z-30">
          <Image src="/pixel/06.png" width={32} height={33} />
        </li>
        <li className="absolute -left-20 top-32 z-30">
          <Image src="/pixel/07.png" width={32} height={33} />
        </li>
        <li className="absolute -right-20 bottom-10 z-30">
          <Image src="/pixel/08.png" width={32} height={33} />
        </li>
        <li className="absolute bottom-36 -left-48 z-30">
          <Image src="/pixel/09.png" width={137} height={30} />
        </li>
        <li className="absolute top-80 -left-32 z-30">
          <Image src="/pixel/09.png" width={137} height={30} />
        </li>
        <li className="absolute top-96 -right-10 z-30">
          <Image src="/pixel/09.png" width={137} height={30} />
        </li>
        <li className="absolute -bottom-10 -left-20 z-10">
          <Image src="/pixel/13.png" width={200} height={200} />
        </li>
        <li className="absolute top-0 -right-20 z-10">
          <Image src="/pixel/13.png" width={200} height={200} />
        </li>
        <li className="absolute top-52 -left-36 z-30">
          <Image src="/pixel/14.png" width={95} height={74} />
        </li>
        <li className="absolute bottom-52 -left-32 z-30">
          <Image src="/pixel/15.png" width={138} height={131} />
        </li>
      </ul>
    </div>
  );
};

export default Sticker;
