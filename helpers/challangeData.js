const challenges = [
  {
    desc2: "3 Levels",
    title: "5 Kilometers",
    desc: "Complete this challenge to receive the 5k badge.",
    image: require("../assets/images/test4.png"),
    badge: 'fiveK',
    badgeText: '5K BADGE',
    levels: [
      { level: 1, distance: 200, isCompleted: false, isLocked: false },
      { level: 2, distance: 10, isCompleted: false, isLocked: true },
      { level: 3, distance: 10, isCompleted: false, isLocked: true }
    ]
  },
  {
    desc2: "3 Levels",
    title: "10 Kilometers",
    desc: "Complete this challenge to receive the 10k badge.",
    image: require("../assets/images/test2.png"),
    badge: 'tenK',
    badgeText: '10K BADGE',
    levels: [
      { level: 1, distance: 5000, isCompleted: false, isLocked: false },
      { level: 2, distance: 8000, isCompleted: false, isLocked: true },
      { level: 3, distance: 10000, isCompleted: false, isLocked: true }
    ]
  },
  {
    desc2: "2 Levels",
    title: "15 Kilometers",
    desc: "Complete this challenge to receive the 15k badge.",
    image: require("../assets/images/test3.png"),
    badge: 'fifteenK',
    badgeText: '15K BADGE',
    levels: [
      { level: 1, distance: 10000, isCompleted: false, isLocked: false },
      { level: 2, distance: 15000, isCompleted: false, isLocked: true }
    ]
  },
  {
    desc2: "1 Level",
    title: "20 Kilometers",
    desc: "Complete this challenge to receive the 20k badge.",
    image: require("../assets/images/test.png"),
    badge: 'twentyK',
    badgeText: '20K BADGE',
    levels: [
      { level: 1, distance: 20000, isCompleted: false, isLocked: false },
    ]
  },
];

export default challenges;
