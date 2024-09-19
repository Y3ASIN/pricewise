"use client";

import { FormEvent, useState } from "react";
import { scrapeAndStoreProduct } from "@/lib/actions";

const isValidAmazonProductURL = (url: string) => {
  try {
    const parseURL = new URL(url);
    const hostname = parseURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    )
      return true;
  } catch (error) {
    return false;
  }

  return false;
};

const SearchBar = () => {
  const [serachPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(serachPrompt);
    if (!isValidLink)
      return alert("Please provide a valid Amazon product link.");

    try {
      setIsLoading(true);
      // Srcape the product
      const product = await scrapeAndStoreProduct(serachPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"
        value={serachPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        disabled={serachPrompt === ""}
        type="submit"
        className="searchbar-btn"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
