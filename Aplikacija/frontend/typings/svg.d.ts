declare module "*.svg" {
  import { FC } from "react";
  const SVG: FC<React.SVGProps<SVGSVGElement>>;
  export { SVG };
}
