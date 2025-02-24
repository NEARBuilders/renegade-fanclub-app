"use client";

import Image from "next/image";

export function BackgroundImageMain() {
  return (
    <div className="relative w-full h-full">
      <Image
        src={"/images/bg-2.png"}
        alt="Stadium at Night Background"
        fill
        priority
        className="object-cover"
        unoptimized
      />

      {/* Overlay Image */}
      {/* <div className="absolute inset-0"> */}
      <Image
        src="/images/GFX-2.png"
        alt="Overlay Graphic"
        fill
        className="object-cover"
        unoptimized
      />
      {/* </div> */}
    </div>
  );
}
