import { ReactNode } from "react";
import TOC from "./TOC";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

export default function LabsLayout({
 children,
}: Readonly<{ children: ReactNode }>) {
 return (
   <table>
     <tbody>
       <tr>
         <td valign="top" width="100px">
           <TOC />
         </td>
         <td valign="top">{children}</td>
       </tr>
     </tbody>
   </table>
);}
