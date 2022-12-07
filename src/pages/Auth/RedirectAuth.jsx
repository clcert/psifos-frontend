const { useEffect } = require("react");
const { useParams } = require("react-router-dom");
const { backendOpIP } = require("../../server");

function RedirectAuthVote() {
  const { nameElection } = useParams();

  useEffect(() => {
    window.location.replace(backendOpIP + "/vote/" + nameElection);
  }, []);

  return <></>;
}

export default RedirectAuthVote;
