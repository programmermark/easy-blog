"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import avatar from "@/assets/image/avatar.png";
import classNames from "classnames";

export default function Header() {
  const pathname = usePathname();

  const LOGO_NAME = "爱编程的Mark";
  const [navs, setNavs] = useState([
    { text: "首页", url: "/", active: true },
    { text: "作品集", url: "/production", active: false },
    { text: "关于我", url: "/about", active: false },
    { text: "简历", url: "/resume", active: false },
    { text: "工具", url: "/tools", active: false },
  ]);

  const updateNavs = useCallback(() => {
    setNavs((prevNavs) =>
      prevNavs.map((nav) => ({ ...nav, active: nav.url === pathname }))
    );
  }, [pathname]);

  useEffect(() => {
    updateNavs();
  }, [updateNavs]);

  return (
    <header className="sticky top-0 w-full h-[60px] bg-white shadow z-[2000]">
      <div className="flex items-center h-full max-w-6xl m-auto">
        <Link className="flex items-center mr-5" href="/">
          <Image src={avatar} alt="logo" width={32} height={32} />
          <span className="ml-1 text-2xl text-gray-700">{LOGO_NAME}</span>
        </Link>
        <nav>
          <ul className="flex items-center h-full">
            {navs.map((nav) => (
              <Link
                key={nav.text}
                href={nav.url}
                className={classNames(
                  "px-5 text-base font-medium cursor-pointer hover:text-blue-500",
                  nav.active ? "text-blue-500" : "text-gray-400"
                )}
              >
                {nav.text}
              </Link>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
