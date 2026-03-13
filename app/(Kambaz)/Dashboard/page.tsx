"use client";
import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { RootState } from "../store";
import { enroll, unenroll } from "../Enrollments/reducer";
export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const [showAllCourses, setShowAllCourses] = useState(false);
  const filteredCourses = showAllCourses
    ? courses
    : courses.filter((c: any) =>
        enrollments.some(
          (e: any) => e.user === currentUser?._id && e.course === c._id
        )
      );
  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>New Course
        <button className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={() => dispatch(addNewCourse(course))} > Add </button>
        <button className="btn btn-warning float-end me-2"
          onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
          Update </button>
        <button className="btn btn-info float-end me-2"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-click">
          Enrollments </button>
      </h5><br />
      <FormControl value={course.name} className="mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
      <FormControl as="textarea" value={course.description} rows={3} className="mb-2"
        onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({filteredCourses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((c: any) => {
            const isEnrolled = enrollments.some(
              (e: any) => e.user === currentUser?._id && e.course === c._id
            );
            return (
              <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link href={`/Courses/${c._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                    <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {c.name} </CardTitle>
                      <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                        {c.description} </CardText>
                      <Button variant="primary"> Go </Button>
                      {showAllCourses && (
                        isEnrolled ? (
                          <button onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            dispatch(unenroll({ userId: currentUser?._id, courseId: c._id }));
                          }} className="btn btn-danger float-end">
                            Unenroll
                          </button>
                        ) : (
                          <button onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            dispatch(enroll({ userId: currentUser?._id, courseId: c._id }));
                          }} className="btn btn-success float-end">
                            Enroll
                          </button>
                        )
                      )}
                      {!showAllCourses && (
                        <>
                          <button onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            dispatch(deleteCourse(c._id));
                          }} className="btn btn-danger float-end"
                            id="wd-delete-course-click">
                            Delete
                          </button>
                          <button id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setCourse(c);
                            }}
                            className="btn btn-warning me-2 float-end" >
                            Edit
                          </button>
                        </>
                      )}
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );}
