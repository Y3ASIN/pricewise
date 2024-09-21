import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getProductById, getSimilarProducts } from "@/lib/actions";
import { Product } from "@/Types";
import { formatNumber } from "@/lib/utils";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect("/");

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className="product-container">
      <div className="flex flex-col gap-28 xl:flex-row">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-5 pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-bold text-secondary">
                {product.title}
              </p>

              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-[#d46f77 ] text-base font-semibold">
                  {product.reviewsCount}
                </p>
              </div>
              <div className="rounded-10 bg-white-200 p-2">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="rounded-10 bg-white-200 p-2">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] font-bold text-secondary">
                {" "}
                {product.currency} {formatNumber(product.currentPrice)}{" "}
              </p>
              <p className="text-[21px] text-black line-through opacity-50">
                {" "}
                {product.currency} {formatNumber(product.originalPrice)}{" "}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm font-semibold text-primary-orange">
                    {product.stars || "25"}
                  </p>
                </div>

                <div className="product-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />

                  <p className="text-sm font-semibold text-secondary">
                    {product.reviewsCount}
                  </p>
                </div>
              </div>

              <p className="text-sm text-black opacity-50">
                <span className="font-semibold text-primary-green">93% </span>{" "}
                of buyers have recommended this.
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex flex-wrap gap-5">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
              />
            </div>
          </div>
          Modal
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl font-semibold text-secondary">
            Product Description
          </h3>

          <div className="flex flex-col gap-4">
            {product?.description?.split("\n")}
          </div>
        </div>

        <button className="btn mx-auto flex w-fit min-w-[200px] items-center justify-center gap-3">
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={22}
            height={22}
          />
          <Link href="/" className="text-base text-white">
            {" "}
            Buy Now
          </Link>
        </button>
      </div>

      {similarProducts && similarProducts.length > 0 && (
        <div className="flex w-full flex-col gap-2 py-14">
          <p className="section-text"> Similar Products</p>

          <div className="mt-7 flex w-full flex-wrap gap-10">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
