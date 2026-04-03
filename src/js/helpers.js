import { TIMEOUT_SEC } from "./config";

/**
 * Rejects after the configured timeout so fetch calls do not hang forever.
 * @param {number} sec
 * @returns {Promise<never>}
 */
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(
          `[408] - TIMEOUT_ERROR: Request took too long! ${sec} seconds`,
        ),
      );
    }, sec * 1000);
  });
};

/**
 * Shared request helper for both reading and uploading recipe data.
 * Sends a GET request by default and a POST request when upload data is given.
 * @param {string} url
 * @param {Object} [uploadData]
 * @returns {Promise<Object>}
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const json = await res.json();
    if (!res.ok) throw new Error(`[${res.status}] Error: ${json.message}`);
    return json;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const json = await res.json();
//     if (!res.ok) throw new Error(`[${res.status}] Error: ${json.message}`);
//     return json;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const json = await res.json();
//     if (!res.ok) throw new Error(`[${res.status}] Error: ${json.message}`);
//     return json;
//   } catch (err) {
//     throw err;
//   }
// };
