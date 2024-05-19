"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { useRouter, useParams } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const EditStation = () => {

  const router = useRouter();

  const params = useParams(); 

  const id = params.id;

  const [stationData, setStationData] = useState<any>();

  useEffect(() => {

    async function loadStation() {

      const id_toast = toast.loading("Loading data ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/stations/" + id)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.dismiss(id_toast);

                const stationData = data.station;
                setStationData(stationData);

              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadStation();

  }, []);

  useEffect(() => {

    if(stationData) {
      setFormData({
        name: stationData.name,
        link: stationData.link,
        categories: stationData.categories
      })
    }

  }, [stationData]);

  const [formData, setFormData] = useState({
    name: "",
    link: "",
    categories: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    link: "",
    categories: ""
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

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.link) {
      newErrors.link = "Link is required";
      isValid = false;
    } else {
      newErrors.link = "";
    }

    if (!formData.categories) {
      newErrors.categories = "Categories is required";
      isValid = false;
    } else {
      newErrors.categories = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {

    setFirstSubmitted(true);

    if (validateForm()) {

      var newData = {
        "name" : formData.name,
        "link" : formData.link,
        "categories" : formData.categories
      };

      const id_toast = toast.loading("Please wait...");

      axios
          .put(process.env.NEXT_PUBLIC_API_URL + "/stations/" + id, newData)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.update(id_toast, {render: "Station updated", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

                setTimeout(() => {
                  router.replace("/player/stations");
                }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT));  
              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })

    }
  };

  return (

  <LayoutPlayer>

    <div id="edit-station" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-station"
              >

                  <div id="form-edit-station" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3 ">

                    <h2 className="text-5xl mb-3 text-white text-center">Station</h2>

                    <div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="name">
                          Name
                        </label>
                        <input
                          className="input-tail"
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Enter name"
                          onChange={handleInputChange}
                          value={formData.name}
                        />
                        {errors.name && <p className="text-red-500 italic">{errors.name}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="link">
                          Link
                        </label>
                        <input
                          className="input-tail"
                          id="link"
                          type="text"
                          name="link"
                          placeholder="Enter link"
                          onChange={handleInputChange}
                          value={formData.link}
                        />
                        {errors.link && <p className="text-red-500 italic">{errors.link}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="categories">
                          Categories
                        </label>
                        <input
                          className="input-tail"
                          id="categories"
                          type="text"
                          name="categories"
                          placeholder="Enter categories"
                          onChange={handleInputChange}
                          value={formData.categories}
                        />
                        {errors.categories && <p className="text-red-500 italic">{errors.categories}</p>}
                      </div>

                      <div className="flex flex-col items-center py-10 px-10 mx-0 min-w-full">
                        <div className="inline-flex">
                          <button
                            onClick={() =>  handleSubmit()}
                            className="btn-form"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>  router.replace("/player/stations")}
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

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(EditStation);