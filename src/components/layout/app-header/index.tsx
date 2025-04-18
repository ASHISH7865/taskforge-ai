"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { getPageMetadata } from "@/lib/metadata";
import type { BreadcrumbItem as BreadcrumbItemType } from "./index.d";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppHeader() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Split the pathname into segments
    const segments = pathname
      .split("/")
      .filter(Boolean);

    // Create an array of breadcrumb items
    const items: BreadcrumbItemType[] = [
      {
        label: "Home",
        href: "/",
        current: pathname === "/",
      },
    ];

    // Build the breadcrumb path progressively
    let currentPath = "";

    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Convert segment to readable format (capitalize first letter, replace hyphens with spaces)
      const label = segment
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      items.push({
        label,
        href: currentPath,
        current: currentPath === pathname,
      });
    });

    return items;
  }, [pathname]);

  // Get the current page info from the metadata utility
  const pageInfo = useMemo(() => {
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    return getPageMetadata(pathname, lastBreadcrumb?.label);
  }, [pathname, breadcrumbs]);

  return (
    <div className="border-b pb-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.current ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Title and Description */}
      <div>
        <h1 className="text-2xl font-semibold">{pageInfo.title}</h1>
        <p className="text-muted-foreground text-sm">{pageInfo.description}</p>
      </div>
    </div>
  );
}

export default AppHeader;
