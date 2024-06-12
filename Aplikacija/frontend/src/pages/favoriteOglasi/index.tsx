import MojButton from "@/components/lib/button";
import style from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { useGetFavouritesQuery } from "@/store/api/endpoints/korisnik";
import OglasKartica from "@/components/OglasKartica";
const FavoriteOglasi=()=>{

    const {data: omiljeniOglasi}=useGetFavouritesQuery();
    const navigate = useNavigate();
    return(
        <div className={`containerWrapper ${style.Glavni}`}>
            <div className={style.Div222}>
           <div className={style.TxtDiv}>
                <h2>Vasi omiljeni oglasi</h2>
           </div>
           </div>
           {/* odje idu kartice sa omiljenim oglasima */}
           <div className={style.OmiljeniOglasi}>
           {omiljeniOglasi && 
             omiljeniOglasi.map((oglas) => (
                <div key={oglas.id}>
                  <OglasKartica oglas={oglas} onClick={() => {}} />
                </div>
              ))
           }
           </div>
           <div  className={style.Div222}>
            <div className={style.TxtDiv}>
                <MojButton text="Pretrazite jos oglasa" onClick={() => {
                navigate('/home');
              }} wide={true} center={true}/>
            </div>
           </div>

        </div>
    )
}
export default FavoriteOglasi;