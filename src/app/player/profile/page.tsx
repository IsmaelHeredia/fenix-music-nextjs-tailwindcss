"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { readSessionJwt } from "@/libs/jwtSecurity";

import useAuth from "@/components/useAuth";

const Profile = () => {

  const [token, setToken] = useState("");
  const [userAdmin, setUserAdmin] = useState("");

  useEffect(() => {
    let session_token: any;
    if (typeof window !== 'undefined') {
      session_token = sessionStorage.getItem(String(process.env.NEXT_PUBLIC_SESSION_NAME));
      if(typeof session_token !== "undefined" && session_token !== 'undefined') {
        setToken(session_token);
      }
    }
  }, []);

  useEffect(() => {

    async function loadSession() {
      let auth: any = await readSessionJwt(token);
      if (typeof auth !== 'undefined' && auth != null) {
        setUserAdmin(auth.payload.user);
      }
    }

    if(token) {
      loadSession();
    }
  }, [token]);

  const [formData, setFormData] = useState({
    new_username: "",
    new_password: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({
    new_username: "",
    new_password: "",
    password: ""
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

    if (!formData.new_username) {
      newErrors.new_username = "New username is required";
      isValid = false;
    } else {
      newErrors.new_username = "";
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
      isValid = false;
    } else {
      newErrors.new_password = "";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const router = useRouter();

  const handleSubmit = () => {

    setFirstSubmitted(true);

    if (validateForm()) {

      var newData = {
        "username" : userAdmin,
        "new_username" : formData.new_username,
        "new_password" : formData.new_password,
        "password" : formData.password
      };

      const id_toast = toast.loading("Please wait ...");

      axios
          .post(process.env.NEXT_PUBLIC_API_URL + "/profile", newData)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {
                toast.update(id_toast, {render: "Profile updated", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });

                sessionStorage.setItem(String(process.env.NEXT_PUBLIC_SESSION_NAME), "");
                setTimeout(() => {
                  router.push("/");
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

    <div id="add-station" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-station"
              >

                  <div id="form-add-station" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3 ">

                    <h2 className="text-5xl mb-3 text-white text-center">Profile</h2>

                    <div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="username">
                          Username
                        </label>
                        <input
                          className="input-tail"
                          id="username"
                          type="text"
                          name="username"
                          placeholder="Enter username"
                          value={userAdmin}
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="new_username">
                          New username
                        </label>
                        <input
                          className="input-tail"
                          id="new_username"
                          type="text"
                          name="new_username"
                          placeholder="Enter new username"
                          onChange={handleInputChange}
                          value={formData.new_username}
                        />
                        {errors.new_username && <p className="text-red-500 italic">{errors.new_username}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="new_password">
                          New password
                        </label>
                        <input
                          className="input-tail"
                          id="new_password"
                          type="password"
                          name="new_password"
                          placeholder="Enter new password"
                          onChange={handleInputChange}
                          value={formData.new_password}
                        />
                        {errors.new_password && <p className="text-red-500 italic">{errors.new_password}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-white-700 font-medium mb-2" htmlFor="password">
                          Password
                        </label>
                        <input
                          className="input-tail"
                          id="password"
                          type="password"
                          name="password"
                          placeholder="Enter password"
                          onChange={handleInputChange}
                          value={formData.password}
                        />
                        {errors.password && <p className="text-red-500 italic">{errors.password}</p>}
                      </div>

                      <div className="flex flex-col items-center py-10 px-10 mx-0 min-w-full">
                        <div className="inline-flex">
                          <button
                            onClick={() =>  handleSubmit()}
                            className="btn-form"
                          >
                            Save
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

export default useAuth(Profile);