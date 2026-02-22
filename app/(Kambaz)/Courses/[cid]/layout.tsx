import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import CourseBreadcrumb from "./Breadcrumb";
import { FaAlignJustify } from "react-icons/fa6";
import { courses } from "../../../Database";

export default async function CoursesLayout(
  { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) {
 const { cid } = await params;
 const course = courses.find((c) => c._id === cid);
 return (
  <div id="wd-courses">
    <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course?.name} </h2>
    <CourseBreadcrumb course={course} />
    <hr />
    <div className="d-flex">
      <div className="d-none d-md-block">
        <CourseNavigation />
      </div>
      <div className="flex-fill">
        {children}
      </div></div>
  </div>
);}
