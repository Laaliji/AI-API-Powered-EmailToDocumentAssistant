import { api_url } from "../constant/global";
interface fetchType {
  url: string;
  method: "GET" | "POST";
  body: any;
  cache: boolean;
}

const useAxios = async ({ url, method, body, cache }: fetchType) => {
  var res = null;
  var error = null;
  try {
    const response = await fetch(`${api_url}${url}`, {
      method: method,
      body: body,
    //   cache: cache ? "force-cache" : "no-cache",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Cache-Control": cache ? "max-age=100, must-revalidate" : "no-cache",
    //   },
    });
    res = await response.json();
  } catch (e) {
    error = e;
  }
  return {
    response: res,
    error: error,
  } as { response: any; error: any };
};

export default useAxios;
