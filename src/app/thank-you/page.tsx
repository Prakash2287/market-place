import PaymentStatus from "@/components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "@/config";
import getPayLoad from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayLoad();

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;
  console.log(order);
  if (!order) return notFound();
  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;
  if (orderUserId !== user.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }
  const products = order.products;
  const orderTotal = products.reduce((total: any, product: any) => {
    return total + product.price;
  }, 0);
  return (
    <main className="relative lg:min-h-full">
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 xl:grid xl:max-w-7xl xl:grid-cols-2 xl:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-1">
            <p className="text-sm font-medium text-blue-500">
              Order Successful
            </p>
            <h1 className="mt-2 text-gray-900 font-bold tracking-tight">
              Thank you for purchasing
            </h1>
            {order._isPaid ? (
              <p className="mt-2 text-muted-foreground text-base">
                Your order was processed and your assets are available for
                download.We have sent your receipt to{" "}
                <span className="text-gray-900 font-medium">
                  {typeof order.user !== "string" ? order.user.email : null}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we are currently processing your
                order.So hang tight and we will send you confirmation very soon
              </p>
            )}
            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {(order.products as any[]).map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === product.category
                )?.label;

                const downloadUrl = (product.product_files as any)
                  .url as string;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24">
                      {typeof image !== "string" && image.url ? (
                        <Image
                          fill
                          src={image.url}
                          alt={`${product.name} image`}
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      ) : null}
                    </div>

                    <div className="flex-auto flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">{product.name}</h3>

                        <p className="my-1">Category: {label}</p>
                      </div>

                      {order._isPaid ? (
                        <a
                          href={downloadUrl}
                          download={product.name}
                          className="text-blue-600 hover:underline underline-offset-2"
                        >
                          Download asset
                        </a>
                      ) : null}
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {product.price}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-gray-900">{orderTotal}</p>
              </div>

              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text-gray-900">{1}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <p className="text-base">Total</p>
                <p className="text-base">{orderTotal + 1}</p>
              </div>
            </div>
            <PaymentStatus
              isPaid={order._isPaid}
              orderEmail={order.user.email}
              orderId={order.id}
            />
            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                href="/products"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Continue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Page;
