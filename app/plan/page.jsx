import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { DEFAULT_WORKOUTS } from '../../data/workouts';

export const metadata = {
  title: 'Forge — Plan',
  description: 'The programming behind the workouts: schedule, loading, and progressions.',
};

const estMinutes = (w) => {
  let total = 0;
  for (const ex of w.exercises) {
    total += ex.sets * ((ex.durationSeconds || 30) + ex.restSeconds);
  }
  return Math.round(total / 60);
};

const dose = (ex) => {
  const work = ex.durationSeconds ? `${ex.sets} × ${ex.durationSeconds}s` : `${ex.sets} × ${ex.reps}`;
  return ex.weight > 0 ? `${work} · ${ex.weight} kg` : work;
};

const SECTIONS = [
  { id: 'baseline', label: 'Baseline' },
  { id: 'ceiling', label: 'The ceiling' },
  { id: 'week', label: 'Week' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'weights', label: 'Weights' },
  { id: 'pullup', label: 'Pull-up' },
  { id: 'pushup', label: 'Push-ups' },
  { id: 'rope', label: 'Rope' },
  { id: 'moves', label: 'Movements' },
];

const BASELINE = [
  { label: 'Dead hang', now: '6', unit: 's', pct: 20, goal: 'Target 30s' },
  { label: 'Push-ups', now: '10', unit: '', pct: 50, goal: 'Target 20' },
  { label: 'Pull-ups', now: '0', unit: '', pct: 2, goal: 'Target 1' },
  { label: 'Rope, unbroken', now: '1', unit: 'min', pct: 10, goal: 'Target 10 min' },
];

const LEVERS = [
  ['Unilateral', 'One leg or one arm at a time doubles the relative load. A 10 kg single-leg RDL beats a 20 kg two-leg one, and then some.'],
  ['Tempo', 'Three seconds down. Same weight, far more time under tension.'],
  ['Pauses', 'Two seconds at the hardest position. Dead stop, no bounce out of the bottom.'],
  ['Reps', '12 → 15 → 20 before you write a set off as pointless.'],
  ['Shorter rest', '90s → 60s → 45s on the same weight is a real overload.'],
];

const WEEK = [
  ['Mon', 'Upper A — Pull', null, '~40 min'],
  ['Tue', 'Lower + Core', '+ Daily Practice', '~30 min'],
  ['Wed', 'Conditioning', '+ Daily Practice', '~27 min'],
  ['Thu', 'Upper B — Push', null, '~40 min'],
  ['Fri', 'Lower + Core', '2nd pass — add reps or slow the tempo', '~30 min'],
  ['Sat', 'Easy Cardio', 'or full rest, + Daily Practice', '~13 min'],
  ['Sun', 'Rest', null, '—'],
];

const WEIGHTS = [
  ['One-arm DB row', '10 kg', 'Already your ceiling. Progress with a 3s lower, then a 2s pause at the top, then 15 reps.'],
  ['Goblet squat', '10 kg', 'Light on purpose — the tempo is the exercise.'],
  ['Single-leg DB RDL', '10 kg', 'Held in the hand opposite the working leg. Balance limits you before the weight does.'],
  ['Bulgarian split squat', '7.5 kg', 'The most useful leg exercise you own. Go to 10 kg when 3 × 10 is clean.'],
  ['Single-leg calf raise', '10 kg', 'One dumbbell, hold something for balance. 2s pause at the top.'],
  ['DB floor press', '10 kg', 'Too light to be your main press — that is the push-ups. This is 12 slow reps for volume.'],
  ['Seated overhead press', '7.5 kg', 'The one dumbbell lift where 10 kg is a genuine challenge. Get to 4 × 10, then move up.'],
  ['Overhead tricep extension', '7.5 kg', 'One dumbbell in both hands, or 5 kg in each hand.'],
  ['DB pullover', '10 kg', 'One dumbbell, both hands.'],
  ['Lateral raise / reverse fly', '4 kg', 'Yes, that light. If it is swinging, it is too heavy.'],
  ['DB thruster', '7.5 kg', 'Conditioning, not strength — keep moving.'],
  ['Suitcase carry', '10 kg', 'One hand, stay perfectly upright, swap each set.'],
];

