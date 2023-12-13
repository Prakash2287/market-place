import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import perks from "@/staticFIles/perks";
import ProductsReal from "@/components/ProductsReal";
export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-light">
            Your marketplace for high quality<br></br>
            <span className="text-blue-600">digital assets</span>
          </h1>
          <p>
            Welcome to the DigitalMarketPlus.Every asset in the platform is
            assured to be of the highest quality and promised returns of value
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link className={buttonVariants()} href="/products">
              Browse Trending
            </Link>
            <Button variant="ghost">Our Quality Promise &rarr;</Button>
          </div>
        </div>
        {/*TODO: Include the products page here*/}
        <ProductsReal
          title="Brand New"
          subtitle="Not so new"
          href="www.google.com"
          query={{
            sort: "desc",
            limit: 4,
          }}
        />
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
