// How-to notes shown behind the info button on the set screen.
//
// Keyed by exercise NAME rather than id, so the notes still resolve for
// workouts already saved in localStorage and for exercises renamed in the
// in-app editor. Lookup strips anything in parentheses, so
// "Dead Hang (max effort)" and "Dead Hang (easy)" both find 'dead hang'.

const normalize = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const HOW_TO = {
  'dead hang': {
    setup: 'Overhand grip on the bar, hands shoulder-width.',
    steps: [
      'Step off and let your arms go straight.',
      'Shoulders stay active — do not sag into a limp hang.',
      'Squeeze the bar hard, ribs down, legs still.',
      'Drop off before your grip fails, not after.',
    ],
    watch: 'Swinging. Cross your ankles to kill the swing.',
  },
  'feet assisted hang': {
    setup: 'Chair under the bar, toes resting on the seat.',
    steps: [
      'Hang with straight arms, toes taking part of your weight.',
      'Take off just enough weight that 45s is achievable.',
      'Keep the same active shoulders as a full hang.',
      'Each week, press down less with your toes.',
    ],
    watch: 'Standing on the chair. Your arms should still be loaded.',
  },
  'uneven hang': {
    setup: 'One hand overhand on the bar, the other gripping that wrist.',
    steps: [
      'Most of your weight hangs from the hand on the bar.',
      'The wrist hand takes only as much as it must.',
      'Expect a fraction of your normal hang time — that is the point.',
      'Swap sides each set.',
    ],
    watch: 'Doing this before a 30s two-hand hang is comfortable. It is a later step.',
  },
  'scapular pull': {
    setup: 'Dead hang, arms completely straight.',
    steps: [
      'Without bending your elbows, pull your shoulder blades down and back.',
      'Your body rises 2–3 cm. That is the whole rep.',
      'Pause a second at the top, lower under control.',
    ],
    watch: 'Elbow bend. If your arms bend, it became a pull-up attempt.',
  },
  'chair assisted pull up': {
    setup: 'Chair under the bar, feet flat on the seat, hands overhand on the bar.',
    steps: [
      'Push through your legs only as much as you need.',
      'Pull your chest toward the bar, elbows down to your sides.',
      'Chin clears the bar, then lower slowly — 2–3 seconds.',
      'Less leg help each week: both feet, heels, one foot, one toe, none.',
    ],
    watch: 'Legs doing the whole rep. Your arms should be working the entire way.',
  },
  'negative pull up': {
    setup: 'Step off a chair into the top position, chin over the bar.',
    steps: [
      'Start with your chin already above the bar, elbows bent.',
      'Lower as slowly as you can — aim for 5 seconds.',
      'Keep going all the way to straight arms.',
      'Step back up to the top. Never lower from a dead hang.',
    ],
    watch: 'The drop. When the lower turns into a fall, the set is over.',
  },
  'one arm db row': {
    setup: 'One hand and knee on a chair, other foot on the floor, dumbbell hanging.',
    steps: [
      'Flat back, chest facing the floor.',
      'Pull the dumbbell to your hip, elbow tight to your ribs.',
      'Squeeze at the top, then lower for 3 slow seconds.',
      'Finish all reps on one side before switching.',
    ],
    watch: 'Twisting your torso to lift. Shoulders stay square.',
  },
  'hammer curl': {
    setup: 'Standing, dumbbells at your sides, palms facing your thighs.',
    steps: [
      'Curl up keeping palms facing in, like holding a hammer.',
      'Elbows pinned to your sides the whole time.',
      'Lower all the way down under control.',
    ],
    watch: 'Swinging your body. If your hips move, go lighter.',
  },
  'bent over reverse fly': {
    setup: 'Hinge forward at the hips, chest near parallel to the floor, light dumbbells hanging.',
    steps: [
      'Slight bend in the elbows, then hold it.',
      'Raise both arms out to the sides like opening wings.',
      'Stop level with your shoulders, squeeze, lower slowly.',
    ],
    watch: 'Too much weight. This one should feel almost embarrassingly light.',
  },
  'push up': {
    setup: 'Hands under your shoulders, body in one straight line.',
    steps: [
      'Squeeze glutes and brace your stomach before you start.',
      'Lower until your chest is a fist off the floor.',
      'Elbows back at about 45°, not flared straight out.',
      'Press up without letting your hips sag or pike.',
    ],
    watch: 'Hips leading the way up. Move as one plank.',
  },
  'db floor press': {
    setup: 'Lie on your back on the floor, knees bent, dumbbells at chest height.',
    steps: [
      'Press both dumbbells straight up over your chest.',
      'Lower for 3 slow seconds until your upper arms touch the floor.',
      'Pause on the floor for a beat, then press again.',
    ],
    watch: 'Bouncing your elbows off the floor. Pause instead.',
  },
  'seated db overhead press': {
    setup: 'Sit upright on a chair, dumbbells at shoulder height, palms forward.',
    steps: [
      'Brace your stomach so you do not arch your lower back.',
      'Press straight overhead until your arms lock out.',
      'Lower under control back to your shoulders.',
    ],
    watch: 'Leaning back. If you have to arch, the weight is too heavy.',
  },
  'db lateral raise': {
    setup: 'Standing, light dumbbells at your sides, tiny bend in the elbows.',
    steps: [
      'Raise your arms out to the sides, leading with your elbows.',
      'Stop at shoulder height — no higher.',
      'Lower slowly, taking twice as long as the lift.',
    ],
    watch: 'Shrugging. Keep your shoulders down and away from your ears.',
  },
  'chair dip': {
    setup: 'Hands on the edge of a chair behind you, legs out front, chair against a wall.',
    steps: [
      'Fingers point forward, arms straight, hips just off the chair.',
      'Bend your elbows straight back and lower your hips.',
      'Stop when your upper arms are parallel to the floor.',
      'Press back up through your palms.',
    ],
    watch: 'Shoulders rolling forward. Chest stays proud — stop higher if it hurts.',
  },
  'overhead tricep extension': {
    setup: 'Both hands cupping one dumbbell, arms straight overhead.',
    steps: [
      'Keep your elbows pointing forward and close together.',
      'Lower the dumbbell behind your head by bending only the elbows.',
      'Stretch at the bottom, then straighten your arms.',
    ],
    watch: 'Elbows flaring out sideways. Upper arms stay still.',
  },
  'db pullover': {
    setup: 'Lie on the floor, both hands cupping one dumbbell over your chest.',
    steps: [
      'Arms nearly straight, small soft bend at the elbow.',
      'Lower the dumbbell back past your head toward the floor.',
      'Stop where you feel the stretch under your armpits.',
      'Pull it back over your chest with your lats, not your arms.',
    ],
    watch: 'Ribs flaring up. Keep your lower back flat on the floor.',
  },
  'goblet squat': {
    setup: 'Hold one dumbbell vertically against your chest, feet shoulder-width.',
    steps: [
      'Elbows tucked in, chest tall.',
      'Sit down for 3 slow seconds, knees tracking over your toes.',
      'Pause 2 seconds at the bottom, dead still.',
      'Drive up through your midfoot.',
    ],
    watch: 'Heels lifting. Point your toes out slightly if they do.',
  },
  'bulgarian split squat': {
    setup: 'Rear foot up on a chair, front foot about a stride ahead, dumbbells at your sides.',
    steps: [
      'Almost all your weight is on the front leg.',
      'Drop straight down until your back knee is near the floor.',
      'Front shin stays fairly upright, torso slightly forward.',
      'Drive up through the front heel. All reps on one leg, then swap.',
    ],
    watch: 'Front foot too close to the chair. Step it further forward.',
  },
  'single leg db rdl': {
    setup: 'One dumbbell in the hand opposite the standing leg.',
    steps: [
      'Soft bend in the standing knee, then keep that angle.',
      'Hinge at the hip, back leg extending behind you as a counterweight.',
      'Lower until you feel the hamstring stretch, back flat.',
      'Squeeze your glute to stand back up.',
    ],
    watch: 'Rounding your back. Balance first, weight second.',
  },
  'single leg hip thrust': {
    setup: 'Shoulders on the floor or a chair edge, one foot planted, other knee tucked to your chest.',
    steps: [
      'Planted heel close to your backside.',
      'Drive through that heel and lift your hips.',
      'Squeeze the glute hard at the top, hips level.',
      'Lower slowly without resting at the bottom.',
    ],
    watch: 'Arching your lower back to get higher. Tuck your ribs down.',
  },
  'single leg calf raise': {
    setup: 'One dumbbell in one hand, other hand on a wall for balance, one foot planted.',
    steps: [
      'Rise as high onto the ball of your foot as you can.',
      'Pause 2 full seconds at the top.',
      'Lower all the way down until you feel the stretch.',
    ],
    watch: 'Bouncing. Slow all the way through both directions.',
  },
  'bodyweight squat': {
    setup: 'Feet shoulder-width, arms out in front for balance.',
    steps: [
      'Sit back and down, chest up.',
      'Go as deep as you can with your heels down.',
      'Stand up fully and squeeze your glutes at the top.',
    ],
    watch: 'Knees caving inward. Push them out over your toes.',
  },
  'dead bug': {
    setup: 'On your back, arms pointing at the ceiling, knees bent over your hips.',
    steps: [
      'Press your lower back flat into the floor and hold it there.',
      'Lower one arm overhead and the opposite leg toward the floor.',
      'Stop before your back lifts, return to the start.',
      'Alternate sides. Breathe out as you extend.',
    ],
    watch: 'Lower back arching off the floor. Shorten the range instead.',
  },
  'side plank': {
    setup: 'On your side, elbow under your shoulder, feet stacked or staggered.',
    steps: [
      'Lift your hips until head, hips and heels are in one line.',
      'Push the floor away with your elbow.',
      'Hold, breathing normally. Then swap sides.',
    ],
    watch: 'Hips drifting down. Drop the hold time before you drop your form.',
  },
  'db thruster': {
    setup: 'Dumbbells at shoulder height, feet shoulder-width.',
    steps: [
      'Squat down keeping the dumbbells on your shoulders.',
      'Drive up hard out of the bottom.',
      'Use that momentum to press the dumbbells overhead in one motion.',
      'Bring them back to your shoulders and go again.',
    ],
    watch: 'Two separate movements. Squat and press should flow as one.',
  },
  'db suitcase carry march': {
    setup: 'One dumbbell in one hand, arm straight down, standing tall.',
    steps: [
      'Brace hard so you do not lean toward the weight.',
      'March in place, lifting each knee to hip height.',
      'Stay perfectly upright the whole time.',
      'Swap hands each set.',
    ],
    watch: 'Tipping sideways. Stand as if a wall runs down your loaded side.',
  },
  'jump rope': {
    setup: 'Rope handles at hip height, elbows close to your sides.',
    steps: [
      'Turn the rope with your wrists, not your arms.',
      'Small jumps — a couple of centimetres is enough.',
      'Land on the balls of your feet, knees soft.',
      'Trip? Pick it up and keep going. The clock does not stop.',
    ],
    watch: 'Jumping too high. It burns your calves out early.',
  },
};

// Aliases so the rope variants all resolve to the same note.
HOW_TO['jump rope warmup'] = HOW_TO['jump rope'];
HOW_TO['jump rope interval'] = HOW_TO['jump rope'];
HOW_TO['jump rope cooldown'] = HOW_TO['jump rope'];
HOW_TO['jump rope finisher'] = HOW_TO['jump rope'];

export const getHowTo = (name) => HOW_TO[normalize(name)] || null;
