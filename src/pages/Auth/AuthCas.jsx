import { useEffect } from "react";
import { useParams } from "react-router-dom";

function AuthCas() {
  const { uuid } = useParams();

  function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
    } else {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
  }
  ;

  const cookie_user = getCookie("session");

  useEffect(() => {
    window.location.href = "http://localhost:5000/CASLogin?uuid=" + uuid;
  }, []);

  return <></>;
}
export default AuthCas;
