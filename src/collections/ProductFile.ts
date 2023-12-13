import { BeforeChangeHook } from "payload/dist/globals/config/types";
import { Access, CollectionConfig } from "payload/types";
const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user?.id };
};
const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user;

  if (user?.role === "admin") return true;
  if (!user) return false;

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const ownProductFileIds = products
    .map((prod: any) => prod.product_files)
    .flat();

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductFileIds = orders
    .map((order: any) => {
      return order.products.map((product: any) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs"
          );

        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean)
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
};
export const ProductFile: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
    // This ensures that the media is not shown as a seperate type
  },
  hooks: {
    beforeChange: [addUser as any],
  },
  access: {
    read: yourOwnAndPurchased,
    update:({req})=>req.user.role==='admin',
    delete:({req})=>req.user.role==='admin',
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "application/postscript", "font/*"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};