const ROPE = [
  ['1–2', '6 × 60s', '45s'],
  ['3–4', '6 × 60s', '30s'],
  ['5–6', '5 × 90s', '30s'],
  ['7–8', '4 × 2 min', '30s'],
  ['9+', '3 × 3 min', '45s'],
];

const STAGES = [
  {
    when: 'Weeks 1–4 · target 30s',
    title: 'Own the hang',
    points: [
      ['Max hangs', '3 sets, full 90s rest. Start at 4–5s, about 70% of your best, not 6. Add roughly 2s per set per week.'],
      ['Feet-assisted hangs', 'Toes on a chair taking just enough weight that you can hold 45s. This is where the endurance actually gets built — you cannot accumulate volume out of 6-second sets. Take less weight off the chair each week.'],
      [null, 'Use chalk, or hang a towel over the bar, if your skin gives out before your grip does.'],
    ],
  },
  {
    when: 'Week 2 onward',
    title: 'Assisted reps and negatives',
    points: [
      ['Scapular pull', 'Hang with straight arms, pull your shoulder blades down and back so your body rises 2–3 cm. No elbow bend at all. 3 × 5.'],
      ['Chair-assisted pull-up', '3 × 6–8, feet on the seat. See the assistance ladder below — this is the exercise that actually gets you the first rep.'],
      ['Negative', 'Step off a chair into the top position, chin over the bar, then lower under control. Start with a 3s lower, build to 5s, then 8s. 3 × 3, and end the set the moment a lower turns into a drop.'],
    ],
  },
  {
    when: 'Roughly weeks 6–10',
    title: 'The first rep',
    points: [
      [null, 'When you can hold a 20s hang and control an 8s negative, test one pull-up at the very start of Upper A, fully fresh.'],
      [null, 'Once you get it, replace the negatives with 5 sets of 1 rep, 2 minutes rest, and add one rep to one set each week.'],
    ],
  },
];

const MOVES = [
  ['Feet-assisted hang', 'Hang from the bar with your toes on a chair, supporting just enough weight to hold 45 seconds. Volume you cannot get out of 6-second max hangs.'],
  ['Towel hang', 'Drape a towel over the bar and grip the two ends. Much harder on the grip at the same bodyweight — this is how you overload grip without heavier dumbbells.'],
  ['Chair-assisted pull-up', 'Chair under the bar, feet on the seat, legs helping only as much as they must. Your main pulling exercise until the first unassisted rep.'],
  ['DB floor press', 'Bench press lying on the floor. Your elbows stop at the ground, which is also what protects your shoulders without a bench.'],
  ['DB pullover', 'Lie on the floor, both hands on one dumbbell, arms straight, lower it back past your head. Lats and serratus.'],
  ['Bulgarian split squat', 'Rear foot up on a chair, dumbbells at your sides, drop straight down. Brutal at light weight, which is exactly why it is here.'],
  ['Single-leg hip thrust', 'Shoulders on the floor, one foot planted, the other knee tucked, drive your hips up. Glutes without a bench.'],
  ['Chair dip', 'Hands on the edge of a chair behind you, feet out front. Keep the chair against a wall.'],
  ['Suitcase carry march', 'One dumbbell in one hand, march in place staying perfectly upright. Anti-lateral-flexion core, plus grip.'],
  ['Thruster', 'Front squat straight into an overhead press, one continuous movement.'],
];

function SectionHead({ kicker, title }) {
  return (
    <>
      <div className="text-lime-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">{kicker}</div>
      <h2 className="font-display text-4xl leading-none mb-4">{title}</h2>
    </>
  );
}

