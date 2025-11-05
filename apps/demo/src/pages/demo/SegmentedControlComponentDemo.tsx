import React, { useState } from 'react';
import { SegmentedControl, SegmentedControlItem } from '@repo/radix-ui/components';
import { TableIcon, ListBulletIcon, GridIcon, UnderlineIcon, TextIcon, SunIcon, MoonIcon, CalendarIcon } from '@radix-ui/react-icons';

// Add a custom style for the selected segment
const selectedSegmentClass =
  'data-[state=on]:ring-2 data-[state=on]:ring-blue-500 data-[state=on]:bg-gray-800 data-[state=on]:text-white';
const baseSegmentClass =
  'px-4 py-2 rounded-md transition-colors duration-150 text-sm text-gray-200 bg-transparent hover:bg-gray-800 focus:outline-none';

const SegmentedControlComponentDemoPage: React.FC = () => {
  // Example 1: View switcher
  const [view, setView] = useState('grid');
  // Example 2: Formatting (multi)
  const [format, setFormat] = useState(['bold']);
  // Example 3: Mode selector
  const [mode, setMode] = useState('week');
  // Example 4: Disabled state
  const [option, setOption] = useState('1');

  return (
    <div className="bg-gray-100 p-8 h-full flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Segmented Control (ToggleGroup) Demo</h1>
        <p className="text-sm text-gray-500 mb-8">
          Segmented controls let users switch between views or modes. Only one can be selected at a time (single), or multiple (multi). Fully keyboard accessible.
        </p>

        {/* Example 1: View Switcher */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">View Switcher</h2>
          <div className="flex justify-center">
            <SegmentedControl
              type="single"
              value={view}
              onValueChange={setView}
              aria-label="View switcher"
            >
              <SegmentedControlItem value="list" aria-label="List view" className={`${baseSegmentClass} ${selectedSegmentClass}`}>
                <span className="flex items-center gap-1"><ListBulletIcon /> List</span>
              </SegmentedControlItem>
              <SegmentedControlItem value="grid" aria-label="Grid view" className={`${baseSegmentClass} ${selectedSegmentClass}`}>
                <span className="flex items-center gap-1"><GridIcon /> Grid</span>
              </SegmentedControlItem>
              <SegmentedControlItem value="table" aria-label="Table view" className={`${baseSegmentClass} ${selectedSegmentClass}`}>
                <span className="flex items-center gap-1"><TableIcon /> Table</span>
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div className="mt-2 text-sm text-gray-600">You selected: <b>{view.charAt(0).toUpperCase() + view.slice(1)} view</b></div>
        </div>

        {/* Example 2: Formatting (multi) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Formatting (Multi-select)</h2>
          <div className="flex justify-center">
            <SegmentedControl
              type="multiple"
              value={format}
              onValueChange={setFormat}
              aria-label="Formatting options"
            >
              <SegmentedControlItem value="bold" aria-label="Bold" className={`${baseSegmentClass} ${selectedSegmentClass}`}><TextIcon /> Bold</SegmentedControlItem>
              <SegmentedControlItem value="italic" aria-label="Italic" className={`${baseSegmentClass} ${selectedSegmentClass}`}><TextIcon /> Italic</SegmentedControlItem>
              <SegmentedControlItem value="underline" aria-label="Underline" className={`${baseSegmentClass} ${selectedSegmentClass}`}><UnderlineIcon /> Underline</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div className="mt-2 text-sm text-gray-600">Active: <b>{format.length ? format.join(', ') : 'None'}</b></div>
        </div>

        {/* Example 3: Mode Selector with Icons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Mode Selector (with Icons)</h2>
          <div className="flex justify-center">
            <SegmentedControl
              type="single"
              value={mode}
              onValueChange={setMode}
              aria-label="Mode selector"
            >
              <SegmentedControlItem value="day" aria-label="Day" className={`${baseSegmentClass} ${selectedSegmentClass}`}><SunIcon /> Day</SegmentedControlItem>
              <SegmentedControlItem value="week" aria-label="Week" className={`${baseSegmentClass} ${selectedSegmentClass}`}><CalendarIcon /> Week</SegmentedControlItem>
              <SegmentedControlItem value="month" aria-label="Month" className={`${baseSegmentClass} ${selectedSegmentClass}`}><MoonIcon /> Month</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div className="mt-2 text-sm text-gray-600">Current mode: <b>{mode.charAt(0).toUpperCase() + mode.slice(1)}</b></div>
        </div>

        {/* Example 4: Disabled State */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Disabled State</h2>
          <div className="flex justify-center">
            <SegmentedControl
              type="single"
              value={option}
              onValueChange={setOption}
              aria-label="Options"
            >
              <SegmentedControlItem value="1" aria-label="Option 1" className={`${baseSegmentClass} ${selectedSegmentClass}`}>Option 1</SegmentedControlItem>
              <SegmentedControlItem value="2" aria-label="Option 2" disabled className={`${baseSegmentClass} ${selectedSegmentClass}`}>Option 2 (disabled)</SegmentedControlItem>
              <SegmentedControlItem value="3" aria-label="Option 3" className={`${baseSegmentClass} ${selectedSegmentClass}`}>Option 3</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div className="mt-2 text-sm text-gray-600">Selected: <b>{option}</b> (Option 2 is disabled)</div>
        </div>

        
      </div>
    </div>
  );
};

export default SegmentedControlComponentDemoPage; 