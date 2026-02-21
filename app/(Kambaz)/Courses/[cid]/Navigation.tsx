"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function CourseNavigation() {
  const { cid } = useParams();
  const pathname = usePathname();

  const links = [
    { label: "Home",        path: "Home",        id: "wd-course-home-link"        },
    { label: "Modules",     path: "Modules",     id: "wd-course-modules-link"     },
    { label: "Piazza",      path: "Piazza",      id: "wd-course-piazza-link"      },
    { label: "Zoom",        path: "Zoom",        id: "wd-course-zoom-link"        },
    { label: "Assignments", path: "Assignments", id: "wd-course-assignments-link" },
    { label: "Quizzes",     path: "Quizzes",     id: "wd-course-quizzes-link"     },
    { label: "Grades",      path: "Grades",      id: "wd-course-grades-link"      },
    { label: "People",      path: "People",      id: "wd-course-people-link"      },
  ];

  return (
    <div id="wd-courses-navigation">
      {links.map((link) => {
        const href = `/Courses/${cid}/${link.path}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={link.id}
            href={href}
            id={link.id}
            className="list-group-item border-0 text-decoration-none"
            style={active
              ? { borderLeft: "3px solid black", color: "black", fontWeight: 600 }
              : { borderLeft: "3px solid transparent", color: "#dc3545" }
            }
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
