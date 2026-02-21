import "./index.css";
import TailwindSpacing from "./TailwindSpacing";
import TailwindTypography from "./TailwindTypography";
import TailwindBackgroundColors from "./TailwindBackgroundColors";
import TailwindResponsiveDesign from "./TailwindResponsiveDesign";
import TailwindFilters from "./TailwindFilters";
import TailwindGrids from "./TailwindGrids";

export default function TailwindLab() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>

      <div id="wd-tailwind-spacing">
        <h2 className="text-3xl font-bold mt-8 mb-4">Labs - Tailwind - Spacing</h2>
        <TailwindSpacing />
      </div>

      <div id="wd-tailwind-typography">
        <h2 className="text-3xl font-bold mt-8 mb-4">Labs - Tailwind - Typography</h2>
        <TailwindTypography />
      </div>

      <div id="wd-tailwind-background-colors">
        <h2 className="text-3xl font-bold mt-8 mb-4">Labs - Tailwind - Background Colors</h2>
        <TailwindBackgroundColors />
      </div>

      <div id="wd-tailwind-responsive-design">
        <h2 className="text-3xl font-bold mt-8 mb-4">Labs - Tailwind - Responsive Design</h2>
        <TailwindResponsiveDesign />
      </div>

      <div id="wd-tailwind-filters">
        <h2 className="text-3xl font-bold mt-8 mb-4">Labs - Tailwind - Filters</h2>
        <TailwindFilters />
      </div>

      <div id="wd-tailwind-css-grid-layout">
        <h2 className="text-3xl font-bold mt-8 mb-4">Labs - Tailwind - CSS Grid Layout</h2>
        <TailwindGrids />
      </div>
    </div>
  );
}
