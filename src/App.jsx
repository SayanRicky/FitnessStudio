import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, X, Menu, Play, Pause, ChevronRight, ChevronLeft,
  Dumbbell, Link2, Settings2, PersonStanding, User, Users, Filter,
  BookOpen, Film, Plus, Check, ArrowUpRight, ListChecks,
} from "lucide-react";

/* ============================================================================
   THEME — CSS variables + fonts. Tailwind handles layout/spacing/type-scale;
   custom colors are applied via inline style + these variables.
============================================================================ */
const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
  .fl-root{
    --ink:#111111; --slate:#6B6F73; --on-dark:#B7BCC2; --paper:#FFFFFF; --mist:#F6F6F4;
    --line:#E6E6E3; --pine:#111111; --pine-dark:#2B2B2B; --pine-tint:#F1F1EF; --pine-soft:#C7C7C3;
    --neutral-fill:#ECECEA; --neutral-fill-2:#E1E1DE;
    font-family:'Inter',sans-serif; color:var(--ink); background:#FFFFFF;
  }
  .fl-display{ font-family:'Plus Jakarta Sans',sans-serif; }
  .fl-scroll::-webkit-scrollbar{ display:none; }
  .fl-scroll{ -ms-overflow-style:none; scrollbar-width:none; }
  @keyframes fl-pulse{ 0%,100%{ opacity:1 } 50%{ opacity:.45 } }
  .fl-pulse{ animation: fl-pulse 1.7s ease-in-out infinite; }
  .fl-fade{ animation: fl-fade .18s ease-out; }
  @keyframes fl-fade{ from{ opacity:0; transform:translateY(4px);} to{ opacity:1; transform:translateY(0);} }
  input[type=checkbox].fl-check{ accent-color: var(--pine); }

  .fl-navlink{ cursor:pointer; transition: color .15s ease, opacity .15s ease; }
  .fl-navlink:hover{ color:var(--ink) !important; opacity:1 !important; }
  .fl-link{ cursor:pointer; transition: color .15s ease; }
  .fl-link:hover{ color:var(--ink) !important; }
  .fl-link-invert{ cursor:pointer; transition: opacity .15s ease; }
  .fl-link-invert:hover{ opacity:0.6 !important; }
  .fl-icon-btn{ cursor:pointer; transition: background-color .15s ease, transform .1s ease; }
  .fl-icon-btn:hover{ background-color: rgba(255,255,255,0.12); }
  .fl-icon-btn:active{ transform: scale(0.92); }
  .fl-icon-btn-light{ cursor:pointer; transition: background-color .15s ease, transform .1s ease; }
  .fl-icon-btn-light:hover{ background-color: rgba(10,10,10,0.06); }
  .fl-icon-btn-light:active{ transform: scale(0.92); }
  .fl-btn-primary:hover{ background-color:var(--pine-dark) !important; transform:translateY(-2px); box-shadow:0 10px 22px -8px rgba(0,0,0,0.35); }
  .fl-btn-primary:active{ transform:translateY(0) scale(0.97); box-shadow:0 4px 10px -4px rgba(0,0,0,0.3); }
  .fl-btn-outline:hover{ border-color:var(--ink) !important; color:var(--ink) !important; transform:translateY(-2px); }
  .fl-btn-outline:active{ transform:translateY(0) scale(0.97); }
