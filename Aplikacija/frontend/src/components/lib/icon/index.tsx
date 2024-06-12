import zIndex from "@mui/material/styles/zIndex";
import React from "react";

type Props = {
  icon?: string;
  iconMargin?: string;
  fontSize?: string;
  onClick?: () => void;
  enabled?: boolean;
  classes?: string;
};

const Icon = ({
  icon,
  onClick,
  fontSize,
  iconMargin,
  classes = "cursorDefault",
  enabled = true,
}: Props) => {
  const iconStyle = {
    display: "block",
    fontSize: fontSize ?? "28px",
    marginRight: iconMargin ?? "8px",
    

  };

  if (!icon) return <></>;

  return (
    <>
      {enabled && (
        <i
          onClick={onClick}
          style={iconStyle}
          className={`material-icons ${classes ?? ""}`}
        >
          {icon}
        </i>
      )}
    </>
  );
};

export default Icon;
