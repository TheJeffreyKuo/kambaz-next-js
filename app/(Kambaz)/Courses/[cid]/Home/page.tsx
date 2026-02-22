import ModulesList from "../Modules/ModulesList";
import CourseStatus from "./Status";
export default async function Home({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-home">
      <div className="d-flex">
        <div className="flex-fill">
          <ModulesList cid={cid} />
        </div>
        <div className="d-none d-md-block">
          <CourseStatus />
        </div>
      </div>
    </div>
  );
}
