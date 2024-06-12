import React from "react";

type Props = {
  variant?: "xs" | "small" | "medium" | "large";
  size?: number;
};

/***
 * @param variant predefinisane variante: 75px | 150px | 250px | 400px
 * @param size custom velicina, broj u pixelima
 */
const PageSpacer = ({ variant, size }: Props) => {
  variant ??= "medium";
  return <div className={!size ? `page-spacer-${variant}` : ""} style={{height: size}}></div>;
};

export default PageSpacer;
