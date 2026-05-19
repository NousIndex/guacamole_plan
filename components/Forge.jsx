'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Play, SkipForward, Plus, Minus, Edit2, X, Check,
  Dumbbell, Activity, Heart, Zap, Trash2, ArrowUp, ArrowDown, History as HistoryIcon, ChevronDown
} from 'lucide-react';
import { DEFAULT_WORKOUTS } from '../data/workouts';

/* ---------- storage (localStorage-backed, async-compatible API) ---------- */
const storage = {
  async get(key) {
    if (typeof window === 'undefined') return null;
    const v = window.localStorage.getItem(key);
    return v == null ? null : { value: v };
  },
  async set(key, value) {
    if (typeof window === 'undefined') return null;
    window.localStorage.setItem(key, value);
    return { value };
  },
};

const STORAGE_KEY = 'forge_workouts_v1';
const SESSIONS_KEY = 'forge_sessions_v1';

const iconMap = { dumbbell: Dumbbell, activity: Activity, heart: Heart, zap: Zap };

const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const estMinutes = (w) => {
  let total = 0;
  for (const ex of w.exercises) {
    const workTime = ex.durationSeconds || 30;
    total += ex.sets * (workTime + ex.restSeconds);
  }
  return Math.round(total / 60);
};

const parseRepsTarget = (s) => {
  if (!s) return 0;
  const range = s.match(/(\d+)\s*-\s*(\d+)/);
  if (range) return parseInt(range[2], 10);
  const single = s.match(/(\d+)/);
  if (single) return parseInt(single[1], 10);
  return 0;
};

const getLastSetForExercise = (sessions, exerciseId, setNum) => {
  for (const s of sessions) {
    const found = s.sets.find(set => set.exerciseId === exerciseId && set.setNum === setNum);
    if (found) return found;
  }
  return null;
};

const getLastPerformance = (sessions, exerciseId) => {
  for (const s of sessions) {
    const setsForEx = s.sets.filter(set => set.exerciseId === exerciseId);
    if (setsForEx.length) {
      return {
        reps: setsForEx.map(set => set.reps).filter(r => r !== null && r !== undefined),
        durations: setsForEx.map(set => set.durationSeconds).filter(d => d !== null && d !== undefined),
        weight: setsForEx[0].weight,
        date: s.completedAt,
      };
    }
  }
  return null;
};

const getWorkoutSessionsCount = (sessions, workoutId) =>
  sessions.filter(s => s.workoutId === workoutId).length;

const getLastSessionDate = (sessions, workoutId) => {
  const s = sessions.find(s => s.workoutId === workoutId);
  return s?.completedAt || null;
};

