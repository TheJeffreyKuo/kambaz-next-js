"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
 const pathname = usePathname();
 const links = [
  {
   label: "Account",
   href: "/Account/Signin",
   id: "wd-account-link",
   Icon: FaRegCircleUser,
   iconClass: "text-white",
  },
  {
   label: "Dashboard",
   href: "/Dashboard",
   id: "wd-dashboard-link",
   Icon: AiOutlineDashboard,
   iconClass: "text-danger",
  },
  {
   label: "Courses",
   href: "/Courses",
   id: "wd-courses-link",
   Icon: LiaBookSolid,
   iconClass: "text-danger",
  },
  {
   label: "Calendar",
   href: "/Calendar",
   id: "wd-calendar-link",
   Icon: IoCalendarOutline,
   iconClass: "text-danger",
  },
  {
   label: "Inbox",
   href: "/Inbox",
   id: "wd-inbox-link",
   Icon: FaInbox,
   iconClass: "text-danger",
  },
  {
   label: "Labs",
   href: "/Labs",
   id: "wd-labs-link",
   Icon: LiaCogSolid,
   iconClass: "text-danger",
  },
 ];

 const isActive = (link: (typeof links)[number]) =>
  pathname === link.href || pathname.startsWith(link.href + "/");
 return (
  <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 110 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
    <ListGroupItem className="bg-black border-0 text-center" as="a"
    target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
    <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
    </ListGroupItem>

   {links.map((link) => {
    const active = isActive(link);

    return (
     <ListGroupItem
      key={link.id}
      className={`border-0 bg-black text-center ${
       active ? "bg-white" : "bg-black"
      }`}>
      <Link
       href={link.href}
       id={link.id}
       className={`text-decoration-none d-block ${
        active ? "text-danger" : "text-white"
       }`}>
       <link.Icon className={`fs-1 ${link.iconClass}`} />
       {link.label}
      </Link>
     </ListGroupItem>
    );
   })}
  </ListGroup>
 );
}