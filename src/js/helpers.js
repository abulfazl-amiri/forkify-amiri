import { TIMEOUT_SEC } from "./config";


const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`[408] - TIMEOUT_ERROR: Request took too long! ${sec} seconds`));
    }, sec * 1000);
  });
};


export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const json = await res.json();
    if (!res.ok) throw new Error(`[${res.status}] Error: ${data.message}`);
    return json;
  } catch (err) {
    throw err;
  }
}