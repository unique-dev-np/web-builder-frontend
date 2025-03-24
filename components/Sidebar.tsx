import { SidebarActionItems, SidebarProjectItems } from "./SidebarItems";
import { Separator } from "./ui/separator";
import { ProjectMeta } from "../types";

const projectMetas: ProjectMeta[] = [
  { id: "proj1", name: "Landing Page Redesign" },
  { id: "proj2", name: "E-commerce Dashboard" },
  { id: "proj3", name: "Portfolio Site" },
  { id: "proj4", name: "Blog Template" },
  { id: "proj5", name: "Admin Panel" },
  { id: "proj6", name: "Marketing Campaign" },
  { id: "proj7", name: "Product Showcase" },
  { id: "proj8", name: "Contact Form" },
  { id: "proj9", name: "About Us Page" },
  { id: "proj10", name: "User Profile" },
  { id: "proj11", name: "Authentication Flow" },
  { id: "proj12", name: "Pricing Table" },
  { id: "proj13", name: "Feature List" },
  { id: "proj14", name: "Team Members" },
  { id: "proj15", name: "Services Section" },
  { id: "proj16", name: "FAQ Page" },
  { id: "proj17", name: "Testimonials" },
  { id: "proj18", name: "Newsletter Signup" },
  { id: "proj19", name: "Footer Design" },
  { id: "proj20", name: "Navigation Menu" },
];

function Sidebar() {
  return (
    <section
      id="sidebar"
      className="w-[40vw] md:w-[30vw] lg:w-[20vw] h-screen px-4 py-4 border-r "
    >
      <div id="header" className="text-2xl font-bold">
        Yuganta Web Builder
      </div>
      <Separator className="my-4" />
      <SidebarActionItems type="create-conversation" className="mt-4" />
      <Separator className="my-4" />
      <SidebarProjectItems
        projectMetas={projectMetas}
        className="mt-4 h-[60vh] overflow-y-auto"
      />
      <Separator className="my-4" />
      <SidebarActionItems type="settings" className="mt-4" />
    </section>
  );
}

export default Sidebar;
