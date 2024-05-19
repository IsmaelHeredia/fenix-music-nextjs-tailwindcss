"use client";

import { useEffect, useState } from "react";
import { useRouter , redirect} from "next/navigation";
import { validateSessionJwt } from "@/libs/jwtSecurity";

export default function useAuth(Component: any) {
  return function UseAuth(props: any) {

    const [token, setToken] = useState(null);
    const [isValid, setIsValid] = useState(false);
    
    let repeats = 0;

    useEffect(() => {

      let session_token: any;

      if (typeof window !== 'undefined') {
        if(repeats == 0) {
          session_token = sessionStorage.getItem(String(process.env.NEXT_PUBLIC_SESSION_NAME)) ? sessionStorage.getItem(String(process.env.NEXT_PUBLIC_SESSION_NAME)) : undefined;
          if(typeof session_token !== "undefined" && session_token !== 'undefined') {
            setToken(session_token);
            repeats = 1;
          } else {
            return redirect("/");
          }
        }
      }

    }, []);

    useEffect(() => {
      if (token) {
        const auth = validateSessionJwt(token);
        if(!auth) {
          return redirect("/");
        } else {
          setIsValid(true);
        }
      }
    }, [token]);

    if(isValid == true) {
      return <Component {...props} />;
    }

  };
}