export default function PlanPage() {
  return (
    <div className="max-w-xl mx-auto px-5 pb-24">

      <header className="pt-10 pb-8 border-b-2 border-white">
        <Link href="/" className="inline-flex items-center gap-1 -ml-1 mb-8 text-zinc-400 text-xs uppercase tracking-[0.2em] active:text-white">
          <ChevronLeft className="w-4 h-4" /> Workouts
        </Link>
        <div className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-2">Home training plan · rev. 2</div>
        <h1 className="font-display text-6xl leading-[0.9]">TEN KILO<br />CEILING</h1>
        <p className="text-zinc-400 mt-4 leading-relaxed">
          Two dumbbells that stop at 10 kg, a doorway bar, and a rope — programmed so the load never has to be the thing that gets harder.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {['66 kg · 165 cm', '2 × 10 kg adjustable', 'Doorway bar', 'Jump rope', '4–6 days / week'].map((f) => (
            <span key={f} className="font-mono text-[10px] text-zinc-300 border border-zinc-700 rounded px-2 py-1">{f}</span>
          ))}
        </div>
      </header>

      <nav className="sticky top-0 z-20 -mx-5 px-5 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="flex gap-5 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400 active:text-lime-400">
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="baseline" className="pt-12 scroll-mt-14">
        <SectionHead kicker="Where you're starting" title="FOUR NUMBERS" />
        <p className="text-zinc-400 leading-relaxed mb-5">
          Everything in this plan exists to move one of these. Re-test every three weeks, on the same day of the week, fully fresh, before anything else.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {BASELINE.map((b) => (
            <div key={b.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-3">{b.label}</div>
              <div className="font-display text-4xl leading-none tabular-nums">
                {b.now}<span className="text-base text-zinc-500 ml-0.5">{b.unit}</span>
              </div>
              <div className="h-[3px] bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-lime-400" style={{ width: `${b.pct}%` }} />
              </div>
              <div className="font-mono text-[10px] text-zinc-500 mt-2 tabular-nums">{b.goal}</div>
            </div>
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-5 leading-relaxed">
          Also on file: a 10-minute farmer&apos;s hold at 5.5 kg per hand. That one number rewrote half this plan.
        </p>
      </section>

      <section id="ceiling" className="pt-14 scroll-mt-14">
        <SectionHead kicker="The constraint" title="LOAD IS NOT THE VARIABLE" />
        <div className="bg-zinc-900 border-l-2 border-lime-400 rounded-r-xl p-4 mb-6">
          <p className="text-zinc-300 leading-relaxed mb-3">
            Your dumbbells top out at <strong className="text-white font-semibold">20 kg total — about 30% of your bodyweight.</strong> A push-up already loads you with roughly 42 kg.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            So for legs and chest, the dumbbells are not, and never will be, the hard part. Adding weight stops working in a few weeks. These five levers work for years.
          </p>
        </div>
        <ol className="border-t border-zinc-800">
          {LEVERS.map(([name, text], i) => (
            <li key={name} className="grid grid-cols-[1.75rem_1fr] gap-3 py-3 border-b border-zinc-800">
              <span className="font-mono text-xs text-lime-400 pt-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-zinc-400 leading-relaxed">
                <strong className="text-white font-semibold">{name}.</strong> {text}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-zinc-400 leading-relaxed mt-5">
          Only the pressing and pulling work has room to grow by weight, and even there you cap out within a few months. That is fine — bodyweight work on the bar and the floor is what carries you from there.
        </p>
      </section>

      <section id="week" className="pt-14 scroll-mt-14">
        <SectionHead kicker="The week" title="EVERY GROUP, TWICE" />
        <p className="text-zinc-400 leading-relaxed mb-4">
          Short on time? <strong className="text-white font-semibold">Mon / Wed / Fri</strong> as Pull → Lower → Push is a complete week on its own.
        </p>
        <div className="border-t border-zinc-800">
          {WEEK.map(([day, what, sub, time]) => (
            <div key={day} className="grid grid-cols-[2.5rem_1fr_auto] gap-3 items-baseline py-3 border-b border-zinc-800">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">{day}</span>
              <span>
                <span className={what === 'Rest' ? 'text-zinc-500' : 'text-white'}>{what}</span>
                {sub && <span className="block text-zinc-500 text-sm">{sub}</span>}
              </span>
              <span className="font-mono text-[10px] text-zinc-500 tabular-nums whitespace-nowrap">{time}</span>
            </div>
          ))}
        </div>
        <p className="text-zinc-400 leading-relaxed mt-5">
          <strong className="text-white font-semibold">Daily Practice</strong> is 12 minutes and it is the single biggest lever on the pull-up. Do it on any day that is not Upper A or Upper B. It is deliberately easy — never go near failure.
        </p>
      </section>

      <section id="sessions" className="pt-14 scroll-mt-14">
        <SectionHead kicker="The sessions" title="WHAT'S IN EACH" />
        <p className="text-zinc-400 leading-relaxed mb-5">
          Straight from the workouts in the app. Weights are kilograms per dumbbell.
        </p>
        <div className="space-y-2">
          {DEFAULT_WORKOUTS.map((w) => (
            <details key={w.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer list-none flex items-start justify-between gap-3 active:bg-zinc-800/60">
                <span>
                  <span className="font-display text-2xl leading-tight block">{w.name.toUpperCase()}</span>
                  <span className="text-zinc-500 text-sm">{w.subtitle}</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-500 whitespace-nowrap pt-1.5">
                  ~{estMinutes(w)} min
                </span>
              </summary>
              {w.exercises.map((ex) => (
                <div key={ex.id} className="grid grid-cols-[1fr_auto] gap-3 items-baseline px-4 py-2.5 border-t border-zinc-800">
                  <span className="text-zinc-300 text-sm">{ex.name}</span>
                  <span className="text-right whitespace-nowrap">
                    <span className="block font-mono text-xs text-lime-400 tabular-nums">{dose(ex)}</span>
                    <span className="block font-mono text-[10px] text-zinc-500 tabular-nums">rest {ex.restSeconds}s</span>
                  </span>
                </div>
              ))}
            </details>
          ))}
        </div>
      </section>

      <section id="weights" className="pt-14 scroll-mt-14">
        <SectionHead kicker="Loading" title="STARTING WEIGHTS" />
        <p className="text-zinc-400 leading-relaxed mb-4">
          Kilograms per dumbbell. Deliberately conservative — set 1 should feel like you had three more reps in you. Adjust after your first session and do not look back.
        </p>
        <div className="border-t border-zinc-800">
          {WEIGHTS.map(([name, kg, note]) => (
            <div key={name} className="py-3 border-b border-zinc-800">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-white">{name}</span>
                <span className="font-mono text-sm text-lime-400 tabular-nums whitespace-nowrap">{kg}</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mt-1">{note}</p>
            </div>
          ))}
        </div>
        <p className="text-zinc-400 leading-relaxed mt-5">
          <strong className="text-white font-semibold">When to add weight:</strong> you hit the top of the rep range on every set with one or two reps still in the tank. Then add the smallest plate you have and drop back to the bottom of the range. Once you are at 10 kg you are capped — switch to the five levers instead.
        </p>
        <p className="text-zinc-400 leading-relaxed mt-3">
          <strong className="text-white font-semibold">Deloads:</strong> every 6–8 weeks, or any time two sessions in a row go backwards. Same workouts, two-thirds of the weight, stop three reps short of where you normally would. One week, then carry on.
        </p>
      </section>

      <section id="pullup" className="pt-14 scroll-mt-14">
        <SectionHead kicker="The main project" title="ZERO TO ONE" />
        <div className="bg-zinc-900 border-l-2 border-lime-400 rounded-r-xl p-4 mb-5">
          <p className="text-zinc-300 leading-relaxed mb-3">
            <strong className="text-white font-semibold">Your farmer&apos;s hold changed the read here.</strong> Ten minutes at 5.5 kg per hand means grip endurance is not your limiter — that is 11 kg total, where a dead hang puts 30–40 kg through each hand.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            What you are missing is grip at near-bodyweight load, plus the shoulder and lat endurance to stay under the bar. That is why there are no farmer&apos;s holds in this plan: at your ceiling they cannot get heavy enough to matter. Hanging is the grip work now.
          </p>
        </div>
        <p className="text-zinc-400 leading-relaxed mb-2">
          The good news: <strong className="text-white font-semibold">66 kg at 165 cm is a favourable build for this.</strong> There is not much of you to lift. Months-long project, not a years-long one.
        </p>
        <div className="border-t border-zinc-800 mt-5">
          {STAGES.map((s, i) => (
            <div key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-3 py-5 border-b border-zinc-800">
              <span className="font-mono text-xs text-lime-400 pt-1">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mb-1">{s.when}</div>
                <h3 className="font-display text-2xl leading-tight mb-2">{s.title.toUpperCase()}</h3>
                <ul className="space-y-2">
                  {s.points.map(([term, text]) => (
                    <li key={text} className="text-zinc-400 leading-relaxed text-[15px]">
                      {term && <strong className="text-white font-semibold">{term} — </strong>}
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p className="text-zinc-400 leading-relaxed mt-5">
          <strong className="text-white font-semibold">Chair-assisted pull-ups are the scalable pull.</strong> Put a chair under the bar, feet on the seat, and push through your legs for exactly as much help as you need to get your chin over. It trains the real movement including the pulling half, which negatives never do.
        </p>
        <p className="text-zinc-400 leading-relaxed mt-3">
          The assistance ladder, in order: both feet flat on the seat → both heels only → one foot → one toe → nothing. Move down a rung when you can do 3 × 8 at the current one. If the chair sits too low to reach comfortably, a stack of books, a sofa arm, or the edge of a bed all work — what matters is that your legs can take part of the load and give it back gradually.
        </p>
      </section>

      <section id="pushup" className="pt-14 scroll-mt-14">
        <SectionHead kicker="Ten to twenty" title="STOP GOING TO FAILURE" />
        <p className="text-zinc-400 leading-relaxed mb-3">
          Grinding out sets of 10 is why you are stuck at 10. Do volume at about 60% of max instead: <strong className="text-white font-semibold">5 × 6 with 60s rest</strong> on Upper B, plus 4 × 5 in Daily Practice. Weekly reps go from around 30 to around 70 without a single hard set.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Your dumbbells cannot overload a press — 20 kg is less than half what a push-up already asks of you — so push-ups are the chest program, and the floor press is accessory volume.
        </p>
        <p className="text-zinc-400 leading-relaxed">
          Re-test your max every three weeks, first thing on Upper B, then reset the working sets to 60% of the new number. Past 15, switch to feet-elevated push-ups and restart the count. If a set of 6 ever feels hard, you are too deep into fatigue — cut it to 5.
        </p>
      </section>

      <section id="rope" className="pt-14 scroll-mt-14">
        <SectionHead kicker="Conditioning" title="CUT REST FIRST" />
        <p className="text-zinc-400 leading-relaxed mb-4">
          Right now you rest as long as you work, a 1:1 ratio. That ratio is the thing to attack first.
        </p>
        <div className="border-t border-zinc-800">
          <div className="grid grid-cols-3 gap-3 py-2 border-b border-zinc-800 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            <span>Weeks</span><span>Work</span><span>Rest</span>
          </div>
          {ROPE.map(([weeks, work, rest]) => (
            <div key={weeks} className="grid grid-cols-3 gap-3 py-3 border-b border-zinc-800 font-mono text-sm tabular-nums">
              <span className="text-zinc-500">{weeks}</span>
              <span className="text-white">{work}</span>
              <span className="text-lime-400">{rest}</span>
            </div>
          ))}
        </div>
        <p className="text-zinc-400 leading-relaxed mt-5">
          From week 9, chase 10 minutes unbroken. Trips do not end an interval — pick the rope up and keep going until the timer stops. Count total time skipping, not consecutive jumps.
        </p>
      </section>

      <section id="moves" className="pt-14 scroll-mt-14">
        <SectionHead kicker="Reference" title="MOVEMENTS" />
        <div className="border-t border-zinc-800">
          {MOVES.map(([name, text]) => (
            <div key={name} className="py-3.5 border-b border-zinc-800">
              <h3 className="text-white mb-1">{name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-14 pt-6 border-t-2 border-white">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Before every session</div>
        <p className="text-zinc-400 leading-relaxed">
          2–3 minutes of easy rope, arm circles, 10 bodyweight squats, 5 slow push-ups. Then start.
        </p>
      </footer>

    </div>
  );
}
