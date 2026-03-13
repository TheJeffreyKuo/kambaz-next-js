"use client";
import { useParams } from "next/navigation";
import ModulesList from "../Modules/ModulesList";
import CourseStatus from "./Status";
export default function Home() {
  const { cid } = useParams();
  return (
    <div id="wd-home">
      <div className="d-flex">
        <div className="flex-fill">
          <ModulesList cid={cid as string} />
        </div>
        <div className="d-none d-md-block">
          <CourseStatus />
        </div>
      </div>
    </div>
  );
}