const formatRelative = (ms) => {
  if (!ms) return 'Not started';
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const formatFullDate = (ms) => {
  const d = new Date(ms);
  const opts = { weekday: 'short', month: 'short', day: 'numeric' };
  return d.toLocaleDateString(undefined, opts) + ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

let _audioCtx = null;
const beep = (freq = 880, dur = 200) => {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = _audioCtx.createOscillator();
    const gain = _audioCtx.createGain();
    osc.connect(gain); gain.connect(_audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, _audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + dur / 1000);
    osc.start();
    osc.stop(_audioCtx.currentTime + dur / 1000);
  } catch (e) {}
};
const buzz = (p) => { try { navigator.vibrate?.(p); } catch (e) {} };

export default function Forge() {
  const [workouts, setWorkouts] = useState(DEFAULT_WORKOUTS);
  const [sessions, setSessions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('home');
  const [activeId, setActiveId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get(STORAGE_KEY);
        if (r?.value) {
          const parsed = JSON.parse(r.value);
          if (Array.isArray(parsed) && parsed.length) setWorkouts(parsed);
        }
      } catch (e) {}
      try {
        const r2 = await storage.get(SESSIONS_KEY);
        if (r2?.value) {
          const parsed = JSON.parse(r2.value);
          if (Array.isArray(parsed)) setSessions(parsed);
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => { try { await storage.set(STORAGE_KEY, JSON.stringify(workouts)); } catch (e) {} })();
  }, [workouts, loaded]);

  useEffect(() => {
    if (!loaded) return;
    (async () => { try { await storage.set(SESSIONS_KEY, JSON.stringify(sessions)); } catch (e) {} })();
  }, [sessions, loaded]);

  const activeWorkout = workouts.find(w => w.id === activeId);
  const editingWorkout = workouts.find(w => w.id === editingId);

  const updateWorkout = (id, updater) => setWorkouts(ws => ws.map(w => (w.id === id ? updater(w) : w)));
  const addSession = (session) => setSessions(prev => [session, ...prev]);
  const deleteSession = (sessionId) => setSessions(prev => prev.filter(s => s.id !== sessionId));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b' }} className="text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', system-ui, sans-serif; background: #09090b; }
        .font-display { font-family: 'Anton', sans-serif; letter-spacing: 0.01em; }
        .font-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {view === 'home' && (
        <Home
          workouts={workouts}
          sessions={sessions}
          onStart={(id) => { setActiveId(id); setView('workout'); }}
          onEdit={(id) => { setEditingId(id); setView('edit'); }}
          onHistory={() => setView('history')}
          onResetAll={() => setWorkouts(DEFAULT_WORKOUTS)}
        />
      )}
      {view === 'workout' && activeWorkout && (
        <Workout
          workout={activeWorkout}
          sessions={sessions}
          onUpdate={(updater) => updateWorkout(activeWorkout.id, updater)}
          onComplete={addSession}
          onExit={() => { setActiveId(null); setView('home'); }}
        />
      )}
      {view === 'edit' && editingWorkout && (
        <EditView
          workout={editingWorkout}
          onUpdate={(updater) => updateWorkout(editingWorkout.id, updater)}
          onDone={() => { setEditingId(null); setView('home'); }}
          onResetThis={() => {
            const def = DEFAULT_WORKOUTS.find(w => w.id === editingWorkout.id);
            if (def) updateWorkout(editingWorkout.id, () => JSON.parse(JSON.stringify(def)));
          }}
        />
      )}
      {view === 'history' && (
        <HistoryView
          sessions={sessions}
          onBack={() => setView('home')}
          onDelete={deleteSession}
        />
      )}
    </div>
  );
}

