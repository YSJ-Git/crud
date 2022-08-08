import { saveAs } from "file-saver";

const fileDownload = (url, name) => {
  return saveAs(url, name);
};

export default fileDownload;
