import UserAvatar from "../UserAvatar";
import style from "./styles.module.css";


type Props = {
  text: string;
  avatarSize?: number;
  src?: string;
  fontSize?: number;
  color?: string;
  bgColor?: string;
  heading?: boolean;
  onClick?: () => void;
  classes?: string;
};

const LabeledAvatar = ({
  text,
  src,
  avatarSize,
  fontSize,
  color,
  bgColor,
  heading,
  onClick,
  classes,
}: Props) => {
  const avatarStyle = {
    fontFamily: heading ? "Poppins" : undefined,
    fontSize: fontSize ? `${fontSize}px` : undefined,
    fontWeight: heading ? 500 : undefined,
  };

  return (
    <div
      onClick={onClick}
      className={`${style.container} ${onClick ? "cursorPointer" : ""} ${
        classes ?? ""
      }`}
    >
      <p style={avatarStyle}>{text}</p>
      <UserAvatar
        src={src}
        size={avatarSize}
        letter={text[0]}
        color={color}
        bgColor={bgColor}
      />
    </div>
  );
};


export default LabeledAvatar;
