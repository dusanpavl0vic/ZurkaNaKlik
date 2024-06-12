import LabeledAvatar from "@/components/LabeledAvatar";
import MojButton from "@/components/lib/button";
import Input from "@/components/lib/inputs/text-input";
import PageSpacer from "@/components/lib/page-spacer";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/store/api/endpoints/agencija";
import { useGetUserDataQuery } from "@/store/api/endpoints/korisnik";
import { useLogoutMutation } from "@/store/api/endpoints/auth";
import { selectUser } from "@/store/auth";
import { Avatar } from "@mui/material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import UploadComponent from "@/components/UploadComponent";
import {
  useGetImageQuery,
  useUploadKorisnikMutation,
} from "@/store/api/endpoints/images";
import { getRawLocation } from "@/utils/handleQueries";
import { skipToken } from "@reduxjs/toolkit/query";
import MenyCardPorudzbine from "@/components/MenyCardPorudzbine";

const TestingPage = () => {
  const user = useSelector(selectUser);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addCategory] = useAddCategoryMutation();

  console.log(allCategories);

  // const categories = useMemo(() => {
  //   if(!user) return;
  //   return getAllCategories();
  // }, [])


  const [text, setText] = useState("Email");
  const handleChange = (newText: string) => {
    setText(newText);
  };

  return (
    <>
      <div className="containerWrapper testingPageWrapper">
        {/* <UploadComponent uploadFn={useUploadKorisnikMutation} /> */}
        <MenyCardPorudzbine  />
      </div>
      <PageSpacer />
    </>
  );
};

export default TestingPage;
