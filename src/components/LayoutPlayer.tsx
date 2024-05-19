import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { faHouse, faMusic, faVideo, faHeadset, faRss, faGear, faCircleUser, faCircleInfo, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fenix Music 1.0",
};

export default function LayoutPlayer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const Menu = [
    {
      id:1,
      title:"Home",
      icon:faHouse,
      link:"/player"
    },
    {
      id:2,
      title:"Songs",
      icon:faMusic,
      link:"/player/songs"
    },
    {
      id:3,
      title:"Stations",
      icon:faRss,
      link:"/player/stations"
    },
    {
      id:4,
      title:"Videos",
      icon:faVideo,
      link:"/player/videos"
    },
    {
      id:5,
      title:"Live Streaming",
      icon:faHeadset,
      link:"/player/streams"
    },
    {
      id:6,
      title:"Profile",
      icon:faCircleUser,
      link:"/player/profile"
    },  
    {
      id:7,
      title:"About",
      icon:faCircleInfo,
      link:"/player/about"
    },   
    {
      id:8,
      title:"Logout",
      icon:faRightFromBracket,
      link:"/player/logout"
    },     
  ];

  const router = useRouter();

  const handleClickTab = (tab: any) => {
    if(tab.id == 8) {
      sessionStorage.setItem(String(process.env.NEXT_PUBLIC_SESSION_NAME), "");
      toast.success("Session closed", { autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
      setTimeout(() => {
        router.push("/");
      }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT)); 
    } else {
      router.push(tab.link);
    }
  }

  useEffect(() => {
    let session_token: any;
    if (typeof window !== 'undefined') {
      session_token = sessionStorage.getItem(String(process.env.NEXT_PUBLIC_SESSION_NAME));
      if(typeof session_token !== "undefined" && session_token !== 'undefined') {
        axios.defaults.headers.common['Authorization'] = "Bearer " + session_token;
      }
    }
  }, []);

  return (
    <html lang="en">
      <body className="text-white bg-gray-1100 bg-[url('/grid.svg')]">
        <div id="toast_player">
          <ToastContainer
          position="bottom-center"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
        </div>
        <nav className="h-screen w-64 sidenav">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto h-full bg-black border-b border-gray-800 lg:border-b-0 lg:border-r lg:border-gray-800">
            <div className="flex items-center flex-shrink-0 px-4 text-lg font-medium text-lg">
                Fenix Music 1.0
            </div>

            <div className="px-4 mt-6">
                <hr className="border-gray-200" />
            </div>
            <div className="flex flex-col flex-1 px-3 mt-6">
                <div className="space-y-4">
                    <div className="space-y-6 px-2 pb-24 pt-5">
                        {Menu.map((item) => (
                          <button key={item.id} onClick={() => handleClickTab(item)} className="flex items-center block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300 text-white hover:bg-gray-800">
                            <FontAwesomeIcon icon={item.icon} className="nav-icons" /> <div className="icono">{item.title}</div>
                          </button>                          
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </nav>

        <main className="main">  
          <div className="flex flex-1 h-screen">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}