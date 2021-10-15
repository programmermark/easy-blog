const serverUrlProd = 'https://immortalboy.cn';
const serverUrl =
  import.meta.env.MODE === "production" ? "https://immortalboy.cn" : "";
const imgServerUrl =
  import.meta.env.MODE === "production" ? "https://immortalboy.cn" : "";
const baseUrl =
  import.meta.env.MODE === "production" ? "https://immortalboy.cn/api" : "/api";

export { serverUrlProd, baseUrl, serverUrl, imgServerUrl };
