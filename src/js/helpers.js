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

/**
 * Formats decimal quantities into recipe-friendly mixed fractions.
 * @param {number|null|undefined} value
 * @returns {string}
 */
export const formatQuantity = function (value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  if (!Number.isFinite(value)) return "";
  if (value === 0) return "0";

  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);
  const whole = Math.trunc(absoluteValue);
  const fraction = absoluteValue - whole;

  if (fraction < 1e-6) return `${sign}${whole}`;

  let bestNumerator = 0;
  let bestDenominator = 1;
  let smallestError = Number.POSITIVE_INFINITY;

  for (let denominator = 1; denominator <= 16; denominator++) {
    const numerator = Math.round(fraction * denominator);
    const error = Math.abs(fraction - numerator / denominator);

    if (error < smallestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      smallestError = error;
    }
  }

  if (bestNumerator === 0) return `${sign}${whole}`;

  if (bestNumerator === bestDenominator) return `${sign}${whole + 1}`;

  const divisor = gcd(bestNumerator, bestDenominator);
  const reducedNumerator = bestNumerator / divisor;
  const reducedDenominator = bestDenominator / divisor;

  if (whole === 0) return `${sign}${reducedNumerator}/${reducedDenominator}`;

  return `${sign}${whole} ${reducedNumerator}/${reducedDenominator}`;
};

const gcd = function (a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x || 1;
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
