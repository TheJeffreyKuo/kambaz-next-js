import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" alt="" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link href="/Courses/2386" className="wd-dashboard-course-link">
            <Image src="/images/game-dev.jpg" alt="" width={200} height={150} />
            <div>
              <h5> CS5678 Game Dev </h5>
              <p className="wd-dashboard-course-title">
                Game Programming
              </p>
              <button> Go </button>
            </div>
            </Link> 
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/2310" className="wd-dashboard-course-link">
            <Image src="/images/computer-arch.jpg" alt="" width={200} height={150} />
            <div>
              <h5> EECE2310 Comp Arch </h5>
              <p className="wd-dashboard-course-title">
                Computer Architecture
              </p>
              <button> Go </button>
            </div>
            </Link> 
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/2311" className="wd-dashboard-course-link">
            <Image src="/images/computer-arch-lab.jpg" alt="" width={200} height={150} />
            <div>
              <h5> EECE2311 Comp Arch Lab </h5>
              <p className="wd-dashboard-course-title">
                Lab for Computer Architecture
              </p>
              <button> Go </button>
            </div>
            </Link> 
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/3200" className="wd-dashboard-course-link">
            <Image src="/images/databases.jpg" alt="" width={200} height={150} />
            <div>
              <h5> CS3200 Databases </h5>
              <p className="wd-dashboard-course-title">
                Introduction to Databases
              </p>
              <button> Go </button>
            </div>
            </Link> 
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1112" className="wd-dashboard-course-link">
            <Image src="/images/public-speaking.jpg" alt="" width={200} height={150} />
            <div>
              <h5> COMM1112 Public Speaking </h5>
              <p className="wd-dashboard-course-title">
                Introduction to Public Speaking
              </p>
              <button> Go </button>
            </div>
            </Link> 
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/6789" className="wd-dashboard-course-link">
            <Image src="/images/qt.jpg" alt="" width={200} height={150} />
            <div>
              <h5> CS6789 QT </h5>
              <p className="wd-dashboard-course-title">
                Advanced Qt Development
              </p>
              <button> Go </button>
            </div>
            </Link> 
        </div>
      </div>
    </div>
);}