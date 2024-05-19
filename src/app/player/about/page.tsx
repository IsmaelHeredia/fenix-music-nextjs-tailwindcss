"use client";

import LayoutPlayer from '@/components/LayoutPlayer';
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import useAuth from "@/components/useAuth";

const About = () => {

  return (

  <LayoutPlayer>

    <div id="show-about" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-about"
              >

                  <div id="show-about" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">

                    <div className="mt-4 mb-4">
                      <h2 className="text-5xl mb-6 text-white text-center">About</h2>
                      <h2 className="text-2xl mb-3 text-white text-center">Program : Fenix Music</h2>
                      <h2 className="text-2xl mb-3 text-white text-center">Version : 1.0</h2>
                      <h2 className="text-2xl mb-3 text-white text-center">Author : Ismael Heredia</h2>
                    </div>

                  </div>

              </div>
            </div>
        </div>

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(About);