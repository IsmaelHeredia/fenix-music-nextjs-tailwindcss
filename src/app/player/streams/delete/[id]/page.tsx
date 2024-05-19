"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { useRouter, useParams } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const DeleteStream = () => {

  const router = useRouter();

  const params = useParams(); 

  const id = params.id;

  const [streamData, setStreamData] = useState<any>();

  useEffect(() => {

    async function loadStream() {

      const id_toast = toast.loading("Loading data ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/streams/" + id)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {
                
                toast.dismiss(id_toast);

                setStreamData(data.stream);

              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadStream();

  }, []);

  const handleDelete = () => {

    const id_toast = toast.loading("Please wait ...");

    axios
        .delete(process.env.NEXT_PUBLIC_API_URL + "/streams/" + id)
        .then(response => {
            var data = response.data;
            var status = data.status;
            if (status == 1) {
              toast.update(id_toast, {render: "Stream deleted", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

              setTimeout(() => {
                router.replace("/player/streams");
              }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT));  

            }
        })
        .catch(function (error) {
            const message = error.response.data.message ? error.response.data.message : "Something went wrong";
            toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
            console.log(error);
        })
  };

  return (

  <LayoutPlayer>

    <div id="delete-stream" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-stream"
              >

                  <div id="form-delete-stream" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3 ">

                    <h2 className="text-5xl mb-3 text-white text-center">Stream</h2>

                    <p className="text-center text-white text-3xl">Do you want to delete stream { streamData ? streamData.name : "" } ?</p>

                    <div className="flex flex-col items-center py-10 px-10 mx-0 min-w-full">
                      <div className="inline-flex">
                        <button
                          onClick={() =>  handleDelete()}
                          className="btn-form"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>  router.replace("/player/streams")}
                          className="ml-2 btn-form"
                        >
                          Return
                        </button>
                      </div>
                    </div>

                  </div>

              </div>
            </div>
        </div>

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(DeleteStream);