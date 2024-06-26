import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth:{
    verify:{
      generateEmailHTML:({token})=>{
        return`<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-mail?token=${token}'>Verify your account</a>`
      },  
    },
  },
  access:{
    read:()=>true,
    create:()=>true,
  },
  
  fields: [
    {
      name: "role",
      type: "select",
      required:true,
      defaultValue:"user",
      options: [
        { label: "Admin", value: "admin" },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};
export default Users;
