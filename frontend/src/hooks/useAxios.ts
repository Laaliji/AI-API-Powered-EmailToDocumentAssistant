// src/hooks/useAxios.ts
import { useEffect, useState } from "react";

type fetchType = {
  url: string;
  method: string;
  body?: any;
  cache?: boolean;
};

const useAxios = async ({ url, method, body, cache }: fetchType) => {
  let res = null;
  let error = null;
  console.log(`Calling API: ${url} with method: ${method}`); // Debug log
  try {
    const response = await fetch(`http://127.0.0.1:5001/${url}`, {
      method: method,
      body: body,
      // Uncomment headers if needed
      // headers: {
      //   "Content-Type": "application/json",
      //   "Cache-Control": cache ? "max-age=100, must-revalidate" : "no-cache",
      // },
    });

    console.log("Fetch response status:", response.status); // Debug log
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    res = await response.json();
    console.log("Fetched data:", res); // Debug log
  } catch (e) {
    console.error("Error in useAxios:", e);
    error = e;
  }
  return {
    response: res,
    error: error,
  } as { response: any; error: any };
};

export default useAxios;
