"use client";

import LoginLayout from "@/components/LayoutLogin";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { useRouter, redirect } from "next/navigation";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { validateSessionJwt } from "@/libs/jwtSecurity";

const Login = () => {

  const [token, setToken] = useState("");

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

    async function checkSession() {
      const auth = await validateSessionJwt(token);
      if (auth) {
        router.replace("/player");
      }
    }

    if(token) {
      checkSession();
    }
  }, [token]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({
    username: "",
    password: "",
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

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else {
      newErrors.username = "";
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

      var setData = {
        "username" : formData.username,
        "password" : formData.password,
      };

      const id_toast = toast.loading("Please wait...");

      axios
          .post(process.env.NEXT_PUBLIC_API_URL + "/login", setData)
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                var token_string = data.token;

                toast.update(id_toast, {render: "Successful login", type: "success", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });

                sessionStorage.setItem(String(process.env.NEXT_PUBLIC_SESSION_NAME), token_string);

                setTimeout(() => {
                  router.replace("/player");
                }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT));  

              } else {

                toast.update(id_toast, {render: "Bad login", type: "warning", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

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

    <LoginLayout>

      <div id="login" className="flex flex-col flex-1">

          <div className="bg-vc-border-gradient rounded-lg p-px">
              <div className="py-6 rounded-lg">
                <div
                  className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-login"
                >

                    <div id="form-login" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">

                      <h2 className="text-5xl mb-3 text-white text-center">Enter credentials</h2>

                      <div>
                        <div className="mb-4">
                          <label className="block text-white-700 font-medium mb-2" htmlFor="name">
                            Username
                          </label>
                          <input
                            className="input-tail"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            onChange={handleInputChange}
                            value={formData.username}
                          />
                          {errors.username && <p className="text-red-500 italic">{errors.username}</p>}
                        </div>
                        <div className="mb-4">
                          <label className="block text-white-700 font-medium mb-2" htmlFor="link">
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
                              Login
                            </button>
                          </div>
                        </div>
                      </div>


                    </div>

                </div>
              </div>
          </div>

      </div>

    </LoginLayout>
  );

};

export default Login;