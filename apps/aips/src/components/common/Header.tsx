import React from 'react';
import { Bell, Search, User, Settings } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-foreground">
                        AIPS
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Advanced Integrated Planning System
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* 검색 버튼 */}
                <button className="h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Search className="h-4 w-4" />
                </button>

                {/* 알림 버튼 */}
                <button className="h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-Colors-Error-500 rounded-full"></span>
                </button>

                {/* 설정 버튼 */}
                <button className="h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Settings className="h-4 w-4" />
                </button>

                {/* 사용자 프로필 */}
                <button className="h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <User className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
};

export default Header;