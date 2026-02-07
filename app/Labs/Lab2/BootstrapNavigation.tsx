import { Nav, NavItem, NavLink } from "react-bootstrap";

export default function BootstrapNavigation() {
  return (
  <div id="wd-css-navigating-with-tabs">
    <h2>Tabs</h2>
    <Nav variant="tabs">
        <NavItem>
        <NavLink href="#/labs/lab2/Active">Active</NavLink>
        </NavItem>
        <NavItem>
        <NavLink href="#/labs/lab2/Link1">Link 1</NavLink>
        </NavItem>
        <NavItem>
        <NavLink href="#/labs/lab2/Link2">Link 2</NavLink>
        </NavItem>
        <NavItem>
        <NavLink href="#/labs/lab2/Disabled" disabled>Disabled</NavLink>
        </NavItem>
    </Nav>
</div>
  )
}