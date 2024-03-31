"use client";

import {
  FolderOpenOutlined,
  FolderZipOutlined,
  ImageOutlined,
  PlayArrowRounded,
} from "@mui/icons-material";

export const IconSelector = (type: string) => {
  if (type.includes("application/zip")) return <FolderZipOutlined />;

  if (type.includes("image")) return <ImageOutlined />;

  if (type.includes("video")) return <PlayArrowRounded />;

  return <FolderOpenOutlined />;
};

export const FileExtensionSelector = (name: string) => {
  const lastIndexOfDot = name.lastIndexOf(".");
  if (lastIndexOfDot !== -1) {
    let fileExtension = name.substring(lastIndexOfDot + 1, name.length);
    return `- ${fileExtension}`;
  }

  return "";
};

export const BytesToGig = 1000000000;

export const prepareSomeFilesForInput = (fileName?: string) => {
  const str = JSON.stringify("someValues");
  const blob = new Blob([str]);
  const file = new File([blob], `${fileName ? fileName : "values.json"}`, {
    type: "application/JSON",
  });
  return file;
};

export const isAnySameFileNamseInFileList = (fileNames: string[]): boolean =>
  fileNames.some(function (item) {
    return fileNames.indexOf(item) !== fileNames.lastIndexOf(item);
  });
