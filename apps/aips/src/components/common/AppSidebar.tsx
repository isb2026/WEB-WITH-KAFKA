import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MainMenus } from '@aips/routes/menu';
import { MenuType } from '@aips/types/menus';
import { getIconComponent } from '@aips/utils/iconMapping';
import { useT } from '@repo/i18n';
import { ChevronDown } from 'lucide-react';

const AppSidebar: React.FC = () => {
    const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(new Set());
    const t = useT('menu');
    const location = useLocation();

    // Get the single AIPS menu
    const aipsMenu = MainMenus.find(
        (item): item is MenuType => !('type' in item && item.type === 'divider')
    );

    if (!aipsMenu) {
        return null;
    }

    const toggleSubmenu = (itemName: string) => {
        setExpandedSubmenus((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemName)) {
                newSet.delete(itemName);
            } else {
                newSet.add(itemName);
            }
            return newSet;
        });
    };

    return (
        <aside className="w-64 border-r flex flex-col h-full transition-[width] duration-300 ease-in-out bg-[color:var(--sidebar-background)]">
            {/* AIPS Menu Items */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2 transition-all duration-300 ease-in-out opacity-100 max-h-full">
                <div className="w-full flex flex-col gap-1 mt-3">
                    {aipsMenu.children.map((item) => (
                        <div key={item.to}>
                            {item.children ? (
                                // Nested sub-menu with children
                                <div className="mb-2">
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {React.createElement(getIconComponent(item.icon), { size: 20 })}
                                            <span className="font-bold text-sm leading-[20px] whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {t(item.name)}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expandedSubmenus.has(item.name) ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {expandedSubmenus.has(item.name) && (
                                        <div className="ml-6">
                                            {item.children.map((subItem) => (
                                                <Link
                                                    key={subItem.to}
                                                    to={subItem.to}
                                                    className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
                                                >
                                                    {React.createElement(getIconComponent(subItem.icon), { size: 16 })}
                                                    <span className="font-medium text-sm leading-[20px] whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                        {t(subItem.name)}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Regular sub-menu item
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
                                >
                                    {React.createElement(getIconComponent(item.icon), { size: 20 })}
                                    <span className="font-bold text-sm leading-[20px] whitespace-nowrap text-gray-900 dark:text-gray-100">
                                        {t(item.name)}
                                    </span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default AppSidebar;