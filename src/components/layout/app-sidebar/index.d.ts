type NavigationItem = {
    path: string;
    label: string;
    icon: React.ReactNode;
    children?: NavigationItem[];
}

export type { NavigationItem };
