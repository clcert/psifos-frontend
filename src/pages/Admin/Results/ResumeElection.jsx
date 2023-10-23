import ResumeTable from "../ElectionResume/components/ResumeTable";
import CardTitle from "./components/CardTitle";

export default function ResumeElection({ grouped = false, group = "" }) {
  return (
    <>
      <CardTitle title="Resumen elección" />
      <ResumeTable grouped={grouped} group={group} className="pt-4" />
    </>
  );
}
