// Default workout programs.
// Edit this file to add, remove, or reconfigure workouts.
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
    id: 'upper', name: 'Upper Strength', subtitle: 'Push, pull, arms', icon: 'dumbbell',
    exercises: [
      { id: 'u1', name: 'DB Bench Press',           sets: 3, reps: '8-10',      weight: 0, restSeconds: 90 },
      { id: 'u2', name: 'One-Arm DB Row',           sets: 3, reps: '8-10/side', weight: 0, restSeconds: 60 },
      { id: 'u3', name: 'Seated DB Overhead Press', sets: 3, reps: '8-10',      weight: 0, restSeconds: 90 },
      { id: 'u4', name: 'Hammer Curl',              sets: 3, reps: '10',        weight: 0, restSeconds: 45 },
      { id: 'u5', name: 'Overhead Tricep Extension',sets: 3, reps: '10',        weight: 0, restSeconds: 45 },
      { id: 'u6', name: 'Bent-Over Reverse Fly',    sets: 2, reps: '12',        weight: 0, restSeconds: 45 },
      { id: 'u7', name: 'Plank',                    sets: 3, reps: '',          weight: 0, restSeconds: 30, durationSeconds: 30 },
    ]
  },
  {
    id: 'cond', name: 'Conditioning', subtitle: 'HIIT + cardio', icon: 'zap',
    exercises: [
      { id: 'c1', name: 'Jump Rope Warmup',   sets: 1, reps: '', weight: 0, restSeconds: 60, durationSeconds: 300 },
      { id: 'c2', name: 'Burpees',            sets: 4, reps: '', weight: 0, restSeconds: 20, durationSeconds: 40 },
      { id: 'c3', name: 'Mountain Climbers',  sets: 4, reps: '', weight: 0, restSeconds: 20, durationSeconds: 40 },
      { id: 'c4', name: 'DB Thrusters',       sets: 4, reps: '', weight: 0, restSeconds: 20, durationSeconds: 40 },
      { id: 'c5', name: 'High Knees',         sets: 4, reps: '', weight: 0, restSeconds: 20, durationSeconds: 40 },
      { id: 'c6', name: 'Jump Rope Finisher', sets: 1, reps: '', weight: 0, restSeconds: 0,  durationSeconds: 300 },
    ]
  },
  {
    id: 'lower', name: 'Lower + Posterior', subtitle: 'Legs, hams, calves', icon: 'dumbbell',
    exercises: [
      { id: 'l1', name: 'Goblet Squat',         sets: 3, reps: '10',      weight: 0, restSeconds: 90 },
      { id: 'l2', name: 'DB Romanian Deadlift', sets: 3, reps: '10',      weight: 0, restSeconds: 90 },
      { id: 'l3', name: 'DB Step-Ups',          sets: 3, reps: '8/leg',   weight: 0, restSeconds: 60 },
      { id: 'l4', name: 'Walking Lunges',       sets: 2, reps: '10/leg',  weight: 0, restSeconds: 60 },
      { id: 'l5', name: 'Standing Calf Raise',  sets: 3, reps: '15',      weight: 0, restSeconds: 45 },
      { id: 'l6', name: 'Dead Bug',             sets: 3, reps: '10/side', weight: 0, restSeconds: 30 },
    ]
  },
  {
    id: 'easy', name: 'Easy Cardio', subtitle: 'Active recovery', icon: 'heart',
    exercises: [
      { id: 'e1', name: 'Jump Rope Intervals', sets: 10, reps: '', weight: 0, restSeconds: 30, durationSeconds: 60 },
    ]
  }
];
