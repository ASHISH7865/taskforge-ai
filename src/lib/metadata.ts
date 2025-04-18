export interface PageMetadata {
  title: string;
  description: string;
}

// Central registry of page metadata
const pageMetadata: Record<string, PageMetadata> = {
  "/": {
    title: "Dashboard",
    description: "Overview of your tasks and activities",
  },
  "/todo": {
    title: "Todo",
    description: "Manage your tasks and to-dos",
  },
  "/notes": {
    title: "Notes",
    description: "Your personal notes and thoughts",
  },
  "/settings": {
    title: "Settings",
    description: "Configure your application preferences",
  },
};

/**
 * Register metadata for a specific route
 */
export function registerPageMetadata(route: string, metadata: PageMetadata): void {
  pageMetadata[route] = metadata;
}

/**
 * Get metadata for a specific route or fallback to default values
 */
export function getPageMetadata(pathname: string, fallbackTitle?: string): PageMetadata {
  // Try to find exact match first
  if (pageMetadata[pathname]) {
    return pageMetadata[pathname];
  }

  // Check for dynamic route patterns
  const dynamicRouteMatch = Object.keys(pageMetadata).find(route => {
    if (route.includes("[")) {
      const routeRegex = new RegExp(
        "^" + route.replace(/\[.*?\]/g, "[^/]+") + "$"
      );
      return routeRegex.test(pathname);
    }
    return false;
  });

  if (dynamicRouteMatch) {
    return pageMetadata[dynamicRouteMatch];
  }

  // Default fallback
  return {
    title: fallbackTitle || "Page",
    description: "Page details",
  };
}

export default pageMetadata;