function Home({ workouts, sessions, onStart, onEdit, onHistory, onResetAll }) {
  const totalSessions = sessions.length;
  return (
    <div className="max-w-md mx-auto px-5 pt-12 pb-24">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <div className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-2">Mobile Workout</div>
          <h1 className="font-display text-7xl leading-none">FORGE</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-[3px] w-12 bg-lime-400"></div>
            <div className="text-zinc-400 text-sm">
              {totalSessions === 0 ? 'No sessions yet' :
                <><span className="font-mono text-white">{totalSessions}</span> session{totalSessions === 1 ? '' : 's'} logged</>}
            </div>
          </div>
        </div>
        <button onClick={onHistory} className="p-3 -mr-3 -mt-3 text-zinc-400 active:text-white" aria-label="History">
          <HistoryIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {workouts.map((w, idx) => {
          const Icon = iconMap[w.icon] || Dumbbell;
          const minutes = estMinutes(w);
          const lastDate = getLastSessionDate(sessions, w.id);
          const count = getWorkoutSessionsCount(sessions, w.id);
          return (
            <div key={w.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <button onClick={() => onStart(w.id)} className="w-full p-5 text-left active:bg-zinc-800/60 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-zinc-500 font-mono text-xs pt-2">{String(idx + 1).padStart(2, '0')}</div>
                  {count > 0 ? (
                    <div className="flex flex-col items-end leading-none">
                      <div className="font-display text-4xl tabular-nums text-lime-400">{count}</div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-[0.25em] mt-1">
                        {count === 1 ? 'session' : 'sessions'}
                      </div>
                    </div>
                  ) : (
                    <Icon className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
                  )}
                </div>
                <h2 className="font-display text-3xl leading-tight mb-1">{w.name.toUpperCase()}</h2>
                <p className="text-zinc-400 text-sm mb-4">{w.subtitle}</p>
                <div className="flex items-center gap-5 text-xs flex-wrap">
                  <div className="text-zinc-400">
                    <span className="font-mono text-white">{w.exercises.length}</span> exercises
                  </div>
                  <div className="text-zinc-400">
                    <span className="font-mono text-white">~{minutes}</span> min
                  </div>
                  <div className="text-zinc-400 flex items-center gap-1.5">
                    {count > 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-400" />}
                    <span>{count > 0 ? formatRelative(lastDate) : 'Not started'}</span>
                  </div>
                </div>
              </button>
              <div className="border-t border-zinc-800 grid grid-cols-[1fr_2fr]">
                <button onClick={() => onEdit(w.id)} className="py-3.5 text-xs text-zinc-400 uppercase tracking-[0.2em] active:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => onStart(w.id)} className="py-3.5 text-xs uppercase tracking-[0.2em] bg-lime-400 text-black font-bold active:bg-lime-500 transition-colors flex items-center justify-center gap-2">
                  Start <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => { if (window.confirm('Reset all workouts to defaults? This erases your edits and weights (history is kept).')) onResetAll(); }}
          className="text-zinc-600 text-xs uppercase tracking-[0.25em] active:text-zinc-400"
        >
          Reset workouts
        </button>
      </div>
    </div>
  );
}

function Workout({ workout, sessions, onUpdate, onComplete, onExit }) {
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState('working');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStart] = useState(() => Date.now());
  const [currentReps, setCurrentReps] = useState(0);
  const [loggedSets, setLoggedSets] = useState([]);
  const phaseRef = useRef(phase);
  const completedRef = useRef(false);
  phaseRef.current = phase;

  const exercise = workout.exercises[exIdx];
  const isTimed = !!exercise?.durationSeconds;
  const isLastSet = exercise ? setIdx >= exercise.sets - 1 : false;
  const isLastExercise = exIdx >= workout.exercises.length - 1;

  useEffect(() => {
    let lock = null;
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(l => { lock = l; }).catch(() => {});
    }
    return () => { try { lock?.release(); } catch (e) {} };
  }, []);

  useEffect(() => {
    if (phase !== 'working' || !exercise) return;
    if (isTimed) {
      setTimeLeft(exercise.durationSeconds);
      setTimerRunning(false);
    } else {
      const lastSet = getLastSetForExercise(sessions, exercise.id, setIdx + 1);
      const target = parseRepsTarget(exercise.reps);
      setCurrentReps(lastSet?.reps ?? target ?? 0);
    }
  }, [phase, exIdx, setIdx, isTimed, exercise?.id, exercise?.durationSeconds, exercise?.reps, sessions]);

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      beep(880); buzz([180, 80, 180]);
      handleTimerEnd();
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    if (phase === 'done' && !completedRef.current) {
      completedRef.current = true;
      onComplete({
        id: 'session_' + sessionStart,
        workoutId: workout.id,
        workoutName: workout.name,
        startedAt: sessionStart,
        completedAt: Date.now(),
        sets: loggedSets,
      });
    }
  }, [phase, loggedSets, onComplete, sessionStart, workout.id, workout.name]);

  function handleTimerEnd() {
    if (phaseRef.current === 'working' && isTimed) {
      completeSet(exercise.durationSeconds);
    } else if (phaseRef.current === 'resting') {
      advanceFromRest();
    }
  }

  function completeSet(actualSec = null) {
    const setLog = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      setNum: setIdx + 1,
      reps: isTimed ? null : currentReps,
      weight: exercise.weight || 0,
      durationSeconds: isTimed ? (actualSec !== null ? actualSec : (exercise.durationSeconds - timeLeft)) : null,
    };
    setLoggedSets(prev => [...prev, setLog]);

    if (isLastExercise && isLastSet) {
      setPhase('done'); return;
    }
    if (exercise.restSeconds > 0) {
      setTimeLeft(exercise.restSeconds);
      setTimerRunning(true);
      setPhase('resting');
    } else {
      advanceFromRest();
    }
  }

  function advanceFromRest() {
    setTimerRunning(false);
    if (isLastSet) {
      setExIdx(i => i + 1);
      setSetIdx(0);
    } else {
      setSetIdx(i => i + 1);
    }
    setPhase('working');
  }

  function skipRest() { setTimerRunning(false); advanceFromRest(); }
  function adjustRest(delta) { setTimeLeft(t => Math.max(0, t + delta)); }
  function adjustWeight(delta) {
    onUpdate(w => ({
      ...w,
      exercises: w.exercises.map(e => e.id === exercise.id ? { ...e, weight: Math.max(0, +(e.weight + delta).toFixed(2)) } : e)
    }));
  }
  function adjustReps(delta) { setCurrentReps(r => Math.max(0, r + delta)); }
  function skipExercise() {
    if (isLastExercise) { setPhase('done'); return; }
    setExIdx(i => i + 1); setSetIdx(0); setPhase('working'); setTimerRunning(false);
  }

  if (phase === 'done') {
    return <CompleteView
      workout={workout}
      elapsedMin={Math.max(1, Math.round((Date.now() - sessionStart) / 60000))}
      loggedSets={loggedSets}
      onExit={onExit}
    />;
  }

  const lastPerf = getLastPerformance(sessions, exercise.id);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <button onClick={() => { if (window.confirm('Quit workout? This session won\'t be saved.')) onExit(); }} className="p-2 -ml-2 text-zinc-400 active:text-white">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">{workout.name}</div>
        </div>
        <button onClick={() => { if (window.confirm('Skip this exercise?')) skipExercise(); }} className="p-2 -mr-2 text-zinc-500 active:text-white text-xs uppercase tracking-widest">
          Skip
        </button>
      </div>

      <div className="px-5 mb-6">
        <div className="flex gap-1">
          {workout.exercises.map((ex, i) => {
            const fill = i < exIdx ? 100 : i === exIdx ? ((setIdx + (phase === 'resting' ? 1 : 0)) / ex.sets) * 100 : 0;
            return (
              <div key={ex.id} className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-lime-400 transition-all duration-300" style={{ width: `${fill}%` }} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono tracking-wider">
          <span>EX {String(exIdx + 1).padStart(2, '0')}/{String(workout.exercises.length).padStart(2, '0')}</span>
          <span>SET {setIdx + 1}/{exercise.sets}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5">
        {phase === 'working' ? (
          <WorkingView
            exercise={exercise}
            isTimed={isTimed}
            timeLeft={timeLeft}
            timerRunning={timerRunning}
            currentReps={currentReps}
            lastPerf={lastPerf}
            onStart={() => setTimerRunning(true)}
            onDone={() => completeSet()}
            onAdjustWeight={adjustWeight}
            onAdjustReps={adjustReps}
          />
        ) : (
          <RestingView
            timeLeft={timeLeft}
            totalRest={exercise.restSeconds}
            currentExercise={exercise}
            nextExercise={isLastSet ? workout.exercises[exIdx + 1] : null}
            nextSetNum={isLastSet ? 1 : setIdx + 2}
            isLastSet={isLastSet}
            onSkip={skipRest}
            onAdjust={adjustRest}
          />
        )}
      </div>
    </div>
  );
}

function WorkingView({ exercise, isTimed, timeLeft, timerRunning, currentReps, lastPerf, onStart, onDone, onAdjustWeight, onAdjustReps }) {
  const lastSummary = lastPerf ? (
    isTimed
      ? `Last: ${lastPerf.durations.map(d => `${d}s`).join(' · ')}`
      : `Last: ${lastPerf.reps.join('·')}${lastPerf.weight > 0 ? ` @ ${lastPerf.weight}kg` : ''}`
  ) : null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-3">Now</div>
        <h2 className="font-display text-4xl sm:text-5xl leading-[0.95] max-w-xs">{exercise.name.toUpperCase()}</h2>
        {lastSummary && (
          <div className="mt-3 text-[11px] text-zinc-500 font-mono">{lastSummary}</div>
        )}

        <div className="mt-10">
          {isTimed ? (
            <div>
              <div
                className="font-mono text-[5.5rem] font-bold tabular-nums leading-none"
                style={{ color: timerRunning ? '#a3e635' : 'white' }}
              >
                {fmtTime(timeLeft)}
              </div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-2">
                {timerRunning ? 'GO' : 'READY'} · TARGET {fmtTime(exercise.durationSeconds)}
              </div>
            </div>
          ) : (
            <div>
              <div className="font-display text-[6.5rem] text-lime-400 leading-none tabular-nums">{currentReps}</div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-2">
                REPS · TARGET {exercise.reps || '–'}
              </div>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button onClick={() => onAdjustReps(-1)} className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-sm active:bg-zinc-800">
                  −1
                </button>
                <button onClick={() => onAdjustReps(+1)} className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-sm active:bg-zinc-800">
                  +1
                </button>
              </div>
            </div>
          )}
        </div>

        {!isTimed && (
          <div className="mt-8 flex items-center gap-5">
            <button onClick={() => onAdjustWeight(-2.5)} className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center active:bg-zinc-800">
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-center min-w-[120px]">
              <div className="font-mono text-3xl tabular-nums leading-none">{exercise.weight > 0 ? exercise.weight : '–'}</div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-1">kg / side</div>
            </div>
            <button onClick={() => onAdjustWeight(2.5)} className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center active:bg-zinc-800">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="pb-8 pt-4">
        {isTimed ? (
          !timerRunning ? (
            <button onClick={onStart} className="w-full bg-lime-400 text-black py-5 rounded-2xl font-bold text-base uppercase tracking-[0.2em] active:bg-lime-500 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" fill="currentColor" /> Start
            </button>
          ) : (
            <button onClick={onDone} className="w-full bg-zinc-900 border-2 border-lime-400 text-lime-400 py-5 rounded-2xl font-bold text-base uppercase tracking-[0.2em] active:bg-zinc-800">
              Done Early
            </button>
          )
        ) : (
          <button onClick={onDone} className="w-full bg-lime-400 text-black py-5 rounded-2xl font-bold text-base uppercase tracking-[0.2em] active:bg-lime-500 flex items-center justify-center gap-2">
            <Check className="w-5 h-5" strokeWidth={3} /> Log Set
          </button>
        )}
      </div>
    </div>
  );
}

function RestingView({ timeLeft, totalRest, currentExercise, nextExercise, nextSetNum, isLastSet, onSkip, onAdjust }) {
  const progress = totalRest > 0 ? 1 - (timeLeft / totalRest) : 1;
  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const next = isLastSet && nextExercise ? nextExercise : currentExercise;
  const nextDesc = isLastSet && nextExercise
    ? `Set 1 of ${nextExercise.sets} · ${nextExercise.durationSeconds ? fmtTime(nextExercise.durationSeconds) : (nextExercise.reps + ' reps')}`
    : `Set ${nextSetNum} of ${currentExercise.sets} · ${currentExercise.reps || fmtTime(currentExercise.durationSeconds || 0)}`;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-6">Rest</div>

        <div className="relative">
          <svg width="252" height="252" className="-rotate-90">
            <circle cx="126" cy="126" r={radius} stroke="#27272a" strokeWidth="6" fill="none" />
            <circle
              cx="126" cy="126" r={radius}
              stroke="#a3e635" strokeWidth="6" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-6xl font-bold tabular-nums leading-none">{fmtTime(timeLeft)}</div>
          </div>
        </div>

        <div className="mt-10 text-center px-4">
          <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-1.5">Up Next</div>
          <div className="font-display text-2xl leading-tight">{next.name.toUpperCase()}</div>
          <div className="text-zinc-400 text-sm mt-1.5">
            {nextDesc}{next.weight > 0 ? ` @ ${next.weight}kg` : ''}
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4 grid grid-cols-[1fr_2fr_1fr] gap-2.5">
        <button onClick={() => onAdjust(-15)} className="bg-zinc-900 border border-zinc-800 py-4 rounded-2xl text-sm font-mono active:bg-zinc-800">
          −15s
        </button>
        <button onClick={onSkip} className="bg-lime-400 text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] active:bg-lime-500 flex items-center justify-center gap-2">
          <SkipForward className="w-4 h-4" /> Skip Rest
        </button>
        <button onClick={() => onAdjust(15)} className="bg-zinc-900 border border-zinc-800 py-4 rounded-2xl text-sm font-mono active:bg-zinc-800">
          +15s
        </button>
      </div>
    </div>
  );
}

function CompleteView({ workout, elapsedMin, loggedSets, onExit }) {
  const byExercise = [];
  for (const set of loggedSets) {
    let bucket = byExercise.find(b => b.exerciseId === set.exerciseId);
    if (!bucket) {
      bucket = { exerciseId: set.exerciseId, name: set.exerciseName, sets: [] };
      byExercise.push(bucket);
    }
    bucket.sets.push(set);
  }
  const totalReps = loggedSets.reduce((sum, s) => sum + (s.reps || 0), 0);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col px-5 pt-12 pb-8">
      <div className="flex flex-col items-center text-center mb-8 pt-4">
        <div className="w-20 h-20 rounded-full bg-lime-400 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-black" strokeWidth={3} />
        </div>
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-2">Workout complete</div>
        <h1 className="font-display text-6xl leading-none">DONE</h1>
        <div className="text-zinc-400 mt-3 text-sm">{workout.name}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <Stat label="Time" value={elapsedMin} unit="min" />
        <Stat label="Sets" value={loggedSets.length} />
        <Stat label="Reps" value={totalReps || '–'} />
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-3">Summary</div>
        <div className="space-y-2">
          {byExercise.map(b => (
            <div key={b.exerciseId} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5">
              <div className="font-display text-sm uppercase tracking-wide mb-1">{b.name}</div>
              <div className="font-mono text-xs text-zinc-400">
                {b.sets.map((s, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-zinc-600"> · </span>}
                    {s.durationSeconds != null ? `${s.durationSeconds}s` : `${s.reps}r`}
                  </span>
                ))}
                {b.sets[0].weight > 0 && <span className="text-zinc-500"> @ {b.sets[0].weight}kg</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onExit} className="w-full bg-lime-400 text-black py-5 rounded-2xl font-bold text-base uppercase tracking-[0.2em] active:bg-lime-500">
        Back home
      </button>
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] mb-1">{label}</div>
      <div className="font-mono text-2xl tabular-nums">
        {value}{unit && <span className="text-xs text-zinc-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function HistoryView({ sessions, onBack, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  const totalTime = sessions.reduce((sum, s) => sum + Math.max(0, (s.completedAt - s.startedAt)), 0);
  const totalMin = Math.round(totalTime / 60000);
  const totalSets = sessions.reduce((sum, s) => sum + s.sets.length, 0);

  return (
    <div className="max-w-md mx-auto min-h-screen pb-12">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-zinc-950/95 z-10" style={{ backdropFilter: 'blur(8px)' }}>
        <button onClick={onBack} className="text-zinc-400 active:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display text-lg tracking-wider">HISTORY</h1>
        <div className="w-7" />
      </div>

      {sessions.length === 0 ? (
        <div className="px-5 pt-24 text-center">
          <div className="font-display text-4xl text-zinc-700 mb-3">NO SESSIONS</div>
          <p className="text-zinc-500 text-sm">Complete a workout to start tracking your progress.</p>
        </div>
      ) : (
        <>
          <div className="px-5 pt-6 grid grid-cols-3 gap-2 mb-6">
            <Stat label="Sessions" value={sessions.length} />
            <Stat label="Total" value={totalMin} unit="min" />
            <Stat label="Sets" value={totalSets} />
          </div>

          <div className="px-5 space-y-2">
            {sessions.map(s => (
              <SessionCard
                key={s.id}
                session={s}
                expanded={expanded === s.id}
                onToggle={() => setExpanded(e => e === s.id ? null : s.id)}
                onDelete={() => { if (window.confirm('Delete this session?')) onDelete(s.id); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SessionCard({ session, expanded, onToggle, onDelete }) {
  const durMin = Math.max(1, Math.round((session.completedAt - session.startedAt) / 60000));

  const byExercise = [];
  for (const set of session.sets) {
    let bucket = byExercise.find(b => b.exerciseId === set.exerciseId);
    if (!bucket) {
      bucket = { exerciseId: set.exerciseId, name: set.exerciseName, sets: [] };
      byExercise.push(bucket);
    }
    bucket.sets.push(set);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 text-left active:bg-zinc-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] mb-1 font-mono">
              {formatFullDate(session.completedAt)}
            </div>
            <div className="font-display text-xl uppercase tracking-wide leading-tight">{session.workoutName}</div>
            <div className="text-zinc-400 text-xs mt-1.5 font-mono">
              {durMin} min · {session.sets.length} sets
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform flex-shrink-0 mt-1 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 p-4 space-y-2.5">
          {byExercise.map(b => (
            <div key={b.exerciseId} className="flex items-baseline justify-between gap-3">
              <div className="font-display text-sm uppercase tracking-wide text-zinc-300 truncate flex-1">{b.name}</div>
              <div className="font-mono text-xs text-zinc-400 text-right flex-shrink-0">
                {b.sets.map((s, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-zinc-600"> · </span>}
                    {s.durationSeconds != null ? `${s.durationSeconds}s` : `${s.reps}r`}
                  </span>
                ))}
                {b.sets[0].weight > 0 && <span className="text-zinc-500"> @ {b.sets[0].weight}kg</span>}
              </div>
            </div>
          ))}
          <button onClick={onDelete} className="w-full mt-3 py-2.5 text-zinc-600 active:text-red-400 text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 border-t border-zinc-800 pt-3">
            <Trash2 className="w-3.5 h-3.5" /> Delete session
          </button>
        </div>
      )}
    </div>
  );
}

function EditView({ workout, onUpdate, onDone, onResetThis }) {
  const updateEx = (exId, updater) => onUpdate(w => ({ ...w, exercises: w.exercises.map(e => e.id === exId ? updater(e) : e) }));
  const deleteEx = (exId) => onUpdate(w => ({ ...w, exercises: w.exercises.filter(e => e.id !== exId) }));
  const addEx = () => {
    const newEx = { id: 'ex_' + Date.now(), name: 'New Exercise', sets: 3, reps: '10', weight: 0, restSeconds: 60 };
    onUpdate(w => ({ ...w, exercises: [...w.exercises, newEx] }));
  };
  const moveEx = (idx, dir) => {
    onUpdate(w => {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= w.exercises.length) return w;
      const arr = [...w.exercises];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...w, exercises: arr };
    });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-zinc-950/95 z-10" style={{ backdropFilter: 'blur(8px)' }}>
        <button onClick={onDone} className="text-zinc-400 active:text-white p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display text-lg tracking-wider">EDIT</h1>
        <button onClick={onDone} className="text-lime-400 font-bold text-xs uppercase tracking-[0.2em]">Done</button>
      </div>

      <div className="px-5 pt-2">
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-1 mt-4">Program</div>
        <input
          type="text"
          value={workout.name}
          onChange={(e) => onUpdate(w => ({ ...w, name: e.target.value }))}
          className="w-full bg-transparent font-display text-3xl focus:outline-none mb-1"
        />
        <input
          type="text"
          value={workout.subtitle || ''}
          onChange={(e) => onUpdate(w => ({ ...w, subtitle: e.target.value }))}
          placeholder="Subtitle"
          className="w-full bg-transparent text-zinc-400 text-sm focus:outline-none mb-6"
        />
      </div>

      <div className="px-5 space-y-3">
        {workout.exercises.map((ex, idx) => (
          <ExerciseEditCard
            key={ex.id}
            exercise={ex}
            idx={idx}
            total={workout.exercises.length}
            onUpdate={(u) => updateEx(ex.id, u)}
            onDelete={() => { if (window.confirm(`Delete "${ex.name}"?`)) deleteEx(ex.id); }}
            onMove={(dir) => moveEx(idx, dir)}
          />
        ))}

        <button onClick={addEx} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-400 active:border-zinc-600 active:text-white flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]">
          <Plus className="w-4 h-4" /> Add Exercise
        </button>

        <button
          onClick={() => { if (window.confirm('Reset this workout to default?')) onResetThis(); }}
          className="w-full py-3 text-zinc-600 text-[10px] uppercase tracking-[0.3em] active:text-zinc-400"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}

function ExerciseEditCard({ exercise, idx, total, onUpdate, onDelete, onMove }) {
  const isTimed = !!exercise.durationSeconds;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-zinc-500 font-mono text-xs pt-2.5">{String(idx + 1).padStart(2, '0')}</div>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onUpdate(ex => ({ ...ex, name: e.target.value }))}
          className="flex-1 bg-transparent font-display text-lg uppercase tracking-wide focus:outline-none focus:bg-zinc-800 rounded px-2 -mx-2 py-1"
        />
        <button onClick={onDelete} className="text-zinc-600 active:text-red-400 p-1.5">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumberField label="Sets" value={exercise.sets} onChange={(v) => onUpdate(ex => ({ ...ex, sets: Math.max(1, Math.round(v)) }))} />
        {isTimed
          ? <NumberField label="Duration (s)" value={exercise.durationSeconds} onChange={(v) => onUpdate(ex => ({ ...ex, durationSeconds: Math.max(1, Math.round(v)) }))} />
          : <TextField label="Reps" value={exercise.reps} onChange={(v) => onUpdate(ex => ({ ...ex, reps: v }))} placeholder="e.g. 8-10" />
        }
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Weight (kg)" value={exercise.weight} onChange={(v) => onUpdate(ex => ({ ...ex, weight: Math.max(0, v) }))} step={2.5} />
        <NumberField label="Rest (s)" value={exercise.restSeconds} onChange={(v) => onUpdate(ex => ({ ...ex, restSeconds: Math.max(0, Math.round(v)) }))} step={5} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => onUpdate(ex => isTimed
            ? { ...ex, durationSeconds: undefined, reps: '10' }
            : { ...ex, durationSeconds: 30, reps: '' })}
          className="text-[10px] text-zinc-500 active:text-lime-400 uppercase tracking-[0.2em]"
        >
          → {isTimed ? 'Switch to reps' : 'Switch to timed'}
        </button>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} disabled={idx === 0} className="text-zinc-500 disabled:opacity-25 p-1.5 active:text-white">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove(1)} disabled={idx === total - 1} className="text-zinc-500 disabled:opacity-25 p-1.5 active:text-white">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, step = 1 }) {
  return (
    <div>
      <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</label>
      <input
        type="number"
        value={value ?? 0}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 font-mono tabular-nums text-white focus:outline-none focus:border-lime-400 text-base"
      />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</label>
      <input
        type="text"
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 font-mono text-white focus:outline-none focus:border-lime-400 text-base placeholder-zinc-600"
      />
    </div>
  );
}
