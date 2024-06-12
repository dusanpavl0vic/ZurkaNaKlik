import MenyCardView from "@/components/MenyCardView";
import style from "./style.module.css";
import { useGetImageQuery } from "@/store/api/endpoints/images";
import { PorucenMeni } from "@/store/api/endpoints/korisnik/types";

type Props = {
  category: GetMenuDTO;
  addMenu: (menu: PorucenMeni) => void;
};

const CategoryMenuCard = ({ category, addMenu }: Props) => {
  return (
    <div>
      <h4 className={style.heading}>{category.naziv}</h4>
      {category.meniKeteringa.length < 1 && (
        <p>Nema nijednog menija u ovoj kategroiji.</p>
      )}
      {category.meniKeteringa.map((menu) => {
        return <MenyCardView meni={menu} addMenu={addMenu} />;
      })}
    </div>
  );
};

export default CategoryMenuCard;
