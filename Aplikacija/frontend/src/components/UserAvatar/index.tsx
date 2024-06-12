import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import { CSSProperties } from "react";
import Icon from "../lib/icon";
import style from "./style.module.css";

type Props = {
  src?: string;
  letter?: string;
  size?: number;
  color?: string;
  bgColor?: string;
  uploadable?: boolean;
};

const UserAvatar = ({
  src,
  letter,
  size,
  color,
  bgColor,
  uploadable,
}: Props) => {
  if (!letter) {
    letter = "a";
  }

  bgColor ??= avatarColors[letter.charCodeAt(0) % avatarColors?.length];

  if (!uploadable) {
    return (
      <>
        <div className={style.content}>
          <Avatar
            src={src}
            sx={{
              position: "relative",
              fontSize: size ? size / 2 : undefined,
              width: size,
              height: size,
              color: color,
              backgroundColor: bgColor,
            }}
          ></Avatar>
          <div className={style.dashedBorder}></div>
        </div>
      </>
    );
  }

  return (
    <div
      className={style.wrapper}
      style={{ width: `${size ?? "50"}px`, height: `${size ?? "50"}px` }}
    >
      <Avatar
        src={src}
        sx={{
          position: "relative",
          fontSize: size ? size / 2 : undefined,
          width: "100%",
          height: "100%",
          color: color,
          backgroundColor: bgColor,
        }}
      >
        {letter}
      </Avatar>
      <div className={style.hoverOverlay}>
        <Icon
          icon="photo_camera"
          classes="cursorPointer"
          fontSize="30px"
          iconMargin="0"
        ></Icon>
      </div>
      <div className={style.dashedBorder}></div>
    </div>
  );
};

const avatarColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FFA500",
  "#800080",
  "#00FF00",
  "#FFC0CB",
  "#008080",
  "#E6E6FA",
  "#A52A2A",
  "#F5F5DC",
  "#800000",
  "#98FF98",
  "#808000",
  "#FF7F50",
  "#000080",
  "#808080",
  "#C0C0C0",
  "#FFD700",
  "#FFFFF0",
  "#40E0D0",
  "#EE82EE",
  "#4B0082",
  "#DC143C",
  "#FA8072",
  "#F0E68C",
  "#DDA0DD",
];

export default UserAvatar;
