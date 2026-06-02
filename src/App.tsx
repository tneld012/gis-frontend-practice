import { useState } from 'react';

import Week1 from '@/weeks/week-1/week-1';
import Week2 from '@/weeks/week-2/week-2';
import Week3 from '@/weeks/week-3/week-3';
import Week4 from '@/weeks/week-4/week-4';

type WeekKey = 'week-1' | 'week-2' | 'week-3' | 'week-4';

const WEEKS: { key: WeekKey; label: string }[] = [
  { key: 'week-1', label: 'Week 1 · GeoJSON' },
  { key: 'week-2', label: 'Week 2 · MapLibre' },
  { key: 'week-3', label: 'Week 3 · 타일' },
  { key: 'week-4', label: 'Week 4 · 미니 프로젝트' },
];

const App = () => {
  const [activeWeek, setActiveWeek] = useState<WeekKey>('week-1');

  return (
    <>
      <nav className="app-nav">
        {WEEKS.map((week) => (
          <button
            key={week.key}
            type="button"
            data-active={activeWeek === week.key}
            onClick={() => setActiveWeek(week.key)}
          >
            {week.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeWeek === 'week-1' && <Week1 />}
        {activeWeek === 'week-2' && <Week2 />}
        {activeWeek === 'week-3' && <Week3 />}
        {activeWeek === 'week-4' && <Week4 />}
      </main>
    </>
  );
};

export default App;
