"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const SettingsStations = () => {

  const [json_file, setJsonFile] = useState<File | null>(null);
  
  const [errors, setErrors] = useState({
    json_file: ""
  });

  const [firstSubmitted, setFirstSubmitted] = useState(false);

  const [download_jsonfile, setDownloadJSONFile] = useState("");

  const [showDownload, setShowDownload] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setJsonFile(e.target.files[0]);

      if(firstSubmitted == true) {
        validateForm();
      }

    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!json_file) {
      newErrors.json_file = "JSON File is required";
      isValid = false;
    } else {
      newErrors.json_file = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const router = useRouter();

  const handleImport = () => {

    setFirstSubmitted(true);

    if (validateForm()) {

      const formData = new FormData();
      const js_file: any = json_file;
      formData.append("json_file", js_file);

      const id_toast = toast.loading("Please wait ...");

      axios
          .post(process.env.NEXT_PUBLIC_API_URL + "/stations/import", formData)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {
                var count = data.stations_count;
                toast.update(id_toast, {render: count + " stations were recorded", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});
              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })

    }
  };

  const handleExport = () => {

    const id_toast = toast.loading("Please wait ...");

    axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/stations/export")
        .then(response => {
            var data = response.data;
            var status = data.status;
            if (status == 1) {
              var link = data.filename;
              setDownloadJSONFile(link);
              setShowDownload(true);
              toast.update(id_toast, {render: "The file is ready to download", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});
            }
        })
        .catch(function (error) {
            const message = error.response.data.message ? error.response.data.message : "Something went wrong";
            toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
            console.log(error);
        })

  };

  const handleHideDownload = () => {
    setDownloadJSONFile("");
    setShowDownload(false);
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

                    <h2 className="text-5xl mb-3 text-white text-center">Stations</h2>

                    <div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="name">
                          Import JSON File
                        </label>
                        <input
                          className="input-tail"
                          id="name"
                          type="file"
                          name="name"
                          placeholder="Enter song directory"
                          onChange={handleFileChange}
                        />
                        {errors.json_file && <p className="text-red-500 italic">{errors.json_file}</p>}
                      </div>

                      <div className="flex flex-col items-center py-10 px-10 mx-0 min-w-full">
                        <div className="inline-flex">
                          <button
                            onClick={() =>  handleImport()}
                            className="btn-lg-form"
                          >
                            Import
                          </button>
                          <button
                            onClick={() =>  handleExport()}
                            className="ml-2 btn-lg-form"
                          >
                            Export
                          </button>
                          <button
                            onClick={() =>  router.push("/player/stations")}
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

        {
          showDownload == true &&

            <div className="flex flex-col items-center py-10 px-10 mx-0 min-w-full">
              <a onClick={() => handleHideDownload() } className="btn-lg-form text-center" href={download_jsonfile} download>Download JSON File</a>
            </div>
        }

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(SettingsStations);