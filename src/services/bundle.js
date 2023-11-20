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
      hiddenElement.download = `bundle-` + shortName + `.json`;
      const blob = new Blob([bundleContent], {
        type: "application/json",
      });
      hiddenElement.href = window.URL.createObjectURL(blob);
      hiddenElement.click();
    }
  };


  function base64Encode(data) {
    let base64String = "";
    for (let i = 0; i < data.length; i += 3) {
      const chunk = data.slice(i, i + 3);
      base64String += btoa(String.fromCharCode.apply(null, chunk));
    }
    return base64String;
  }


export const parseBundleFile = (bundleJson) => {
    /**
     * Parse file to b64 without newlines
     */

    Object.keys(bundleJson).forEach((key) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(bundleJson[key]));
      const base64String = base64Encode(data)

      bundleJson[key] = base64String;
    });
    return bundleJson;
  };