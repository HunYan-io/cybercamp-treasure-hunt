export interface Chip {
  id: number;
  name: string;
  description: string;
  image: string;
  coins: number;
}

export const chips: Chip[] = [
  {
    id: 0,
    name: "Unstrike",
    description:
      "Removes one strike. You can't use this if you have 0 strikes or if you have been eliminated.",
    coins: 500,
    image: "/images/unstrike.png",
  },
  {
    id: 1,
    name: "Time Freeze",
    description:
      "Freezes the countdowns for the current task. Note that you cannot buy this if you are gambling unless the countdown for task reward is over.",
    coins: 500,
    image: "/images/timefreeze.png",
  },
  {
    id: 2,
    name: "Hint",
    description:
      "Shows you a hint for the current task. You can only buy this once per task. You can view the hint again by clicking on the hint chip you bought in overview page.",
    coins: 500,
    image: "/images/hint.png",
  },
  {
    id: 3,
    name: "Unlimited Submits",
    description:
      "By buying this you can submit task flags without paying submission fees. You won't get a strike for every 5 wrong submissions either.",
    coins: 500,
    image: "/images/unlimitedsubmit.png",
  },
];
