import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  text: string;
  linkText: string;
  link: string;
};

const LoginLabel = ({ text, linkText, link }: Props) => {
  return (
    <p className="blackColor">
      {text}{" "}
      <span>
        <NavLink className="textLink" to={link}>
          {linkText}
        </NavLink>
      </span>
    </p>
  );
};

export default LoginLabel;
