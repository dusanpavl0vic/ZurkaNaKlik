import Icon from "@/components/lib/icon";
import { CSSProperties, useRef, useState } from "react";

type Props = {
  text: string;
  icon?: string;
  suffixIcon?: boolean;
  onChange: (arg0: string) => void;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
};

const Input = ({
  icon,
  text,
  suffixIcon = false,
  onChange,
  error,
  disabled,
  placeholder,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibilityIcon, setVisibilityIcon] = useState("visibility_off");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const changeVisibilityIcon = () => {
    visibilityIcon === "visibility"
      ? setVisibilityIcon("visibility_off")
      : setVisibilityIcon("visibility");
  };

  const handleFocusChange = () => {
    if (!divRef || !divRef.current) return;
    divRef.current.classList.add("inputWrapperFocused");
  };

  const handleBlurChange = () => {
    if (!divRef || !divRef.current) return;
    divRef.current.classList.remove("inputWrapperFocused");
  };

  return (
    <div className="imputErrorWrapper">
      <div ref={divRef} className="inputWrapper">
        <div className="formTextIconContainer">
          <Icon icon={icon} />

          <input
            ref={inputRef}
            type={
              suffixIcon && visibilityIcon === "visibility_off"
                ? "password"
                : "text"
            }
            className="formTextInput"
            value={text}
            placeholder={placeholder}
            onFocus={handleFocusChange}
            onBlur={handleBlurChange}
            onChange={(event) => {
              disabled ? () => {} : handleTextChange(event);
            }}
          />
        </div>

        <Icon
          icon={visibilityIcon}
          onClick={changeVisibilityIcon}
          classes="cursorPointer"
          enabled={suffixIcon}
        />
      </div>

      {error && <p className="inputError">{error}</p>}
    </div>
  );
};

export default Input;
