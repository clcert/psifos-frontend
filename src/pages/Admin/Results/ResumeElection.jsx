import ResumeTable from "../ElectionResume/components/ResumeTable";
import CardTitle from "./components/CardTitle";

export default function ResumeElection() {
    return (
        <>
            <CardTitle title="Resumen elección" />
            <ResumeTable className="pt-4" />
        </>
    );
}