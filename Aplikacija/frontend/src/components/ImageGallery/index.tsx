import { useDeleteUserOglasMutation } from "@/store/api/endpoints/oglas";
import Icon from "../lib/icon";
import style from "./style.module.css";
import { getRawLocation } from "@/utils/handleQueries";
import { DeleteOglasImageDTO } from "@/store/api/endpoints/images/types";
import { useDeleteOglasImageMutation } from "@/store/api/endpoints/images";
import PageSpacer from "../lib/page-spacer";
import { useEffect } from "react";

type Props = {
  images: (string | undefined | null)[];
  imagePaths?: string[];
  idOglasa?: number;
  deletable?: boolean;
  deleteHandler?: (arg0: number) => void;
  onClick?: (arg0: string) => void;
};

const ImageGallery = ({
  idOglasa,
  deleteHandler,
  imagePaths,
  images,
  deletable,
  onClick,
}: Props) => {
  const [deleteImageAction] = useDeleteOglasImageMutation();

  const handleDelete = async (index: number) => {
    if (deletable == false) return;
    if (deleteHandler) deleteHandler(index);

    if (!imagePaths) return;
    if (!idOglasa) return;

    const image = imagePaths[index];

    if (!image) return;
    const actionData: DeleteOglasImageDTO = {
      idOglasa,
      slikaPath: getRawLocation(image)!,
    };
    console.log(actionData);

    const result = await deleteImageAction(actionData);
    if ("error" in result) {
      return;
    }
  };

  const handleClick = (image: string) => {
    if (!onClick) return;
    onClick(image);
  };

  if (images.length < 1) {
    return (
      <div className={style.nemaSlika}>
        <p>Oglas trenutno nema slika.</p>
      </div>
    );
  }

  return (
    <>
      <div className={style.container}>
        {images.map((image, index) => {
          if (!image) return;
          return (
            <div
              key={image}
              style={{ backgroundImage: `url(${image})` }}
              className={`${style.image} ${
                onClick != undefined ? "cursorPointer" : ""
              }`}
              onClick={() => handleClick(image)}
            >
              {deletable ||
                (deletable == undefined && (
                  <div
                    className={style.Delete}
                    onClick={() => handleDelete(index)}
                  >
                    <Icon
                      icon="delete"
                      classes="colorWhite cursorPointer"
                      fontSize="24px"
                      iconMargin="0"
                    />
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ImageGallery;
