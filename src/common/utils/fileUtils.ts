export const toFixedNoRounding = (n: number) => {
  return Math.floor(n * 100) / 100;
};

export const SizeAndUnitCalc = (size: number) => {
  const marker = 1000;
  const kiloBytes = marker;
  const megaBytes = marker * marker;
  const gigaBytes = marker * marker * marker;

  if (size < kiloBytes) return size + " Bytes";
  else if (size < megaBytes) return toFixedNoRounding(size / kiloBytes) + " KB";
  else if (size < gigaBytes) return toFixedNoRounding(size / megaBytes) + " MB";
  else return toFixedNoRounding(size / gigaBytes) + " GB";
};
