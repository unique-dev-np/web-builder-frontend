"use client";

import { ReactNode } from "react";
import { FaCogs, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ProjectMeta,
  SidebarActionItemsProps,
  SidebarProjectItemsProps,
} from "../types";

interface ActionItemProps {
  icon: ReactNode;
  text: string;
}

export function SidebarActionItems({
  type,
  className,
}: SidebarActionItemsProps) {
  const actions = [
    {
      icon: <FaPlus />,
      text: "New Project",
      type: "create-conversation",
      category: "element",
      element: (
        <Button
          key={"new-project"}
          variant="outline"
          className="w-full justify-start"
          asChild
        >
          <Link href={"/project"}>
            <FaPlus /> New Project
          </Link>
        </Button>
      ),
    },
    {
      icon: <FaCogs />,
      text: "Setting",
      func: () => {
        console.log("Settings");
      },
      type: "settings",
      category: "function",
    },
  ];

  return (
    <>
      <div className={cn("flex flex-col gap-2 px-1", className)}>
        {actions
          .filter((action) => action.type === type)
          .map((action, index) =>
            action.category == "element" ? (
              action.element
            ) : (
              <SidebarActionItem key={index} {...action} />
            )
          )}
      </div>
    </>
  );
}

function SidebarActionItem({ icon, text }: ActionItemProps) {
  return (
    <Button variant="outline" className="w-full justify-start">
      {icon} {text}
    </Button>
  );
}

export function SidebarProjectItems({
  projectMetas,
  className,
}: SidebarProjectItemsProps) {
  return (
    <>
      <div className={cn("flex flex-col gap-2 px-1", className)}>
        {projectMetas.map((projectMeta, index) => (
          <SidebarProjectItem key={index} projectMeta={projectMeta} />
        ))}
      </div>
    </>
  );
}

function SidebarProjectItem({ projectMeta }: { projectMeta: ProjectMeta }) {
  const pathname = usePathname();
  const isActive = pathname === `/project/${projectMeta.id}`;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      asChild
      className="w-full justify-start"
    >
      <Link href={`/project/${projectMeta.id}`} className="!font-light">
        {projectMeta.name}
      </Link>
    </Button>
  );
}
