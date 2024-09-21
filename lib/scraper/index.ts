import axios from "axios";
import * as cheerio from "cheerio";

import {
  extractCurrency,
  extractDescription,
  extractPrice,
  extractRatings,
  extractReview,
} from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // extract data
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      // $("a.size.base.a-color-price"),
      // $(".a-button-selected .a-color-base"),
      $("span.a-price.a-text-price.a-size-medium.apexPriceToPay")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const description = extractDescription($);

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailability";

    const images =
      $("#imageBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage ").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-offscreen"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const reviewsCount = extractReview($("span.a-size-base.a-color-secondary"));

    const stars = extractRatings($("span.a-size-medium.a-color-base"));

    const data = {
      url,
      description,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount,
      stars: Number(stars),
      isOutOfStock: outOfStock,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product : ${error.message}`);
  }
}
