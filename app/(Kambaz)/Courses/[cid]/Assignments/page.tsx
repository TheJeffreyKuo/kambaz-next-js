import Link from "next/link";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { BsGripVertical, BsPlus } from "react-icons/bs";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;

  return (
    <div id="wd-Assignments" className="mb-4">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <div
          className="input-group flex-grow-1 me-2"
          style={{ maxWidth: "300px" }}
        >
          <span className="input-group-text bg-white">
            <IoSearch className="text-secondary" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search..."
            id="wd-search-assignment"
            aria-label="Search..."
          />
        </div>
            <div className="d-flex ms-auto gap-1">
                <Button
                    variant="secondary"
                    size="lg"
                    id="wd-add-assignment-group"
                    className="text-nowrap rounded-1">
                    <FaPlus className="me-2" style={{ verticalAlign: "middle" }} />
                    Group
                </Button>

                <Button
                    variant="danger"
                    size="lg"
                    id="wd-add-assignment"
                    className="text-nowrap rounded-1">
                    <FaPlus className="me-2" style={{ verticalAlign: "middle" }} />
                    Assignment
                </Button>
            </div>
      </div>

      <div className="wd-Assignments-section mb-4">
        <div className="d-flex align-items-center justify-content-between p-3 ps-2 bg-secondary rounded mb-2">
          <h3 className="wd-Assignments-title mb-0 fs-5 fw-bold">
            ASSIGNMENTS 40% of Total
          </h3>
          <Button variant="secondary" size="sm">
            <BsPlus className="fs-4" />
          </Button>
        </div>
        <ListGroup id="wd-assignment-list" className="rounded-0">
            <ListGroupItem className="wd-assignment-item border-gray p-3 ps-3 d-flex justify-content-between align-items-start">
            <div className="me-1 flex-shrink-0 align-self-stretch d-flex align-items-center text-secondary">
                <BsGripVertical className="me-2 fs-3" />
            </div>
            <Link
                href={`/Courses/${cid}/Assignments/123`}
                className="wd-assignment-link text-decoration-none text-dark flex-grow-1"
                style={{ minWidth: 0 }}
            >
                <div className="wd-assignment-title fw-bold">A1 - ENV + HTML</div>
                <div className="wd-assignment-subtext text-secondary small">
                <span className="text-danger">Multiple Modules</span> | <b> Not available until </b> May 6 at 12:00am |
                </div>
                <div className="wd-assignment-subtext text-secondary small">
                <b> Due </b> May 13 at 11:59pm | 100pts
                </div>
            </Link>

            <div className="ms-3 flex-shrink-0 align-self-stretch d-flex align-items-center">
            <button type="button" className="btn p-0 border-0 bg-transparent text-secondary">
                <IoEllipsisVertical className="fs-4" />
            </button>
            </div>
            </ListGroupItem>
        <ListGroupItem className="wd-assignment-item border-gray p-3 ps-3 d-flex justify-content-between align-items-start">
            <div className="me-1 flex-shrink-0 align-self-stretch d-flex align-items-center text-secondary">
                <BsGripVertical className="me-2 fs-3" />
            </div>
            <Link
                href={`/Courses/${cid}/Assignments/123`}
                className="wd-assignment-link text-decoration-none text-dark flex-grow-1"
                style={{ minWidth: 0 }}
            >
                <div className="wd-assignment-title fw-bold">A2 - CSS + BOOTSTRAP</div>
                <div className="wd-assignment-subtext text-secondary small">
                <span className="text-danger">Multiple Modules</span> | <b> Not available until </b> May 13 at 12:00am |
                </div>
                <div className="wd-assignment-subtext text-secondary small">
                <b> Due </b> May 20 at 11:59pm | 100pts
                </div>
            </Link>

            <div className="ms-3 flex-shrink-0 align-self-stretch d-flex align-items-center">
            <button type="button" className="btn p-0 border-0 bg-transparent text-secondary">
                <IoEllipsisVertical className="fs-4" />
            </button>
            </div>
            </ListGroupItem>
            <ListGroupItem className="wd-assignment-item border-gray p-3 ps-3 d-flex justify-content-between align-items-start">
            <div className="me-1 flex-shrink-0 align-self-stretch d-flex align-items-center text-secondary">
                <BsGripVertical className="me-2 fs-3" />
            </div>
            <Link
                href={`/Courses/${cid}/Assignments/123`}
                className="wd-assignment-link text-decoration-none text-dark flex-grow-1"
                style={{ minWidth: 0 }}
            >
                <div className="wd-assignment-title fw-bold">A3 JAVASCRIPT + REACTL</div>
                <div className="wd-assignment-subtext text-secondary small">
                <span className="text-danger">Multiple Modules</span> | <b> Not available until </b> May 20 at 12:00am |
                </div>
                <div className="wd-assignment-subtext text-secondary small">
                <b> Due </b> May 27 at 11:59pm | 100pts
                </div>
            </Link>

            <div className="ms-3 flex-shrink-0 align-self-stretch d-flex align-items-center">
            <button type="button" className="btn p-0 border-0 bg-transparent text-secondary">
                <IoEllipsisVertical className="fs-4" />
            </button>
            </div>
            </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  );
}