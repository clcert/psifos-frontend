import { backendInfoIp } from "../server";

export const bundleDownload = async (shortName) => {
    /**
     * Get bundle file a generate download file
     */

    const url = backendInfoIp + "/election/" + shortName + "/bundle-file";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const jsonResponse = await response.json();
      const bundleContent = JSON.stringify(parseBundleFile(jsonResponse));
      let hiddenElement = document.createElement("a");
      hiddenElement.download = `bundle-file.json`;
      const blob = new Blob([bundleContent], {
        type: "application/json",
      });
      hiddenElement.href = window.URL.createObjectURL(blob);
      hiddenElement.click();
    }
  };


export const parseBundleFile = (bundleJson) => {
    /**
     * Parse file to b64 without newlines
     */

    Object.keys(bundleJson).forEach((key) => {
      bundleJson[key] = btoa(
        JSON.stringify(bundleJson[key]).replace(/[\n\r]+/g, "")
      );
    });
    return bundleJson;
  };