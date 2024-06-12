export type UploadOglasDTO = {
  id: number;
  formData: FormData;
};

export type UploadMultipleOglasDTO = {
  id: number;
  files: FormData[];
};

export type DeleteOglasImageDTO = {
    idOglasa: number;
    slikaPath: string;
}


export type UploadMenuDTO = {
  idMenija: number;
  formData: FormData;
};