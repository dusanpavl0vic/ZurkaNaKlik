import { useAppDispatch } from "@/store";
import { logOut } from "@/store/auth";
import { useEffect } from "react";

const Logout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logOut());
  }, []);

  return null;
};

export default Logout;
