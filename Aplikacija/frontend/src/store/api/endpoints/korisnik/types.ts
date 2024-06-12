import { Role } from "@/models/role";

export type AllUserData = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  profilePhoto?: string;
  location: string;
};

export type UpdateUserDTO = Omit<AllUserData, "role" | "profilePhoto">;

export type MakeReservationDTO = {
  idOglasa: number;
  trazeniDatumi: Date[];
};

export type MakeCateringReservationDTO = {
  idZakupljenOglas: number;
  idAgencije: number;
  mogucnostDostave: boolean;
  porucenMeni: PorucenMeni[];
};

export type PorucenMeni = {
  kg: number;
  idMenija: number;
};

export type ReservedOglas = {
  id: number;
  oglasId?: number;
  korisnikId: number;
  datumZakupa: Date;
  zakupljenOd: Date;
  zakupljenDo: Date;
  statusZahtevaZaKetering?: boolean;
  idZakupljeniKetering: number;
  idAgencije: number;
  cenaKeteringa: number;
  cenaOglasa?: number;
};

export type Oceni = {
  id: number;
  ocena: number;
}

export type RemoveCateringReservationDTO = {
  idCatering: number;  
  idReservedOglas: number;  
}