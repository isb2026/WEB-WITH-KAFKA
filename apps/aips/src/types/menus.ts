export interface MenuItem {
    name: string;
    to: string;
    icon: string;
    children?: MenuItem[];
}

export interface MenuType {
    label: string;
    icon: string;
    children: MenuItem[];
}

export type SolutionName = 'home' | 'ini' | 'forecast' | 'planning' | 'scheduling' | 'simulation' | 'monitoring' | 'mrp' | 'dispatching' | 'system';