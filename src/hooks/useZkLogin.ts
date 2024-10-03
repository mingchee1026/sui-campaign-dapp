import { JwtPayload, jwtDecode } from "jwt-decode";
import { jwtToAddress } from "@mysten/zklogin";

export const useZkLogin = () => {
  const isAuthenticated = () => {
    const token = jwtData();
    return token && token !== "null";
  };

  const address = () => {
    const jwt = jwtData();
    if (!jwt) {
      return null;
    }

    const email = claims()["email"];
    return jwtToAddress(jwt, hashcode(email));
  };

  const jwtData = () => {
    return sessionStorage.getItem("sui_jwt_token");
  };

  const decodeJwt = () => {
    const jwt = sessionStorage.getItem("sui_jwt_token");
    if (jwt) {
      return jwtDecode(jwt);
    }
    return null;
  };

  const claims = () => {
    const token = jwtData();
    if (token) {
      return JSON.parse(atob(token.split(".")[1]));
    }
    return null;
  };

  const hashcode = (s: string) => {
    if (!s) {
      return "";
    }

    var h = 0,
      l = s.length,
      i = 0;
    if (l > 0) {
      while (i < l) {
        h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
      }
    }
    return h.toString();
  };

  return { isAuthenticated, address, jwtData, decodeJwt };
};