`;

/* ============================================================================
   OUTLINE ICONS — thin-stroke only, used as subtle background decoration
============================================================================ */
function IconDumbbellOutline(props) {
  return (
    <svg viewBox="0 0 120 60" fill="none" {...props}>
      <rect x="2" y="18" width="14" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18" y="24" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="26" y1="30" x2="94" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <rect x="94" y="24" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="104" y="18" width="14" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconPlateOutline(props) {
  return (
    <svg viewBox="0 0 60 60" fill="none" {...props}>
      <circle cx="30" cy="30" r="27" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconKettlebellOutline(props) {
  return (
    <svg viewBox="0 0 60 70" fill="none" {...props}>
      <path d="M22 18a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="16" width="28" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="45" r="22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconBarbellOutline(props) {
  return (
    <svg viewBox="0 0 140 40" fill="none" {...props}>
      <rect x="2" y="10" width="8" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="14" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18" y1="20" x2="122" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <rect x="122" y="14" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="130" y="10" width="8" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const DECOR_LIGHT = [
  { Icon: IconBarbellOutline, color: "rgba(10,10,10,0.9)", opacity: 0.05, style: { position: "absolute", top: "5%", right: "-3%", width: 200, transform: "rotate(-10deg)" } },
  { Icon: IconPlateOutline, color: "rgba(10,10,10,0.9)", opacity: 0.05, style: { position: "absolute", bottom: "8%", left: "-4%", width: 130 } },
  { Icon: IconKettlebellOutline, color: "rgba(10,10,10,0.9)", opacity: 0.05, style: { position: "absolute", top: "45%", right: "4%", width: 90 } },
];
const DECOR_DARK = [
  { Icon: IconDumbbellOutline, color: "rgba(255,255,255,0.9)", opacity: 0.1, style: { position: "absolute", top: "10%", left: "-5%", width: 170, transform: "rotate(6deg)" } },
  { Icon: IconPlateOutline, color: "rgba(255,255,255,0.9)", opacity: 0.07, style: { position: "absolute", bottom: "-8%", right: "3%", width: 140 } },
];
function BackgroundDecor({ variant = "light" }) {
  const list = variant === "dark" ? DECOR_DARK : DECOR_LIGHT;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      {list.map((d, i) => (
        <div key={i} style={{ ...d.style, opacity: d.opacity, color: d.color }}>
          <d.Icon style={{ width: "100%", height: "auto", display: "block", color: "inherit" }} />
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   DATA MODEL
============================================================================ */
const MUSCLES = [
  { slug: "chest", name: "Chest", short: "Pectoralis major & minor",
    description: "The chest is made up of the pectoralis major and minor — the broad muscles that cover the front of the ribcage.",
    fn: "Drives pressing and hugging motions: pushing your arms forward and across your body." },
  { slug: "back", name: "Back", short: "Lats, traps & rhomboids",
    description: "The back combines the lats, traps and rhomboids — the muscles running from your spine out to your shoulder blades.",
    fn: "Controls pulling motions and keeps your spine and shoulders stacked upright under load." },
  { slug: "shoulders", name: "Shoulders", short: "Anterior, lateral & rear delts",
    description: "The deltoids wrap over the shoulder joint in three sections: front, side and rear.",
    fn: "Lifts and rotates the arm in almost every direction, and stabilises overhead positions." },
  { slug: "arms", name: "Arms", short: "Biceps, triceps & forearms",
    description: "The arms combine the biceps on the front of the upper arm, the triceps on the back, and the forearm muscles below the elbow.",
    fn: "Bends and straightens the elbow, and controls grip strength." },
  { slug: "legs", name: "Legs", short: "Quads, hamstrings, glutes & calves",
    description: "The legs are the largest muscle group in the body, spanning the quadriceps, hamstrings, glutes and calves.",
    fn: "Powers squatting, hinging and walking — the base of almost every athletic movement." },
  { slug: "core", name: "Core", short: "Abdominals & obliques",
    description: "The core includes the rectus abdominis and the obliques that wrap around your midsection.",
    fn: "Braces the spine and transfers force between your upper and lower body." },
];

function ex(id, primaryMuscle, secondaryMuscles, equipment, difficulty, exerciseType, description, instructions, properForm, commonMistakes, trainerTips, relatedExercises) {
  const name = id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
  return { id, slug: id, name, primaryMuscle, secondaryMuscles, equipment, difficulty, exerciseType, description, instructions, properForm, commonMistakes, trainerTips, relatedExercises };
}

const EXERCISES = [
  ex("barbell-bench-press", "chest", ["Triceps", "Front Delts"], "Barbell", "Intermediate", "Compound",
    "The benchmark pressing movement for building raw chest strength and size.",
    ["Lie flat on the bench with your eyes under the bar.", "Grip the bar slightly wider than shoulder width.", "Unrack the bar and lower it to your mid-chest with control.", "Press the bar back up until your arms are fully extended."],
    ["Keep your feet flat on the floor for a stable base.", "Maintain a slight, natural arch in your lower back.", "Keep your wrists stacked directly over your elbows."],
    ["Bouncing the bar off the chest.", "Flaring the elbows out to 90°.", "Losing shoulder blade contact with the bench."],
    "Pause for one second at the chest on your working sets — it removes momentum and builds real strength.",
    ["incline-dumbbell-press", "cable-fly", "chest-dip"]),
  ex("incline-dumbbell-press", "chest", ["Front Delts", "Triceps"], "Dumbbell", "Intermediate", "Compound",
    "Shifts emphasis onto the upper chest by pressing from an inclined bench.",
    ["Set the bench to a 30–45° incline.", "Press the dumbbells up and slightly inward until your arms are extended.", "Lower them slowly until you feel a stretch across the chest.", "Repeat for the full set."],
    ["Keep a slight bend in your elbows at the top.", "Drive your shoulder blades down and back.", "Control the descent — don't let the dumbbells drop."],
    ["Setting the incline too steep, shifting work to the shoulders.", "Letting the dumbbells touch at the top on every rep.", "Arching excessively to move more weight."],
    "If your shoulders take over, drop the incline a notch and check the chest is doing the pressing.",
    ["barbell-bench-press", "cable-fly", "push-up"]),
  ex("cable-fly", "chest", ["Front Delts"], "Cable", "Beginner", "Isolation",
    "An isolation movement that keeps constant tension on the chest through a wide arc.",
    ["Set both pulleys to chest height and grab a handle in each hand.", "Step forward with a slight lean and a soft bend in the elbows.", "Bring your hands together in front of your chest in a hugging motion.", "Return slowly to the start, feeling a stretch."],
    ["Keep the same elbow bend throughout.", "Squeeze your chest at the point your hands meet.", "Move through your shoulder joint, not your elbows."],
    ["Turning it into a press by bending the elbows more.", "Using so much weight the shoulders round forward.", "Rushing the stretch portion."],
    "Think about hugging a tree, not pressing a bar — the motion should stay in an arc.",
    ["barbell-bench-press", "incline-dumbbell-press", "push-up"]),
  ex("push-up", "chest", ["Triceps", "Core"], "Bodyweight", "Beginner", "Compound",
    "A foundational bodyweight press that builds chest, triceps and core strength together.",
    ["Start in a plank with hands slightly wider than your shoulders.", "Brace your core and keep your body in a straight line.", "Lower your chest to just above the floor.", "Press back up to the start."],
    ["Keep your elbows at roughly 45° to your torso.", "Keep your hips level with your shoulders.", "Look slightly ahead, not straight down."],
    ["Letting the hips sag toward the floor.", "Only lowering halfway.", "Flaring the elbows straight out to the sides."],
    "If a full push up is too hard, elevate your hands on a bench and build up from there.",
    ["barbell-bench-press", "cable-fly", "chest-dip"]),
  ex("chest-dip", "chest", ["Triceps", "Front Delts"], "Bodyweight", "Advanced", "Compound",
    "A demanding bodyweight press that overloads the lower chest and triceps.",
    ["Grip the parallel bars and lift to a locked-out arm position.", "Lean your torso forward and bend your knees.", "Lower until your shoulders dip below your elbows.", "Press back up to full extension."],
    ["Keep a forward lean to bias the chest.", "Control the descent — don't drop quickly.", "Keep your shoulders down, away from your ears."],
    ["Staying too upright, shifting work to the triceps only.", "Going so deep the shoulders round and strain.", "Using momentum to bounce out of the bottom."],
    "Add a light band or belt for extra resistance once bodyweight dips feel easy for 12+ reps.",
    ["barbell-bench-press", "push-up", "tricep-pushdown"]),
  ex("pull-up", "back", ["Biceps", "Forearms"], "Bodyweight", "Advanced", "Compound",
    "The classic vertical pull for building a wide, strong back.",
    ["Hang from the bar with hands slightly wider than shoulders.", "Pull your chest up toward the bar, driving your elbows down.", "Pause briefly with your chin above the bar.", "Lower under control to a full hang."],
    ["Start each rep from a dead hang.", "Drive your elbows down and back, not just up.", "Keep your ribcage down — avoid excessive swinging."],
    ["Using momentum or kipping instead of a controlled pull.", "Only completing half the range of motion.", "Shrugging the shoulders up toward the ears."],
    "If you can't yet do a full rep, banded or negative pull ups build the same pattern.",
    ["lat-pulldown", "barbell-row", "seated-cable-row"]),
  ex("lat-pulldown", "back", ["Biceps"], "Cable", "Beginner", "Compound",
    "A supported pulling movement that builds the same pattern as a pull up.",
    ["Sit and secure your knees under the pad.", "Grip the bar wider than shoulder width.", "Pull the bar down to your upper chest, driving your elbows down.", "Let it rise back up under control to a full stretch."],
    ["Lean back only slightly — this isn't a rowing motion.", "Keep your chest tall throughout.", "Pause briefly at the bottom before releasing."],
    ["Leaning back excessively, turning it into a row.", "Pulling the bar behind the neck.", "Using body weight to yank the bar down."],
    "Focus on leading with your elbows rather than your hands.",
    ["pull-up", "barbell-row", "seated-cable-row"]),
  ex("barbell-row", "back", ["Biceps", "Rear Delts"], "Barbell", "Intermediate", "Compound",
    "A bent-over pulling movement that builds thickness through the entire back.",
    ["Hinge at the hips holding the bar with an overhand grip.", "Keep your back flat and torso close to parallel with the floor.", "Row the bar up toward your lower ribs.", "Lower back down under control."],
    ["Keep your core braced throughout the set.", "Pull with your elbows, not your hands.", "Keep your neck in a neutral position."],
    ["Rounding the lower back under load.", "Using a big body jerk to move the weight.", "Standing too upright, turning it into a shrug."],
    "If your lower back fatigues before your lats, try a chest-supported row variation instead.",
    ["pull-up", "lat-pulldown", "seated-cable-row"]),
  ex("seated-cable-row", "back", ["Biceps", "Rear Delts"], "Cable", "Beginner", "Compound",
    "A supported rowing movement that's easy to control and great for back thickness.",
    ["Sit with knees slightly bent and feet on the platform.", "Grab the handle and sit tall with a neutral spine.", "Pull the handle toward your lower ribs, squeezing your shoulder blades.", "Extend your arms back out under control."],
    ["Keep your torso still — avoid rocking back and forth.", "Drive your elbows past your ribs at the end of the pull.", "Keep your shoulders down, away from your ears."],
    ["Rocking the torso to add momentum.", "Rounding the upper back at the start of the pull.", "Only using the arms without engaging the back."],
    "Pause and squeeze your shoulder blades together for a full second on each rep.",
    ["barbell-row", "lat-pulldown", "pull-up"]),
  ex("dumbbell-shoulder-press", "shoulders", ["Triceps"], "Dumbbell", "Intermediate", "Compound",
    "A pressing movement that builds strength and size across the whole shoulder.",
    ["Sit or stand holding a dumbbell at each shoulder.", "Brace your core and press the dumbbells straight overhead.", "Bring them together near the top without touching.", "Lower back down under control to shoulder height."],
    ["Keep your ribcage down — don't lean back to press.", "Press in a straight line, not out and around.", "Keep your wrists stacked over your elbows."],
    ["Arching the lower back excessively.", "Flaring the elbows out too wide at the bottom.", "Pressing the dumbbells forward instead of straight up."],
    "Standing versions demand more core control — start seated if you're new to overhead pressing.",
    ["lateral-raise", "front-raise", "rear-delt-fly"]),
  ex("lateral-raise", "shoulders", ["Traps"], "Dumbbell", "Beginner", "Isolation",
    "An isolation movement that targets the side delt for shoulder width.",
    ["Stand holding a light dumbbell in each hand at your sides.", "With a soft bend in the elbows, raise your arms out to the sides.", "Lift until your hands reach roughly shoulder height.", "Lower back down slowly under control."],
    ["Lead the movement with your elbows, not your hands.", "Keep a slight forward tilt of the torso.", "Use a lighter weight than you think you need."],
    ["Swinging the weight up using momentum.", "Shrugging the traps to lift higher.", "Raising the arms above shoulder height."],
    "Slow the lowering phase down — that's where most of the growth stimulus happens.",
    ["dumbbell-shoulder-press", "front-raise", "rear-delt-fly"]),
  ex("front-raise", "shoulders", ["Chest"], "Dumbbell", "Beginner", "Isolation",
    "Targets the front of the shoulder with a controlled raise out in front of the body.",
    ["Stand holding a dumbbell in each hand in front of your thighs.", "Keeping a slight bend in the elbows, raise one or both arms forward.", "Lift to about shoulder height.", "Lower back down with control."],
    ["Avoid using your hips to swing the weight up.", "Keep your core braced to avoid arching your back.", "Lift to shoulder height, not higher."],
    ["Using momentum from the lower back.", "Going too heavy and shortening the range of motion.", "Locking the elbows out completely."],
    "Alternate arms if lifting both together causes your back to arch.",
    ["lateral-raise", "dumbbell-shoulder-press", "rear-delt-fly"]),
  ex("rear-delt-fly", "shoulders", ["Back"], "Dumbbell", "Beginner", "Isolation",
    "Targets the often-neglected rear delt to balance out shoulder development.",
    ["Hinge forward at the hips holding a dumbbell in each hand.", "With a slight bend in the elbows, raise your arms out to the sides.", "Squeeze your shoulder blades together at the top.", "Lower back down under control."],
    ["Keep your torso still throughout the movement.", "Lead with your elbows, not your hands.", "Keep your neck relaxed and neutral."],
    ["Standing too upright, losing tension on the rear delts.", "Using momentum to jerk the weight up.", "Going too heavy and turning it into a row."],
    "This is a high-rep, light-weight movement — chase the squeeze, not the load.",
    ["lateral-raise", "seated-cable-row", "dumbbell-shoulder-press"]),
  ex("dumbbell-bicep-curl", "arms", ["Forearms"], "Dumbbell", "Beginner", "Isolation",
    "The classic isolation movement for building the biceps.",
    ["Stand holding a dumbbell in each hand, arms fully extended.", "Keeping your elbows pinned to your sides, curl the weights up.", "Squeeze at the top of the movement.", "Lower back down under control."],
    ["Keep your elbows still throughout.", "Fully extend your arms at the bottom of each rep.", "Avoid swinging your torso to assist the lift."],
    ["Swinging the body to generate momentum.", "Only using a partial range of motion.", "Letting the elbows drift forward as the weight gets heavy."],
    "Turn your wrist so your palm faces up throughout for maximum bicep engagement.",
    ["hammer-curl", "tricep-pushdown", "skull-crushers"]),
  ex("hammer-curl", "arms", ["Forearms"], "Dumbbell", "Beginner", "Isolation",
    "A neutral-grip curl variation that builds the biceps and forearms together.",
    ["Stand holding dumbbells with palms facing your body.", "Keeping your elbows pinned to your sides, curl the weights up.", "Squeeze at the top of the movement.", "Lower back down with control."],
    ["Keep your wrists neutral throughout — don't rotate.", "Keep your elbows tucked at your sides.", "Move only at the elbow joint."],
    ["Letting the elbows flare out to the sides.", "Using momentum from the shoulders.", "Rushing the lowering phase."],
    "Great to pair with a straight-bar curl for balanced arm development.",
    ["dumbbell-bicep-curl", "tricep-pushdown", "skull-crushers"]),
  ex("tricep-pushdown", "arms", ["Forearms"], "Cable", "Beginner", "Isolation",
    "A cable isolation movement that targets all three heads of the triceps.",
    ["Stand facing a cable machine with a bar or rope attachment.", "Keep your elbows pinned to your sides.", "Push the attachment down until your arms are fully extended.", "Let it rise back up under control."],
    ["Keep your elbows locked at your sides throughout.", "Fully extend without locking out aggressively.", "Keep your torso upright — avoid leaning into it."],
    ["Letting the elbows drift away from the body.", "Using the shoulders to help push the weight down.", "Only using a partial range of motion."],
    "If using a rope, spread the ends apart at the bottom for an extra contraction.",
    ["skull-crushers", "dumbbell-bicep-curl", "hammer-curl"]),
  ex("skull-crushers", "arms", ["Forearms"], "Barbell", "Intermediate", "Isolation",
    "A lying triceps extension that builds size across the back of the arm.",
    ["Lie on a bench holding a bar with a shoulder-width grip, arms extended above your chest.", "Bend at the elbows, lowering the bar toward your forehead.", "Keep your upper arms still throughout.", "Extend your arms back to the start."],
    ["Keep your elbows pointed forward, not flared out.", "Move slowly through the lowering phase.", "Keep your upper arms vertical throughout."],
    ["Letting the elbows flare outward.", "Moving the upper arms instead of just the forearms.", "Using too much weight and losing control near the head."],
    "Lower the bar toward the top of your head rather than your forehead for a safer line.",
    ["tricep-pushdown", "dumbbell-bicep-curl", "hammer-curl"]),
  ex("barbell-squat", "legs", ["Glutes", "Core"], "Barbell", "Intermediate", "Compound",
    "The foundational lower-body movement for building total leg strength.",
    ["Set the bar across your upper back and unrack it.", "Stand with feet shoulder-width apart, toes slightly out.", "Bend your knees and hips to lower until thighs are at least parallel to the floor.", "Drive back up through your heels to standing."],
    ["Keep your chest up and core braced throughout.", "Track your knees in line with your toes.", "Keep your weight balanced through the middle of your foot."],
    ["Letting the knees cave inward.", "Rounding the lower back at the bottom.", "Rising onto the toes as you stand up."],
    "Practice with just the bar until your depth and bracing are consistent before adding weight.",
    ["leg-press", "romanian-deadlift", "leg-extension"]),
  ex("leg-press", "legs", ["Glutes"], "Machine", "Beginner", "Compound",
    "A supported pressing movement that builds the quads and glutes with less balance demand than a squat.",
    ["Sit in the machine with feet shoulder-width apart on the platform.", "Release the safety and lower the platform until knees reach about 90°.", "Press through your heels to extend your legs.", "Stop just short of locking your knees out."],
    ["Keep your lower back flat against the pad.", "Avoid letting your knees cave inward as you press.", "Control the lowering phase — don't let the weight drop."],
    ["Locking the knees out hard at the top.", "Placing the feet too high or too low on the platform.", "Letting the lower back round off the pad at the bottom."],
    "Adjust your foot position higher on the platform to shift more emphasis onto the glutes and hamstrings.",
    ["barbell-squat", "romanian-deadlift", "leg-extension"]),
  ex("romanian-deadlift", "legs", ["Glutes", "Back"], "Barbell", "Intermediate", "Compound",
    "A hip-hinge movement that builds the hamstrings and glutes while training the hinge pattern.",
    ["Hold the bar with an overhand grip in front of your thighs.", "With a slight bend in the knees, hinge at the hips and push them back.", "Lower the bar along your legs until you feel a hamstring stretch.", "Drive your hips forward to return to standing."],
    ["Keep the bar close to your legs throughout.", "Keep your back flat — hinge from the hips, not the spine.", "Keep a soft, consistent bend in the knees."],
    ["Rounding the lower back as the bar descends.", "Bending the knees too much, turning it into a squat.", "Losing the bar path away from the legs."],
    "Stop lowering the bar as soon as you feel your hamstrings fully stretch — you don't need to touch the floor.",
    ["barbell-squat", "leg-curl", "leg-press"]),
  ex("leg-extension", "legs", [], "Machine", "Beginner", "Isolation",
    "An isolation movement that targets the quadriceps directly.",
    ["Sit in the machine with the pad resting on your lower shins.", "Grip the side handles and brace your torso.", "Extend your legs until they're straight.", "Lower back down under control."],
    ["Keep your back flat against the pad.", "Extend fully but avoid violently locking the knees.", "Control the lowering phase rather than letting it drop."],
    ["Using momentum by jerking the weight up.", "Only using a partial range of motion.", "Gripping the handles so hard the hips lift off the seat."],
    "A brief pause at the top of each rep increases the contraction in the quads.",
    ["barbell-squat", "leg-press", "leg-curl"]),
  ex("leg-curl", "legs", ["Glutes"], "Machine", "Beginner", "Isolation",
    "An isolation movement that targets the hamstrings directly.",
    ["Lie face down on the machine with the pad resting above your heels.", "Grip the handles and brace your core.", "Curl your heels up toward your glutes.", "Lower back down under control."],
    ["Keep your hips pressed into the pad throughout.", "Avoid lifting your hips as the weight gets heavy.", "Control the lowering phase fully."],
    ["Lifting the hips off the pad to move more weight.", "Using a jerky, fast motion.", "Only completing half the range of motion."],
    "Point your toes toward your shins to engage the hamstrings even more directly.",
    ["romanian-deadlift", "leg-press", "barbell-squat"]),
  ex("crunches", "core", [], "Bodyweight", "Beginner", "Isolation",
    "A basic abdominal movement that isolates the upper abs through spinal flexion.",
    ["Lie on your back with knees bent and feet flat on the floor.", "Place your hands lightly behind your head or across your chest.", "Curl your shoulders up off the floor, engaging your abs.", "Lower back down under control."],
    ["Keep your lower back pressed into the floor.", "Lead with your chest, not your chin.", "Exhale as you curl up."],
    ["Pulling on the neck with the hands.", "Using momentum to jerk the torso up.", "Lifting the entire back off the floor rather than just curling."],
    "Focus on the squeeze at the top rather than the height of the movement.",
    ["plank", "hanging-leg-raise", "cable-crunch"]),
  ex("hanging-leg-raise", "core", ["Hip Flexors"], "Bodyweight", "Advanced", "Isolation",
    "A demanding core movement that targets the lower abs and hip flexors.",
    ["Hang from a pull-up bar with your arms fully extended.", "Brace your core to stop your body from swinging.", "Raise your legs up until roughly parallel to the floor.", "Lower back down under control."],
    ["Keep the movement controlled — avoid swinging.", "Focus on tilting the pelvis, not just lifting the legs.", "Keep your shoulders engaged, away from your ears."],
    ["Using momentum to swing the legs up.", "Only lifting from the hips without engaging the abs.", "Letting the lower back arch excessively."],
    "Bend your knees to make the movement more manageable while you build strength.",
    ["plank", "crunches", "cable-crunch"]),
  ex("plank", "core", ["Shoulders"], "Bodyweight", "Beginner", "Isolation",
    "An isometric hold that builds core stability and endurance.",
    ["Get into a forearm plank position with elbows under your shoulders.", "Keep your body in a straight line from head to heels.", "Brace your core and squeeze your glutes.", "Hold the position for the target time."],
    ["Keep your hips level — not piked up or sagging down.", "Keep your neck neutral, eyes toward the floor.", "Breathe steadily throughout the hold."],
    ["Letting the hips sag toward the floor.", "Piking the hips up too high.", "Holding your breath throughout the set."],
    "A shorter plank held with perfect form beats a longer one with sagging hips.",
    ["crunches", "hanging-leg-raise", "cable-crunch"]),
  ex("cable-crunch", "core", [], "Cable", "Intermediate", "Isolation",
    "A loaded ab movement that lets you progressively overload the core.",
    ["Kneel below a cable machine holding a rope attachment behind your head.", "Brace your core and round your spine, curling down toward your knees.", "Squeeze your abs at the bottom of the movement.", "Return to the start under control."],
    ["Move from your spine, not your hips.", "Keep the weight moderate and controlled.", "Keep your hips still throughout the movement."],
    ["Pulling with the arms instead of curling with the abs.", "Using the hips to sit back rather than flexing the spine.", "Going too heavy and losing form."],
    "Picture curling your ribcage toward your hips rather than just bending forward.",
    ["crunches", "plank", "hanging-leg-raise"]),
];

const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

function workout(slug, name, description, targetMuscles, difficulty, items) {
  return { slug, name, description, targetMuscles, difficulty, exercises: items.map(([exerciseId, sets, reps, rest, notes]) => ({ exerciseId, sets, reps, rest, notes })) };
}

const WORKOUTS = [
  workout("chest-day", "Chest Day", "A complete session to build pressing strength and size across the whole chest.", ["chest"], "Intermediate", [
    ["barbell-bench-press", 4, "8–10", "90s", "Your main lift — focus on control."],
    ["incline-dumbbell-press", 3, "10–12", "75s", "Chase the stretch at the bottom of each rep."],
    ["cable-fly", 3, "12–15", "60s", "Finish here since it isolates the chest fully."],
    ["chest-dip", 3, "AMRAP", "90s", "As many clean reps as possible."],
  ]),
  workout("back-day", "Back Day", "A pulling-focused session that builds width and thickness together.", ["back"], "Intermediate", [
    ["pull-up", 4, "AMRAP", "90s", "Start here while you're freshest."],
    ["barbell-row", 4, "8–10", "90s", "Keep the torso angle consistent every rep."],
    ["lat-pulldown", 3, "10–12", "75s", "Use this if pull ups fatigue you early."],
    ["seated-cable-row", 3, "12–15", "60s", "Finish with a full squeeze on every rep."],
  ]),
  workout("shoulder-day", "Shoulder Day", "Builds the shoulder from every angle for balanced, healthy joints.", ["shoulders"], "Beginner", [
    ["dumbbell-shoulder-press", 4, "8–10", "90s", "Your main lift for the day."],
    ["lateral-raise", 3, "12–15", "60s", "Light weight, strict form."],
    ["front-raise", 3, "12–15", "60s", "Alternate arms if your back arches."],
    ["rear-delt-fly", 3, "15–20", "45s", "Don't skip this — it balances the shoulder."],
  ]),
  workout("leg-day", "Leg Day", "A complete lower-body session covering quads, hamstrings and glutes.", ["legs"], "Intermediate", [
    ["barbell-squat", 4, "6–8", "120s", "Your heaviest lift — warm up thoroughly."],
    ["romanian-deadlift", 3, "10–12", "90s", "Focus on the hamstring stretch."],
    ["leg-press", 3, "12–15", "90s", "Push the range of motion here."],
    ["leg-curl", 3, "12–15", "60s", "Finish the hamstrings directly."],
  ]),
  workout("arms-day", "Arms Day", "A focused session for building the biceps and triceps evenly.", ["arms"], "Beginner", [
    ["dumbbell-bicep-curl", 3, "10–12", "60s", "Keep the elbows pinned to your sides."],
    ["hammer-curl", 3, "10–12", "60s", "Builds the forearms too."],
    ["tricep-pushdown", 3, "12–15", "60s", "Full lockout on every rep."],
    ["skull-crushers", 3, "10–12", "75s", "Move slowly through the stretch."],
  ]),
  workout("core-day", "Core Day", "Builds core strength and stability from every angle.", ["core"], "Beginner", [
    ["plank", 3, "45s hold", "45s", "Hold with a straight line from head to heel."],
    ["crunches", 3, "15–20", "45s", "Slow and controlled — no jerking."],
    ["cable-crunch", 3, "12–15", "60s", "Add load once bodyweight feels easy."],
    ["hanging-leg-raise", 3, "8–12", "60s", "Bend your knees if needed."],
  ]),
];

const VIDEOS = [
  { id: "how-to-romanian-deadlift", title: "How to: Romanian Deadlift", category: "Form & Technique", duration: "6:42", description: "Proper set-up, bar path, and the most common mistakes.", relatedExercise: "romanian-deadlift" },
  { id: "upper-chest-workout", title: "Upper Chest Workout", category: "Workout Guides", duration: "9:15", description: "The best exercises for building the upper chest.", relatedExercise: "incline-dumbbell-press" },
  { id: "leg-day-essentials", title: "Leg Day Essentials", category: "Beginner Guides", duration: "11:03", description: "A complete, beginner-friendly guide to leg day.", relatedExercise: "barbell-squat" },
  { id: "back-workout", title: "Back Workout", category: "Workout Guides", duration: "8:27", description: "Build a stronger, wider back with this session.", relatedExercise: "barbell-row" },
  { id: "shoulder-form-fixes", title: "Shoulder Form Fixes", category: "Form & Technique", duration: "5:58", description: "Common shoulder-press mistakes and how to fix them.", relatedExercise: "dumbbell-shoulder-press" },
  { id: "core-training-basics", title: "Core Training Basics", category: "Muscle-Specific Videos", duration: "7:12", description: "Everything beginners need to know about training the core.", relatedExercise: "plank" },
];
const VIDEO_CATEGORIES = ["Exercise Tutorials", "Workout Guides", "Form & Technique", "Beginner Guides", "Muscle-Specific Videos"];
const VIDEO_BY_EXERCISE = Object.fromEntries(VIDEOS.map(v => [v.relatedExercise, v]));

const ARTICLES = [
  { id: "beginners-guide", title: "A Beginner's Guide to Your First Month in the Gym", category: "Beginner Guides", readingTime: "6 min read", date: "Aug 14, 2026",
    content: ["Your first month isn't about lifting heavy — it's about learning how your body moves. Spend this time getting comfortable with the handful of foundational patterns: a squat, a hinge, a push and a pull. Everything else builds on these.",
      "Consistency beats intensity early on. Three sessions a week that you can actually stick to will do more for you than one brutal workout followed by a week of soreness.",
      "Keep a simple log of what you did and how it felt. In four weeks you'll have a clear record of what's working, and it becomes the easiest way to know when it's time to add weight."] },
  { id: "why-form-matters", title: "Why Form Matters More Than the Weight on the Bar", category: "Training Principles", readingTime: "5 min read", date: "Aug 2, 2026",
    content: ["It's tempting to judge a workout by the numbers on the plates. But a lift performed with poor form trains the wrong muscles, caps how much you can safely progress, and raises your injury risk.",
      "Good form means the target muscle is doing the work through a full, controlled range of motion — not momentum, not smaller stabiliser muscles compensating for a weight that's too heavy.",
      "A simple test: if you can't control the weight on the way down, it's too heavy. Slow the tempo, drop the load if you need to, and let the reps look identical from the first to the last."] },
  { id: "progressive-overload", title: "Progressive Overload, Explained Simply", category: "Muscle Building Basics", readingTime: "7 min read", date: "Jul 21, 2026",
    content: ["Progressive overload is the single idea behind almost all long-term training progress: gradually asking your muscles to do a little more than they're used to.",
      "That doesn't only mean adding weight. You can add a rep, add a set, slow the tempo down, or shorten your rest — all of these are valid ways to overload a muscle over time.",
      "The key word is gradually. Small, consistent increases you can recover from beat big jumps that leave you sore for a week and stall your next session."] },
  { id: "recovery-matters", title: "Recovery: The Most Skipped Step in Any Program", category: "Recovery", readingTime: "5 min read", date: "Jul 5, 2026",
    content: ["Muscle isn't built in the gym — it's built in the hours after, while you sleep and eat. Training simply creates the stimulus; recovery is what turns it into progress.",
      "Sleep is the biggest lever most people underuse. Aim for a consistent schedule before reaching for any other recovery tool.",
      "A rest day isn't wasted time. It's the part of the program where the actual adaptation happens."] },
  { id: "common-mistakes", title: "Five Common Mistakes New Lifters Make", category: "Common Gym Mistakes", readingTime: "6 min read", date: "Jun 18, 2026",
    content: ["Skipping a warm-up, chasing heavier weight before form is solid, copying someone else's program without adjusting it, neglecting the muscles you can't see in a mirror, and abandoning a plan after a single bad week.",
      "Each of these is easy to fix once you notice it. Most come down to patience — training is a long game, and the lifters who stick around are the ones who avoid burning out early.",
      "Pick one from this list that sounds like you, and focus on just that for the next few weeks."] },
];

/* ============================================================================
   SMALL HELPERS
============================================================================ */
function zoneFromLabel(label) {
  const l = label.toLowerCase();
  if (l.includes("chest") || l.includes("pec")) return "chest";
  if (l.includes("lat") || l.includes("trap") || l.includes("rhomboid") || l.includes("back")) return "back";
  if (l.includes("delt") || l.includes("shoulder")) return "shoulders";
  if (l.includes("bicep") || l.includes("tricep") || l.includes("forearm")) return "arms";
  if (l.includes("quad") || l.includes("hamstring") || l.includes("glute") || l.includes("calf") || l.includes("calve") || l.includes("hip")) return "legs";
  if (l.includes("ab") || l.includes("core") || l.includes("oblique")) return "core";
  return null;
}
function highlightsFor(exercise) {
  const h = { [exercise.primaryMuscle]: "primary" };
  exercise.secondaryMuscles.forEach(label => {
    const z = zoneFromLabel(label);
    if (z && !h[z]) h[z] = "secondary";
  });
  return h;
}
const EQUIPMENT_OPTIONS = ["Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight"];
const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const TYPE_OPTIONS = ["Compound", "Isolation"];
const EQUIPMENT_ICON = { Barbell: Dumbbell, Dumbbell: Dumbbell, Cable: Link2, Machine: Settings2, Bodyweight: PersonStanding };

/* ============================================================================
   ICONOGRAPHY — original SVG marks (no photography, no third-party IP)
============================================================================ */
function Logomark({ size = 28, invert = false }) {
  const strong = invert ? "var(--paper)" : "var(--ink)";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="1" y="14" width="6" height="4" rx="1.5" fill={strong} />
      <rect x="25" y="14" width="6" height="4" rx="1.5" fill={strong} />
      <rect x="6" y="10" width="3.4" height="12" rx="1.5" fill={strong} />
      <rect x="22.6" y="10" width="3.4" height="12" rx="1.5" fill={strong} />
      <rect x="9.4" y="14.5" width="13.2" height="3" rx="1.5" fill="var(--slate)" />
    </svg>
  );
}

function fillFor(zone, highlights) {
  if (!zone) return "var(--neutral-fill-2)";
  const level = highlights[zone];
  if (level === "primary") return "var(--pine)";
  if (level === "secondary") return "var(--pine-soft)";
  return "var(--neutral-fill)";
}

function BodySilhouette({ view = "front", highlights = {}, size = 96 }) {
  const f = (zone) => fillFor(zone, highlights);
  const h = Math.round(size * (220 / 120));
  return (
    <svg width={size} height={h} viewBox="0 0 120 220" fill="none" aria-hidden="true">
      <circle cx="60" cy="16" r="13" fill="var(--neutral-fill-2)" />
      <rect x="52" y="26" width="16" height="12" rx="5" fill="var(--neutral-fill-2)" />
      {view === "front" ? (
        <>
          <rect x="18" y="40" width="24" height="15" rx="8" fill={f("shoulders")} />
          <rect x="78" y="40" width="24" height="15" rx="8" fill={f("shoulders")} />
          <rect x="36" y="42" width="48" height="26" rx="10" fill={f("chest")} />
          <rect x="40" y="70" width="40" height="34" rx="8" fill={f("core")} />
          <rect x="10" y="54" width="15" height="38" rx="7" fill={f("arms")} />
          <rect x="95" y="54" width="15" height="38" rx="7" fill={f("arms")} />
          <rect x="8" y="94" width="13" height="34" rx="6" fill={f("arms")} />
          <rect x="99" y="94" width="13" height="34" rx="6" fill={f("arms")} />
          <rect x="32" y="106" width="22" height="52" rx="10" fill={f("legs")} />
          <rect x="66" y="106" width="22" height="52" rx="10" fill={f("legs")} />
          <rect x="34" y="160" width="18" height="42" rx="8" fill={f("legs")} />
          <rect x="68" y="160" width="18" height="42" rx="8" fill={f("legs")} />
        </>
      ) : (
        <>
          <rect x="18" y="40" width="24" height="15" rx="8" fill={f("back")} />
          <rect x="78" y="40" width="24" height="15" rx="8" fill={f("back")} />
          <rect x="34" y="42" width="52" height="34" rx="12" fill={f("back")} />
          <rect x="42" y="78" width="36" height="20" rx="8" fill={f("back")} />
          <rect x="10" y="54" width="15" height="38" rx="7" fill={f("arms")} />
          <rect x="95" y="54" width="15" height="38" rx="7" fill={f("arms")} />
          <rect x="8" y="94" width="13" height="34" rx="6" fill={f("arms")} />
          <rect x="99" y="94" width="13" height="34" rx="6" fill={f("arms")} />
          <rect x="38" y="104" width="44" height="22" rx="10" fill={f("legs")} />
          <rect x="32" y="128" width="22" height="34" rx="10" fill={f("legs")} />
          <rect x="66" y="128" width="22" height="34" rx="10" fill={f("legs")} />
          <rect x="34" y="164" width="18" height="38" rx="8" fill={f("legs")} />
          <rect x="68" y="164" width="18" height="38" rx="8" fill={f("legs")} />
        </>
      )}
    </svg>
  );
}

function HeroMark() {
  return (
    <svg viewBox="0 0 360 320" width="100%" height="100%" fill="none">
      <circle cx="180" cy="160" r="130" stroke="var(--pine-soft)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="180" cy="160" r="98" stroke="var(--pine-soft)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="140" cy="86" r="20" stroke="var(--ink)" strokeWidth="3" />
      <rect x="122" y="112" width="36" height="58" rx="16" stroke="var(--ink)" strokeWidth="3" />
      <path d="M122 122 L70 76" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M158 122 L210 76" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <rect x="48" y="62" width="44" height="10" rx="5" fill="var(--ink)" />
      <rect x="188" y="62" width="44" height="10" rx="5" fill="var(--ink)" />
      <circle cx="52" cy="67" r="15" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="228" cy="67" r="15" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M128 168 L100 250" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M152 168 L172 250" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M96 256 L70 262" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M176 256 L202 262" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================================
   SHARED UI ATOMS
============================================================================ */
function Container({ children, className = "" }) {
  return <div className={"max-w-6xl mx-auto px-5 sm:px-8 " + className}>{children}</div>;
}
function Card({ children, className = "", style = {}, ...props }) {
  return (
    <div className={"bg-white border rounded-xl transition-shadow duration-150 " + className}
      style={{ borderColor: "var(--line)", ...style }} {...props}>
      {children}
    </div>
  );
}
function Button({ children, variant = "primary", dark = false, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold cursor-pointer transition-all duration-200";
  if (variant === "primary") {
    return <button className={base + " fl-btn-primary " + className} style={{ backgroundColor: "var(--pine)", color: "var(--paper)" }} {...props}>{children}</button>;
  }
  if (variant === "outline") {
    const borderColor = dark ? "rgba(255,255,255,0.35)" : "var(--line)";
    const textColor = dark ? "var(--paper)" : "var(--ink)";
    return <button className={base + " fl-btn-outline border " + className} style={{ borderColor, color: textColor }} {...props}>{children}</button>;
  }
  return <button className={base + " fl-link " + className} style={{ color: "var(--pine)" }} {...props}>{children}</button>;
}
function Tag({ children, tone = "neutral" }) {
  const style = tone === "accent"
    ? { backgroundColor: "var(--pine-tint)", color: "var(--pine)" }
    : { backgroundColor: "var(--mist)", color: "var(--slate)" };
  return <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium" style={style}>{children}</span>;
}
function SectionHeader({ title, onViewAll }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h2 className="fl-display text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {onViewAll && (
        <button onClick={onViewAll} className="fl-link hidden sm:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--slate)" }}>
          View all <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap cursor-pointer" + (active ? "" : " fl-btn-outline")}
      style={active ? { backgroundColor: "var(--pine)", color: "var(--paper)", borderColor: "var(--pine)" } : { backgroundColor: "#fff", color: "var(--slate)", borderColor: "var(--line)" }}>
      {children}
    </button>
  );
}

/* ============================================================================
   CARDS
============================================================================ */
function MuscleCard({ muscle, count, onClick }) {
  return (
    <button onClick={onClick} className="text-left group">
      <Card className="p-5 h-full flex flex-col items-start gap-3 group-hover:shadow-md">
        <div className="rounded-lg flex items-center justify-center w-full" style={{ backgroundColor: "var(--mist)", height: 128 }}>
          <BodySilhouette view={muscle.slug === "back" ? "back" : "front"} highlights={{ [muscle.slug]: "primary" }} size={64} />
        </div>
        <div>
          <div className="font-semibold text-base fl-display">{muscle.name}</div>
          <div className="text-sm" style={{ color: "var(--slate)" }}>{count} exercises</div>
        </div>
      </Card>
    </button>
  );
}

function ExerciseCard({ exercise, onClick }) {
  const hasVideo = !!VIDEO_BY_EXERCISE[exercise.id];
  return (
    <button onClick={onClick} className="text-left group">
      <Card className="overflow-hidden h-full group-hover:shadow-md">
        <div className="relative flex items-center justify-center" style={{ backgroundColor: "var(--mist)", height: 168 }}>
          <BodySilhouette view={exercise.primaryMuscle === "back" ? "back" : "front"} highlights={highlightsFor(exercise)} size={72} />
          {hasVideo && (
            <div className="absolute bottom-2.5 right-2.5 rounded-full p-1.5" style={{ backgroundColor: "rgba(20,23,26,0.75)" }}>
              <Play size={12} color="#fff" fill="#fff" />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="font-semibold fl-display">{exercise.name}</div>
          <div className="text-sm mt-1" style={{ color: "var(--slate)" }}>
            {MUSCLES.find(m => m.slug === exercise.primaryMuscle)?.name} · {exercise.equipment}
          </div>
          <div className="flex gap-1.5 mt-3">
            <Tag>{exercise.difficulty}</Tag>
          </div>
        </div>
      </Card>
    </button>
  );
}

function VideoCard({ video, onClick }) {
  const rel = EX_BY_ID[video.relatedExercise];
  return (
    <button onClick={onClick} className="text-left group">
      <Card className="overflow-hidden h-full group-hover:shadow-md">
        <div className="relative flex items-center justify-center" style={{ backgroundColor: "var(--ink)", height: 168 }}>
          {rel && <div style={{ opacity: 0.85 }}><BodySilhouette view={rel.primaryMuscle === "back" ? "back" : "front"} highlights={{ [rel.primaryMuscle]: "secondary" }} size={64} /></div>}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full p-3" style={{ backgroundColor: "rgba(255,255,255,0.92)" }}>
              <Play size={18} fill="var(--ink)" color="var(--ink)" />
            </div>
          </div>
          <span className="absolute bottom-2.5 right-2.5 text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff" }}>{video.duration}</span>
        </div>
        <div className="p-4">
          <div className="font-semibold fl-display">{video.title}</div>
          <div className="text-sm mt-1" style={{ color: "var(--slate)" }}>{video.description}</div>
        </div>
      </Card>
    </button>
  );
}

function WorkoutCard({ w, onClick }) {
  return (
    <button onClick={onClick} className="text-left group">
      <Card className="p-5 h-full group-hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold fl-display text-lg">{w.name}</span>
          <Tag tone="accent">{w.difficulty}</Tag>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>{w.description}</p>
        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--slate)" }}>
          <span>{w.exercises.length} exercises</span>
          <span>·</span>
          <span>{w.targetMuscles.map(m => MUSCLES.find(mm => mm.slug === m)?.name).join(", ")}</span>
        </div>
      </Card>
    </button>
  );
}

function ArticleCard({ a, onClick }) {
  return (
    <button onClick={onClick} className="text-left group">
      <Card className="overflow-hidden h-full group-hover:shadow-md">
        <div className="flex items-center justify-center" style={{ backgroundColor: "var(--pine-tint)", height: 120 }}>
          <BookOpen size={28} color="var(--pine)" />
        </div>
        <div className="p-4">
          <Tag>{a.category}</Tag>
          <div className="font-semibold fl-display mt-2 leading-snug">{a.title}</div>
          <div className="text-xs mt-2" style={{ color: "var(--slate)" }}>{a.readingTime} · {a.date}</div>
        </div>
      </Card>
    </button>
  );
}

/* ============================================================================
   VIDEO / PLAYER MODAL (placeholder playback — trainer's own footage later)
============================================================================ */
function PlayerModal({ item, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setPct(p => (p >= 100 ? 0 : p + 1.2));
      }, 120);
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [playing]);

  if (!item) return null;
  const rel = item.relatedExercise ? EX_BY_ID[item.relatedExercise] : (item.primaryMuscle ? item : null);
  const title = item.title || item.name;
  const description = item.description || item.trainerTips;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(20,23,26,0.6)" }} onClick={onClose}>
      <div className="fl-fade bg-white rounded-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative flex items-center justify-center" style={{ backgroundColor: "var(--ink)", height: 260 }}>
          <button onClick={onClose} className="absolute top-3 right-3 rounded-full p-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <X size={16} color="#fff" />
          </button>
          {rel && <div className={playing ? "fl-pulse" : ""} style={{ opacity: 0.8 }}><BodySilhouette view={rel.primaryMuscle === "back" ? "back" : "front"} highlights={highlightsFor(rel)} size={88} /></div>}
          <button onClick={() => setPlaying(p => !p)} className="absolute rounded-full p-4" style={{ backgroundColor: "rgba(255,255,255,0.95)" }}>
            {playing ? <Pause size={22} color="var(--ink)" /> : <Play size={22} fill="var(--ink)" color="var(--ink)" />}
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
            <div className="h-full" style={{ width: pct + "%", backgroundColor: "var(--pine-soft)", transition: "width 0.12s linear" }} />
          </div>
        </div>
        <div className="p-5">
          <div className="font-semibold fl-display text-lg">{title}</div>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>{description}</p>
          <p className="text-xs mt-3" style={{ color: "var(--slate)" }}>Demo preview — your trainer's own footage will play here once uploaded.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   HEADER / FOOTER
============================================================================ */
const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "exercises", label: "Exercises" },
  { key: "muscles", label: "Muscles" },
  { key: "workouts", label: "Workouts" },
  { key: "videos", label: "Videos" },
  { key: "articles", label: "Articles" },
];

function Header({ route, go, openSearch }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 pt-3 sm:pt-4">
      <div className="max-w-6xl mx-auto rounded-2xl border shadow-sm" style={{ backgroundColor: "var(--paper)", borderColor: "var(--line)" }}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <button onClick={() => go("home")} className="flex items-center gap-2 cursor-pointer">
            <Logomark />
            <span className="fl-display font-bold text-lg tracking-tight">Dishant Fitness</span>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.slice(1).map(item => (
              <button key={item.key} onClick={() => go(item.key)}
                className="fl-navlink text-sm font-medium"
                style={{ color: route.page === item.key ? "var(--ink)" : "var(--slate)" }}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={openSearch} className="fl-icon-btn-light p-2 rounded-lg" aria-label="Search">
              <Search size={18} />
            </button>
            <div className="relative hidden sm:block">
              <button onClick={() => setProfileOpen(p => !p)} className="fl-icon-btn-light p-2 rounded-lg" aria-label="Account">
                <User size={18} />
              </button>
              {profileOpen && (
                <div className="fl-fade absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-1" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
                  <button onClick={() => { go("studio"); setProfileOpen(false); }} className="fl-link w-full text-left px-3 py-2 text-sm hover:bg-gray-50" style={{ color: "var(--ink)" }}>Trainer Studio</button>
                  <div className="px-3 py-2 text-sm" style={{ color: "var(--slate)" }}>Client sign-in</div>
                </div>
              )}
            </div>
            <button onClick={() => setMobileOpen(o => !o)} className="fl-icon-btn-light p-2 rounded-lg md:hidden" aria-label="Menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-2xl border shadow-sm fl-fade" style={{ backgroundColor: "var(--paper)", borderColor: "var(--line)" }}>
          <div className="py-3 px-4 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <button key={item.key} onClick={() => { go(item.key); setMobileOpen(false); }}
                className="fl-navlink text-left px-2 py-2.5 text-sm font-medium rounded-lg"
                style={{ color: route.page === item.key ? "var(--ink)" : "var(--slate)" }}>
                {item.label}
              </button>
            ))}
            <button onClick={() => { go("studio"); setMobileOpen(false); }} className="fl-navlink text-left px-2 py-2.5 text-sm font-medium rounded-lg" style={{ color: "var(--slate)" }}>Trainer Studio</button>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ go }) {
  return (
    <footer className="relative overflow-hidden mt-24" style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}>
      <BackgroundDecor variant="dark" />
      <Container className="relative py-12 flex flex-col md:flex-row md:justify-between gap-8" style={{ zIndex: 1 }}>
        <div className="max-w-xs">
          <button onClick={() => go("home")} className="flex items-center gap-2 mb-3 cursor-pointer">
            <Logomark size={24} invert />
            <span className="fl-display font-bold">Dishant Fitness</span>
          </button>
          <p className="text-sm" style={{ color: "var(--on-dark)" }}>Learn exercises. Understand your muscles. Train better.</p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold mb-1" style={{ color: "var(--on-dark)" }}>Library</span>
            {["exercises", "muscles", "workouts", "videos", "articles"].map(k => (
              <button key={k} onClick={() => go(k)} className="fl-link-invert text-sm text-left capitalize">{k}</button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold mb-1" style={{ color: "var(--on-dark)" }}>More</span>
            <span className="text-sm" style={{ color: "var(--on-dark)" }}>Instagram</span>
            <span className="text-sm" style={{ color: "var(--on-dark)" }}>YouTube</span>
            <span className="text-sm" style={{ color: "var(--on-dark)" }}>Contact trainer</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ============================================================================
   GLOBAL SEARCH
============================================================================ */
function SearchOverlay({ query, setQuery, onClose, go, exercises }) {
  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return null;
    return {
      Exercises: exercises.filter(e => e.name.toLowerCase().includes(q)).slice(0, 5),
      Muscles: MUSCLES.filter(m => m.name.toLowerCase().includes(q)),
      Workouts: WORKOUTS.filter(w => w.name.toLowerCase().includes(q)),
      Videos: VIDEOS.filter(v => v.title.toLowerCase().includes(q)),
      Articles: ARTICLES.filter(a => a.title.toLowerCase().includes(q)),
    };
  }, [q, exercises]);
  const anyResults = results && Object.values(results).some(arr => arr.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" style={{ backgroundColor: "rgba(20,23,26,0.5)" }} onClick={onClose}>
      <div className="fl-fade bg-white rounded-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b" style={{ borderColor: "var(--line)" }}>
          <Search size={18} color="var(--slate)" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search exercises, muscles, workouts…"
            className="flex-1 py-4 outline-none text-sm" />
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="max-h-96 overflow-y-auto fl-scroll p-2">
          {!q && <p className="text-sm px-3 py-6 text-center" style={{ color: "var(--slate)" }}>Try "chest", "bench", or "core".</p>}
          {q && !anyResults && <p className="text-sm px-3 py-6 text-center" style={{ color: "var(--slate)" }}>No results for "{query}".</p>}
          {results && Object.entries(results).map(([group, items]) => items.length > 0 && (
            <div key={group} className="mb-1">
              <div className="px-3 pt-2 pb-1 text-xs font-semibold" style={{ color: "var(--slate)" }}>{group}</div>
              {items.map(item => (
                <button key={item.id || item.slug} onClick={() => {
                  if (group === "Exercises") go("exercise", item.slug);
                  if (group === "Muscles") go("muscle", item.slug);
                  if (group === "Workouts") go("workout", item.slug);
                  if (group === "Videos") go("videos", item.id);
                  if (group === "Articles") go("article", item.id);
                  onClose();
                }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                  {item.name || item.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   HOME PAGE
============================================================================ */
function Home({ go, exercises, onPlay }) {
  return (
    <>
      <Container className="pt-6 sm:pt-12 pb-16 sm:pb-24">
        <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--mist)" }}>
          <BackgroundDecor variant="light" />
          <div className="relative px-4 sm:px-10 lg:px-14 pt-6 sm:pt-10" style={{ zIndex: 1 }}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--ink)" }} />
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--slate)" }}>LEARN. TRAIN. IMPROVE.</span>
            </div>
          </div>
          <div className="relative grid grid-cols-2" style={{ zIndex: 1 }}>
            <div className="px-4 pt-3 pb-8 sm:px-10 sm:pt-4 sm:pb-10 lg:px-14 lg:pb-14 flex flex-col justify-center min-w-0">
              <h1 className="fl-display text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2 sm:mb-5">
                Learn every exercise.<br />Understand every muscle.
              </h1>
              <p className="hidden sm:block text-base sm:text-lg mb-8 max-w-md" style={{ color: "var(--slate)" }}>
                Learn proper form, understand the muscles you train, and build better workouts with guidance from your trainer.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Button onClick={() => go("exercises")}>Browse Exercises</Button>
                <Button variant="outline" onClick={() => go("muscles")}>Explore Muscles</Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center px-4 pb-8 sm:p-8" style={{ minHeight: 200 }}>
              <div style={{ width: "60%", maxWidth: 260 }}><HeroMark /></div>
            </div>
          </div>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <SectionHeader title="Explore by Muscle" onViewAll={() => go("muscles")} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MUSCLES.map(m => (
            <MuscleCard key={m.slug} muscle={m} count={exercises.filter(e => e.primaryMuscle === m.slug).length} onClick={() => go("muscle", m.slug)} />
          ))}
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <SectionHeader title="Popular Exercises" onViewAll={() => go("exercises")} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {exercises.slice(0, 4).map(e => (
            <ExerciseCard key={e.id} exercise={e} onClick={() => go("exercise", e.slug)} />
          ))}
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <SectionHeader title="Latest Videos" onViewAll={() => go("videos")} />
        <div className="grid sm:grid-cols-3 gap-4">
          {VIDEOS.slice(0, 3).map(v => (
            <VideoCard key={v.id} video={v} onClick={() => onPlay(v)} />
          ))}
        </div>
      </Container>

      <div style={{ backgroundColor: "var(--mist)" }}>
        <Container className="py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Film, title: "HD Videos", sub: "High quality exercise videos" },
              { icon: User, title: "Expert Guidance", sub: "Learn from your trainer" },
              { icon: ListChecks, title: "Step by Step", sub: "Easy to follow instructions" },
              { icon: Users, title: "For All Levels", sub: "Beginner to advanced" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-start gap-2">
                <f.icon size={20} color="var(--pine)" />
                <div className="font-bold text-sm fl-display">{f.title}</div>
                <div className="text-sm" style={{ color: "var(--slate)" }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

/* ============================================================================
   EXERCISES LIBRARY + DETAIL
============================================================================ */
function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold mb-2.5" style={{ color: "var(--slate)" }}>{title}</div>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="fl-check" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function ExercisesPage({ go, exercises }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ muscle: [], equipment: [], difficulty: [], type: [] });
  const [visible, setVisible] = useState(9);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { setVisible(9); }, [query, filters]);

  function toggle(category, value) {
    setFilters(f => ({ ...f, [category]: f[category].includes(value) ? f[category].filter(v => v !== value) : [...f[category], value] }));
  }
  function clearAll() { setFilters({ muscle: [], equipment: [], difficulty: [], type: [] }); setQuery(""); }

  const filtered = useMemo(() => exercises.filter(e => {
    if (filters.muscle.length && !filters.muscle.includes(e.primaryMuscle)) return false;
    if (filters.equipment.length && !filters.equipment.includes(e.equipment)) return false;
    if (filters.difficulty.length && !filters.difficulty.includes(e.difficulty)) return false;
    if (filters.type.length && !filters.type.includes(e.exerciseType)) return false;
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [exercises, filters, query]);

  const activeCount = filters.muscle.length + filters.equipment.length + filters.difficulty.length + filters.type.length;

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="fl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Exercise Library</h1>
      <p className="mb-8" style={{ color: "var(--slate)" }}>Find exercises by muscle, equipment, difficulty or workout type.</p>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--slate)" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exercises…"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "var(--line)" }} />
      </div>

      <button onClick={() => setFiltersOpen(o => !o)} className="lg:hidden flex items-center gap-2 mb-4 text-sm font-medium">
        <Filter size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
      </button>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className={(filtersOpen ? "block" : "hidden") + " lg:block"}>
          <Card className="p-5 lg:sticky lg:top-20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm fl-display">Filters</span>
              {activeCount > 0 && <button onClick={clearAll} className="fl-link text-xs font-medium" style={{ color: "var(--slate)" }}>Clear all</button>}
            </div>
            <div className="mt-4">
              <FilterGroup title="Muscle" options={MUSCLES.map(m => m.name)} selected={filters.muscle.map(s => MUSCLES.find(m => m.slug === s)?.name)}
                onToggle={label => toggle("muscle", MUSCLES.find(m => m.name === label)?.slug)} />
              <FilterGroup title="Equipment" options={EQUIPMENT_OPTIONS} selected={filters.equipment} onToggle={v => toggle("equipment", v)} />
              <FilterGroup title="Difficulty" options={DIFFICULTY_OPTIONS} selected={filters.difficulty} onToggle={v => toggle("difficulty", v)} />
              <FilterGroup title="Exercise Type" options={TYPE_OPTIONS} selected={filters.type} onToggle={v => toggle("type", v)} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="text-sm mb-4" style={{ color: "var(--slate)" }}>{filtered.length} exercises</div>
          {filtered.length === 0 ? (
            <p className="text-sm py-12 text-center" style={{ color: "var(--slate)" }}>No exercises match those filters yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.slice(0, visible).map(e => <ExerciseCard key={e.id} exercise={e} onClick={() => go("exercise", e.slug)} />)}
            </div>
          )}
          {visible < filtered.length && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => setVisible(v => v + 9)}>Load more</Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

function ExerciseDetail({ slug, go, onPlay }) {
  const exercise = EX_BY_ID[slug];
  if (!exercise) return <Container className="py-16">Exercise not found.</Container>;
  const muscle = MUSCLES.find(m => m.slug === exercise.primaryMuscle);
  const related = exercise.relatedExercises.map(id => EX_BY_ID[id]).filter(Boolean);
  const hl = highlightsFor(exercise);
  const video = VIDEO_BY_EXERCISE[exercise.id];
  const workoutsWithIt = WORKOUTS.filter(w => w.exercises.some(item => item.exerciseId === exercise.id));

  return (
    <Container className="py-10 sm:py-14">
      <button onClick={() => go("exercises")} className="flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "var(--slate)" }}>
        <ChevronLeft size={15} /> Exercise Library
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="rounded-2xl flex items-center justify-center relative" style={{ backgroundColor: "var(--mist)", height: 320 }}>
            <BodySilhouette view={exercise.primaryMuscle === "back" ? "back" : "front"} highlights={hl} size={140} />
            {video && (
              <button onClick={() => onPlay(exercise)} className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: "var(--ink)" }}>
                <Play size={13} fill="#fff" color="#fff" />
                <span className="text-xs font-medium text-white">Watch demo</span>
              </button>
            )}
          </div>
        </div>

        <div>
          <h1 className="fl-display text-3xl font-extrabold tracking-tight mb-3">{exercise.name}</h1>
          <p className="mb-5" style={{ color: "var(--slate)" }}>{exercise.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div><div className="text-xs mb-1" style={{ color: "var(--slate)" }}>Primary Muscle</div><div className="font-medium">{muscle?.name}</div></div>
            <div><div className="text-xs mb-1" style={{ color: "var(--slate)" }}>Secondary Muscles</div><div className="font-medium">{exercise.secondaryMuscles.join(", ") || "—"}</div></div>
            <div><div className="text-xs mb-1" style={{ color: "var(--slate)" }}>Equipment</div><div className="font-medium">{exercise.equipment}</div></div>
            <div><div className="text-xs mb-1" style={{ color: "var(--slate)" }}>Difficulty</div><div className="font-medium">{exercise.difficulty}</div></div>
            <div><div className="text-xs mb-1" style={{ color: "var(--slate)" }}>Exercise Type</div><div className="font-medium">{exercise.exerciseType}</div></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-14">
        <div>
          <h2 className="fl-display text-xl font-bold mb-4">How to Perform</h2>
          <ol className="flex flex-col gap-3">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: "var(--pine-tint)", color: "var(--pine)" }}>{i + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          <h2 className="fl-display text-xl font-bold mb-4 mt-10">Proper Form</h2>
          <ul className="flex flex-col gap-2.5">
            {exercise.properForm.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm items-start">
                <Check size={16} color="var(--pine)" className="flex-shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <h2 className="fl-display text-xl font-bold mb-4 mt-10">Common Mistakes</h2>
          <ul className="flex flex-col gap-2.5">
            {exercise.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2.5 text-sm items-start">
                <X size={16} color="#B54A3E" className="flex-shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="fl-display text-xl font-bold mb-4">Target Muscles</h2>
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <BodySilhouette view="front" highlights={hl} size={100} />
                <span className="text-xs" style={{ color: "var(--slate)" }}>Front</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BodySilhouette view="back" highlights={hl} size={100} />
                <span className="text-xs" style={{ color: "var(--slate)" }}>Back</span>
              </div>
            </div>
            <div className="flex items-center gap-5 justify-center mt-5 text-xs" style={{ color: "var(--slate)" }}>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--pine)" }} /> Primary</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--pine-soft)" }} /> Secondary</span>
            </div>
          </Card>

          <h2 className="fl-display text-xl font-bold mb-3">Trainer's Tips</h2>
          <Card className="p-5 mb-6" style={{ backgroundColor: "var(--pine-tint)", borderColor: "var(--pine-soft)" }}>
            <p className="text-sm" style={{ color: "var(--ink)" }}>{exercise.trainerTips}</p>
          </Card>

          {workoutsWithIt.length > 0 && (
            <>
              <h2 className="fl-display text-xl font-bold mb-3">Appears In</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {workoutsWithIt.map(w => (
                  <button key={w.slug} onClick={() => go("workout", w.slug)}><Tag tone="accent">{w.name}</Tag></button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="fl-display text-xl font-bold mb-5">Related Exercises</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(r => <ExerciseCard key={r.id} exercise={r} onClick={() => go("exercise", r.slug)} />)}
          </div>
        </div>
      )}
    </Container>
  );
}

/* ============================================================================
   MUSCLES PAGE + DETAIL
============================================================================ */
function MusclesPage({ go, exercises }) {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="fl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Muscles</h1>
      <p className="mb-8" style={{ color: "var(--slate)" }}>Understand what each muscle does and which exercises train it.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MUSCLES.map(m => (
          <MuscleCard key={m.slug} muscle={m} count={exercises.filter(e => e.primaryMuscle === m.slug).length} onClick={() => go("muscle", m.slug)} />
        ))}
      </div>
    </Container>
  );
}

function MuscleDetail({ slug, go, exercises }) {
  const muscle = MUSCLES.find(m => m.slug === slug);
  if (!muscle) return <Container className="py-16">Muscle not found.</Container>;
  const list = exercises.filter(e => e.primaryMuscle === slug);
  return (
    <Container className="py-10 sm:py-14">
      <button onClick={() => go("muscles")} className="flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "var(--slate)" }}>
        <ChevronLeft size={15} /> Muscles
      </button>
      <div className="grid md:grid-cols-3 gap-10 mb-14">
        <div className="rounded-2xl flex items-center justify-center" style={{ backgroundColor: "var(--mist)", height: 260 }}>
          <BodySilhouette view={slug === "back" ? "back" : "front"} highlights={{ [slug]: "primary" }} size={110} />
        </div>
        <div className="md:col-span-2">
          <h1 className="fl-display text-3xl font-extrabold tracking-tight mb-1">{muscle.name}</h1>
          <p className="text-sm mb-5" style={{ color: "var(--slate)" }}>{muscle.short}</p>
          <div className="mb-4">
            <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--slate)" }}>Overview</div>
            <p className="text-sm">{muscle.description}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--slate)" }}>Function</div>
            <p className="text-sm">{muscle.fn}</p>
          </div>
        </div>
      </div>
      <h2 className="fl-display text-xl font-bold mb-5">Exercises for {muscle.name}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(e => <ExerciseCard key={e.id} exercise={e} onClick={() => go("exercise", e.slug)} />)}
      </div>
    </Container>
  );
}

/* ============================================================================
   WORKOUTS PAGE + DETAIL
============================================================================ */
function WorkoutsPage({ go }) {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="fl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Workouts</h1>
      <p className="mb-8" style={{ color: "var(--slate)" }}>Exercises organised into complete training days.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKOUTS.map(w => <WorkoutCard key={w.slug} w={w} onClick={() => go("workout", w.slug)} />)}
      </div>
    </Container>
  );
}

function WorkoutDetail({ slug, go }) {
  const w = WORKOUTS.find(w => w.slug === slug);
  if (!w) return <Container className="py-16">Workout not found.</Container>;
  return (
    <Container className="py-10 sm:py-14">
      <button onClick={() => go("workouts")} className="flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "var(--slate)" }}>
        <ChevronLeft size={15} /> Workouts
      </button>
      <h1 className="fl-display text-3xl font-extrabold tracking-tight mb-2">{w.name}</h1>
      <p className="mb-4 max-w-xl" style={{ color: "var(--slate)" }}>{w.description}</p>
      <div className="flex gap-2 mb-10">
        <Tag tone="accent">{w.difficulty}</Tag>
        <Tag>{w.exercises.length} exercises</Tag>
      </div>
      <div className="flex flex-col gap-3">
        {w.exercises.map((item, i) => {
          const e = EX_BY_ID[item.exerciseId];
          return (
            <Card key={i} className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md" onClick={() => go("exercise", e.slug)}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: "var(--mist)", width: 64, height: 64 }}>
                <BodySilhouette view={e.primaryMuscle === "back" ? "back" : "front"} highlights={{ [e.primaryMuscle]: "primary" }} size={36} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold fl-display">{e.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>{item.notes}</div>
              </div>
              <div className="hidden sm:flex gap-6 text-sm flex-shrink-0" style={{ color: "var(--slate)" }}>
                <div className="text-center"><div className="font-semibold" style={{ color: "var(--ink)" }}>{item.sets}</div>sets</div>
                <div className="text-center"><div className="font-semibold" style={{ color: "var(--ink)" }}>{item.reps}</div>reps</div>
                <div className="text-center"><div className="font-semibold" style={{ color: "var(--ink)" }}>{item.rest}</div>rest</div>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

/* ============================================================================
   VIDEOS PAGE
============================================================================ */
function VideosPage({ onPlay }) {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const list = VIDEOS.filter(v => (cat === "All" || v.category === cat) && v.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="fl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Videos</h1>
      <p className="mb-6" style={{ color: "var(--slate)" }}>Watch your trainer demonstrate proper form for every exercise.</p>
      <div className="relative mb-5 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--slate)" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search videos…"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "var(--line)" }} />
      </div>
      <div className="flex gap-2 overflow-x-auto fl-scroll pb-2 mb-8">
        <Chip active={cat === "All"} onClick={() => setCat("All")}>All</Chip>
        {VIDEO_CATEGORIES.map(c => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(v => <VideoCard key={v.id} video={v} onClick={() => onPlay(v)} />)}
      </div>
    </Container>
  );
}

/* ============================================================================
   ARTICLES PAGE + DETAIL
============================================================================ */
function ArticlesPage({ go }) {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="fl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Articles</h1>
      <p className="mb-8" style={{ color: "var(--slate)" }}>Short reads on training principles, form, and recovery.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTICLES.map(a => <ArticleCard key={a.id} a={a} onClick={() => go("article", a.id)} />)}
      </div>
    </Container>
  );
}
function ArticleDetail({ id, go }) {
  const a = ARTICLES.find(a => a.id === id);
  if (!a) return <Container className="py-16">Article not found.</Container>;
  return (
    <Container className="py-10 sm:py-14 max-w-2xl">
      <button onClick={() => go("articles")} className="flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "var(--slate)" }}>
        <ChevronLeft size={15} /> Articles
      </button>
      <Tag>{a.category}</Tag>
      <h1 className="fl-display text-3xl font-extrabold tracking-tight mt-3 mb-2">{a.title}</h1>
      <div className="text-sm mb-8" style={{ color: "var(--slate)" }}>{a.readingTime} · {a.date}</div>
      <div className="flex flex-col gap-4">
        {a.content.map((p, i) => <p key={i} className="leading-relaxed">{p}</p>)}
      </div>
    </Container>
  );
}

/* ============================================================================
   TRAINER STUDIO (lightweight admin — appends a new exercise client-side)
============================================================================ */
function TrainerStudio({ exercises, setExercises }) {
  const empty = { name: "", primaryMuscle: "chest", secondaryMuscles: "", equipment: "Barbell", difficulty: "Beginner", exerciseType: "Compound", description: "", instructions: "", trainerTips: "" };
  const [form, setForm] = useState(empty);
  const [success, setSuccess] = useState(false);

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function submit() {
    if (!form.name.trim()) return;
    const id = form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newExercise = {
      id, slug: id, name: form.name.trim(), primaryMuscle: form.primaryMuscle,
      secondaryMuscles: form.secondaryMuscles.split(",").map(s => s.trim()).filter(Boolean),
      equipment: form.equipment, difficulty: form.difficulty, exerciseType: form.exerciseType,
      description: form.description || "Added by the trainer.",
      instructions: form.instructions.split("\n").map(s => s.trim()).filter(Boolean),
      properForm: [], commonMistakes: [], trainerTips: form.trainerTips, relatedExercises: [],
    };
    setExercises(list => [newExercise, ...list]);
    setForm(empty);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm outline-none";
  const inputStyle = { borderColor: "var(--line)" };

  return (
    <Container className="py-10 sm:py-14 max-w-2xl">
      <h1 className="fl-display text-3xl font-extrabold tracking-tight mb-2">Trainer Studio</h1>
      <p className="mb-8" style={{ color: "var(--slate)" }}>Add a new exercise to the library. It'll appear immediately in Exercises.</p>

      {success && (
        <Card className="p-4 mb-6 flex items-center gap-2" style={{ backgroundColor: "var(--pine-tint)", borderColor: "var(--pine-soft)" }}>
          <Check size={16} color="var(--pine)" /> <span className="text-sm">Exercise added.</span>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Exercise Name</label>
          <input className={inputClass} style={inputStyle} value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Cable Lateral Raise" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Primary Muscle</label>
            <select className={inputClass} style={inputStyle} value={form.primaryMuscle} onChange={e => update("primaryMuscle", e.target.value)}>
              {MUSCLES.map(m => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Secondary Muscles</label>
            <input className={inputClass} style={inputStyle} value={form.secondaryMuscles} onChange={e => update("secondaryMuscles", e.target.value)} placeholder="Comma separated" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Equipment</label>
            <select className={inputClass} style={inputStyle} value={form.equipment} onChange={e => update("equipment", e.target.value)}>
              {EQUIPMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Difficulty</label>
            <select className={inputClass} style={inputStyle} value={form.difficulty} onChange={e => update("difficulty", e.target.value)}>
              {DIFFICULTY_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Exercise Type</label>
            <select className={inputClass} style={inputStyle} value={form.exerciseType} onChange={e => update("exerciseType", e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Description</label>
          <textarea className={inputClass} style={inputStyle} rows={2} value={form.description} onChange={e => update("description", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Instructions (one step per line)</label>
          <textarea className={inputClass} style={inputStyle} rows={4} value={form.instructions} onChange={e => update("instructions", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--slate)" }}>Trainer Tips</label>
          <textarea className={inputClass} style={inputStyle} rows={2} value={form.trainerTips} onChange={e => update("trainerTips", e.target.value)} />
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--slate)" }}>
          <Plus size={15} /> Image and video upload connect once a backend is in place.
        </div>
        <div>
          <Button onClick={submit}>Add Exercise</Button>
        </div>
      </div>

      <div className="mt-12">
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--slate)" }}>Recently added this session</div>
        <div className="flex flex-col gap-2">
          {exercises.slice(0, 3).map(e => (
            <div key={e.id} className="text-sm flex items-center gap-2">
              <ArrowUpRight size={13} color="var(--pine)" /> {e.name}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

/* ============================================================================
   LOADING SCREEN — full black screen, dumbbell fills grey → white, fades out
============================================================================ */
const DUMBBELL_RECTS = [
  { x: 2, y: 34, width: 16, height: 32, rx: 4 },
  { x: 22, y: 24, width: 10, height: 52, rx: 3 },
  { x: 36, y: 44, width: 48, height: 12, rx: 6 },
  { x: 88, y: 24, width: 10, height: 52, rx: 3 },
  { x: 104, y: 34, width: 16, height: 32, rx: 4 },
];
function DumbbellShape({ color }) {
  return <g fill={color}>{DUMBBELL_RECTS.map((r, i) => <rect key={i} {...r} />)}</g>;
}
function LoadingScreen({ onDone }) {
  const [filled, setFilled] = useState(false);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFilled(true), 120);
    const t2 = setTimeout(() => setFading(true), 1500);
    const t3 = setTimeout(() => onDone(), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  const w = 140, h = 116;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      style={{ transition: "opacity .5s ease", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}>
      <div style={{ position: "relative", width: w, height: h }}>
        <svg viewBox="0 0 120 100" width={w} height={h} style={{ position: "absolute", top: 0, left: 0 }}>
          <DumbbellShape color="#2E2E2E" />
        </svg>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: w, overflow: "hidden", height: filled ? h : 0, transition: "height 1.3s cubic-bezier(.65,0,.35,1)" }}>
          <svg viewBox="0 0 120 100" width={w} height={h} style={{ position: "absolute", left: 0, bottom: 0 }}>
            <DumbbellShape color="#FFFFFF" />
          </svg>
        </div>
      </div>
      <div className="mt-6 text-xs font-medium" style={{ color: "#6B6F73", letterSpacing: "0.25em" }}>DISHANT FITNESS</div>
    </div>
  );
}

/* ============================================================================
   APP ROOT
============================================================================ */
export default function App() {
  const [route, setRoute] = useState({ page: "home", slug: null });
  const [exercises, setExercises] = useState(EXERCISES);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") document.title = "Dishant Fitness";
  }, []);

  function go(page, slug = null) {
    setRoute({ page, slug });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openSearch() { setQuery(""); setSearchOpen(true); }
  function closeSearch() { setSearchOpen(false); }
  function playItem(item) { setPlayer(item); }

  let page;
  if (route.page === "home") page = <Home go={go} exercises={exercises} onPlay={playItem} />;
  else if (route.page === "exercises") page = <ExercisesPage go={go} exercises={exercises} />;
  else if (route.page === "exercise") page = <ExerciseDetail slug={route.slug} go={go} onPlay={playItem} />;
  else if (route.page === "muscles") page = <MusclesPage go={go} exercises={exercises} />;
  else if (route.page === "muscle") page = <MuscleDetail slug={route.slug} go={go} exercises={exercises} />;
  else if (route.page === "workouts") page = <WorkoutsPage go={go} />;
  else if (route.page === "workout") page = <WorkoutDetail slug={route.slug} go={go} />;
  else if (route.page === "videos") page = <VideosPage onPlay={playItem} />;
  else if (route.page === "articles") page = <ArticlesPage go={go} />;
  else if (route.page === "article") page = <ArticleDetail id={route.slug} go={go} />;
  else if (route.page === "studio") page = <TrainerStudio exercises={exercises} setExercises={setExercises} />;

  return (
    <div className="fl-root min-h-screen">
      <style>{THEME_CSS}</style>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <Header route={route} go={go} openSearch={openSearch} />
      <div className="relative">
        <BackgroundDecor variant="light" />
        <div className="relative" style={{ zIndex: 1 }}>{page}</div>
      </div>
      <Footer go={go} />
      {searchOpen && <SearchOverlay query={query} setQuery={setQuery} onClose={closeSearch} go={go} exercises={exercises} />}
      {player && <PlayerModal item={player} onClose={() => setPlayer(null)} />}
    </div>
  );
}
