"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { RootState } from "../store";
import * as client from "../Courses/client";
export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllCourses = async () => {
    try {
      const allCourses = await client.fetchAllCourses();
      dispatch(setCourses(allCourses));
      const myCourses = await client.findMyCourses();
      setEnrolledCourseIds(myCourses.map((c: any) => c._id));
    } catch (error) {
      console.error(error);
    }
  };
  const toggleEnrollments = () => {
    if (!showAllCourses) {
      fetchAllCourses();
    } else {
      fetchCourses();
    }
    setShowAllCourses(!showAllCourses);
  };
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };
  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c: any) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    })));
  };
  const handleEnroll = async (courseId: string) => {
    await client.enrollIntoCourse("current", courseId);
    setEnrolledCourseIds([...enrolledCourseIds, courseId]);
  };
  const handleUnenroll = async (courseId: string) => {
    await client.unenrollFromCourse("current", courseId);
    setEnrolledCourseIds(enrolledCourseIds.filter((id) => id !== courseId));
  };
  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {currentUser?.role === "FACULTY" && (
        <>
          <h5>New Course
            <button className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse} > Add </button>
            <button className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse} id="wd-update-course-click">
              Update </button>
          </h5><br />
          <FormControl value={course.name} className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
          <FormControl as="textarea" value={course.description} rows={3} className="mb-2"
            onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
        </>
      )}
      {currentUser?.role === "STUDENT" && (
        <Button className="float-end mt-4"
          onClick={toggleEnrollments}
          id="wd-enrollments-click">
          Enrollments
        </Button>
      )}
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((c: any) => {
            const isEnrolled = enrolledCourseIds.includes(c._id);
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
                            handleUnenroll(c._id);
                          }} className="btn btn-danger float-end">
                            Unenroll
                          </button>
                        ) : (
                          <button onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleEnroll(c._id);
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
                            onDeleteCourse(c._id);
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
  );
}
