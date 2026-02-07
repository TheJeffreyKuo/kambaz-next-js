import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card>
            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/reactjs.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1234 React JS </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Full Stack software developer
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
            </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card>
              <Link href="/Courses/2386" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/game-dev.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS5678 Game Dev </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Game Programming
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
              </Link> 
              </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}> 
          <Card>
              <Link href="/Courses/2310" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/computer-arch.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> EECE2310 Comp Arch </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Computer Architecture
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
              </Link> 
              </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}> 
          <Card>
              <Link href="/Courses/2311" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/computer-arch-lab.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> EECE2311 Comp Arch Lab </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Lab for Computer Architecture
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
              </Link> 
              </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}> 
          <Card>
              <Link href="/Courses/3200" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/databases.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS3200 Databases </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Introduction to Databases
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
              </Link> 
              </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}> 
          <Card>
              <Link href="/Courses/1112" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/public-speaking.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> COMM1112 Public Speaking </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Introduction to Public Speaking
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
              </Link> 
              </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}> 
          <Card>
              <Link href="/Courses/6789" className="wd-dashboard-course-link text-decoration-none text-dark">
              <CardImg variant="top" src="/images/qt.jpg" alt="" width={200} height={150} />
              <CardBody>
                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS6789 QT </CardTitle>
                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                  Advanced Qt Development
                </CardText>
                <Button variant="primary">Go</Button>
              </CardBody>
              </Link> 
              </Card>
          </Col>
        </Row>
      </div>
    </div>
);}