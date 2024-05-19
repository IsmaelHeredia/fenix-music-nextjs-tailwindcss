"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const SettingsVideos = () => {

  const [configData, setConfigData] = useState<any>();

  async function loadConfig() {

    const id_toast = toast.loading("Loading data ...");

    axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/config")
        .then(response => {
            var data = response.data;
            var status = data.status;
            if (status == 1) {

              toast.dismiss(id_toast);

              const configData = data.config[0];
              setConfigData(configData);
            }
        })
        .catch(function (error) {
            const message = error.response.data.message ? error.response.data.message : "Something went wrong";
            toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
            console.log(error);
        })

  }

  useEffect(() => {

    loadConfig();

  }, []);

  useEffect(() => {

    if(configData) {
      setFormData({
        videoDirectory: configData.video_directory,
      })
    }

  }, [configData]);

  const [formData, setFormData] = useState({
    videoDirectory: ""
  });
  
  const [errors, setErrors] = useState({
    videoDirectory: ""
  });

  const [firstSubmitted, setFirstSubmitted] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if(firstSubmitted == true) {
      validateForm();
    }

  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.videoDirectory) {
      newErrors.videoDirectory = "Video directory is required";
      isValid = false;
    } else {
      newErrors.videoDirectory = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const router = useRouter();

  const handleSubmit = () => {

    setFirstSubmitted(true);

    if (validateForm()) {

      var newData = {
        "videoDirectory" : formData.videoDirectory,
      };

      const id_toast = toast.loading("Please wait ...");

      axios
          .post(process.env.NEXT_PUBLIC_API_URL + "/config", newData)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {
                loadConfig();
                toast.update(id_toast, {render: "Video directory updated", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }
  };

  const handleScan = () => {

    const id_toast = toast.loading("Please wait ...");

    axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/videos/scan")
        .then(response => {
            var data = response.data;
            var status = data.status;
            if (status == 1) {
              var count = data.videos_count;
              toast.update(id_toast, {render: count + " videos were recorded", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
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

    <div id="config-scans" className="flex flex-col flex-1">
        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-scans"
              >
                  <div id="form-scans" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3 ">

                    <h2 className="text-5xl mb-3 text-white text-center">Scans</h2>

                    <div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="videoDirectory">
                          Videos
                        </label>
                        <input
                          className="input-tail"
                          id="videoDirectory"
                          type="text"
                          name="videoDirectory"
                          placeholder="Enter video directory"
                          onChange={handleInputChange}
                          value={formData.videoDirectory}
                        />
                        {errors.videoDirectory && <p className="text-red-500 italic">{errors.videoDirectory}</p>}
                      </div>

                      <div className="flex flex-col items-center py-10 px-10 mx-0 min-w-full">
                        <div className="inline-flex">
                          <button
                            onClick={() =>  handleSubmit()}
                            className="btn-lg-form"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>  handleScan() }
                            className="ml-2 btn-lg-form"
                          >
                            Scan
                          </button>
                          <button
                            onClick={() =>  router.push("/player/videos")}
                            className="ml-2 btn-lg-form"
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
    </div>

  </LayoutPlayer>

  );

};

export default useAuth(SettingsVideos);