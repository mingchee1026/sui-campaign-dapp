import { jwtDecode } from "jwt-decode";
import { generateRandomness, jwtToAddress } from "@mysten/zklogin";

export const useZkLogin = () => {
  const isAuthenticated = () => {
    const token = encodedJwt();
    return token && token !== "null";
  };

  const userSalt = () => {
    if (typeof window !== "undefined") {
      let salt = sessionStorage.getItem("sui_user_salt");
      return salt;
    }
    return null;
  };

  const address = () => {
    const jwt = encodedJwt();
    const salt = userSalt();

    console.log({ salt });

    if (!jwt || !salt) {
      return null;
    }

    return jwtToAddress(jwt, salt); // BigInt(salt!));
  };

  const encodedJwt = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("sui_jwt_token");
    }
    return null;
  };

  const decodedJwt = () => {
    if (typeof window !== "undefined") {
      const jwt = sessionStorage.getItem("sui_jwt_token");
      if (jwt) {
        return jwtDecode(jwt);
      }
    }
    return null;
  };

  return { userSalt, isAuthenticated, address, encodedJwt, decodedJwt };
};
