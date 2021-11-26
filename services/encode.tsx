export const sha256 = async (password: string | any) => {
  let encoder = new TextEncoder();
  let data = encoder.encode(password);
  let hash = Array.prototype.map
    .call(new Uint8Array(await crypto.subtle.digest("SHA-256", data)), (x) =>
      ("0" + x.toString(16)).slice(-2)
    )
    .join("");
  return hash;
};
