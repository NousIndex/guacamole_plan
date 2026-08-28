// Default workout programs.
// Edit this file to add, remove, or reconfigure workouts.
//
// Tuned for: 2 adjustable dumbbells (10 kg max each), doorway pull-up bar, jump rope.
// Lifter: 66 kg, 165 cm.
// Baseline: 0 pull-ups, ~6s dead hang, 10 push-ups, 5 x 1min rope,
//           10 min farmer hold @ 5.5 kg/hand.
//
// Weights below are STARTING points in kg per dumbbell. With a 20 kg total
// ceiling, progression comes mostly from tempo, pauses, and unilateral
// variations rather than load — see PLAN.md.
//
// Schema:
//   id              string   unique workout id
//   name            string   display name
//   subtitle        string   short description
//   icon            string   one of: 'dumbbell' | 'activity' | 'heart' | 'zap'
//   exercises       array of:
//     id              string   unique exercise id
//     name            string   display name
//     sets            number   number of sets
//     reps            string   e.g. '8-10', '10/side', or '' for timed exercises
//     weight          number   default kg/side (0 = bodyweight / not set)
//     restSeconds     number   rest between sets
//     durationSeconds number   (optional) if set, exercise is timed instead of rep-based

export const DEFAULT_WORKOUTS = [
  {
    id: 'pull', name: 'Upper A — Pull', subtitle: 'Pull-up build, back, biceps', icon: 'dumbbell',
    exercises: [
      { id: 'p3', name: 'Scapular Pull (hang, shrug down)',  sets: 3, reps: '5',         weight: 0,   restSeconds: 60 },
      { id: 'p1', name: 'Dead Hang (max effort)',            sets: 3, reps: '',          weight: 0,   restSeconds: 90, durationSeconds: 15 },
      { id: 'p9', name: 'Chair-Assisted Pull-Up',            sets: 3, reps: '6-8',       weight: 0,   restSeconds: 90 },
      { id: 'p4', name: 'Negative Pull-Up (5s lower)',       sets: 3, reps: '3',         weight: 0,   restSeconds: 90 },
      { id: 'p6', name: 'One-Arm DB Row (3s lower)',         sets: 4, reps: '10/side',   weight: 10,  restSeconds: 60 },
      { id: 'p7', name: 'Hammer Curl',                       sets: 3, reps: '12',        weight: 7.5, restSeconds: 45 },
      { id: 'p8', name: 'Bent-Over Reverse Fly',             sets: 2, reps: '15',        weight: 4,   restSeconds: 45 },
      { id: 'p2', name: 'Feet-Assisted Hang (finisher)',     sets: 3, reps: '',          weight: 0,   restSeconds: 60, durationSeconds: 45 },
    ]
  },
  {
    id: 'lower', name: 'Lower + Core', subtitle: 'Single-leg + tempo (light DBs)', icon: 'dumbbell',
    exercises: [
      { id: 'l1', name: 'Bulgarian Split Squat',           sets: 3, reps: '10/leg',  weight: 7.5, restSeconds: 90 },
      { id: 'l2', name: 'Goblet Squat (3s down, 2s pause)',sets: 3, reps: '12',      weight: 10,  restSeconds: 90 },
      { id: 'l3', name: 'Single-Leg DB RDL',               sets: 3, reps: '10/leg',  weight: 10,  restSeconds: 75 },
      { id: 'l4', name: 'Single-Leg Hip Thrust (floor)',   sets: 3, reps: '12/leg',  weight: 0,   restSeconds: 60 },
      { id: 'l5', name: 'Single-Leg Calf Raise (2s pause)',sets: 3, reps: '15/leg',  weight: 10,  restSeconds: 45 },
      { id: 'l6', name: 'Dead Bug',                        sets: 3, reps: '10/side', weight: 0,   restSeconds: 30 },
      { id: 'l7', name: 'Side Plank (each side)',          sets: 2, reps: '',        weight: 0,   restSeconds: 30, durationSeconds: 25 },
    ]
  },
  {
    id: 'push', name: 'Upper B — Push', subtitle: 'Push-ups lead, DBs assist', icon: 'dumbbell',
    exercises: [
      { id: 'h1', name: 'Push-Up (submax, crisp reps)',  sets: 5, reps: '6',     weight: 0,   restSeconds: 60 },
      { id: 'h2', name: 'DB Floor Press (3s down)',      sets: 4, reps: '12',    weight: 10,  restSeconds: 75 },
      { id: 'h3', name: 'Seated DB Overhead Press',      sets: 4, reps: '8-10',  weight: 7.5, restSeconds: 90 },
      { id: 'h4', name: 'DB Lateral Raise',              sets: 3, reps: '15',    weight: 4,   restSeconds: 45 },
      { id: 'h5', name: 'Chair Dip (feet out front)',    sets: 3, reps: '10',    weight: 0,   restSeconds: 60 },
      { id: 'h6', name: 'Overhead Tricep Extension',     sets: 3, reps: '12',    weight: 7.5, restSeconds: 45 },
      { id: 'h7', name: 'DB Pullover (floor)',           sets: 3, reps: '12',    weight: 10,  restSeconds: 60 },
    ]
  },
  {
    id: 'cond', name: 'Conditioning', subtitle: 'Rope intervals + full-body finisher', icon: 'zap',
    exercises: [
      { id: 'c1', name: 'Jump Rope Warmup (easy pace)', sets: 2, reps: '',  weight: 0,   restSeconds: 60, durationSeconds: 60 },
      { id: 'c2', name: 'Jump Rope Interval',           sets: 6, reps: '',  weight: 0,   restSeconds: 45, durationSeconds: 60 },
      { id: 'c3', name: 'DB Thruster',                  sets: 3, reps: '10',weight: 7.5, restSeconds: 60 },
      { id: 'c4', name: 'DB Suitcase Carry March',      sets: 3, reps: '',  weight: 10,  restSeconds: 45, durationSeconds: 40 },
      { id: 'c5', name: 'Jump Rope Cooldown',           sets: 2, reps: '',  weight: 0,   restSeconds: 45, durationSeconds: 60 },
    ]
  },
  {
    id: 'daily', name: 'Daily Practice', subtitle: '12 min — skill, never to failure', icon: 'activity',
    exercises: [
      { id: 'd3', name: 'Scapular Pull',              sets: 3, reps: '5',  weight: 0, restSeconds: 45 },
      { id: 'd1', name: 'Dead Hang (~70% of max)',    sets: 3, reps: '',   weight: 0, restSeconds: 60, durationSeconds: 4 },
      { id: 'd2', name: 'Feet-Assisted Hang (easy)',  sets: 2, reps: '',   weight: 0, restSeconds: 60, durationSeconds: 30 },
      { id: 'd4', name: 'Push-Up (half your max)',    sets: 4, reps: '5',  weight: 0, restSeconds: 60 },
      { id: 'd5', name: 'Bodyweight Squat',           sets: 2, reps: '15', weight: 0, restSeconds: 45 },
    ]
  },
  {
    id: 'easy', name: 'Easy Cardio', subtitle: 'Active recovery', icon: 'heart',
    exercises: [
      { id: 'e1', name: 'Jump Rope (conversational)', sets: 5, reps: '', weight: 0, restSeconds: 60, durationSeconds: 60 },
      { id: 'e2', name: 'Dead Hang (easy)',           sets: 3, reps: '', weight: 0, restSeconds: 60, durationSeconds: 8 },
    ]
  }
];
