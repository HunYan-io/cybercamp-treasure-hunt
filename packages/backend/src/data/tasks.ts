export interface Task {
  id: number;
  title: string;
  description: string;
  coins: number;
  flag: string;
  duration: number;
  image?: string;
  audio?: string;
}

export const tasks: Task[] = [
  {
    id: 0,
    title: "Signup to Treasure Hunt",
    description: "Welcome to Treasure Hunt!",
    coins: 100,
    flag: "UNDEFINED",
    duration: 1000 * 60 * 1, // 8 minutes
  },
  {
    id: 1,
    title: "ready,set go",
    description: "Let the hunt begin!",
    coins: 100,
    flag: "let's start",
    duration: 1000 * 60 * 8, // 8 minutes
    image: "/images/task1.png",
  },
  {
    id: 2,
    title: "the ring's origin",
    description: "Romans made a god for everything, even security",
    coins: 200,
    flag: "Vindolanda",
    duration: 1000 * 60 * 8, // 10 minutes
  },

  {
    id: 3,
    title: "215.115.215.119",
    description: "it is about time to ask this question.",
    coins: 300,
    flag: "isitchristmas.com",
    duration: 1000 * 60 * 15, // 15 minutes
  },

  {
    id: 4,
    title: "7:48 / 10:50",
    description:
      "even a stopped clock is right twice a day\n Note: the flag format is {--.--,--.--}",
    coins: 350,
    flag: "{04.48,07.50}",
    duration: 1000 * 60 * 30, // 30 minutes
  },

  {
    id: 5,
    title: "ekko",
    description:
      "It's not about how much time you have, it's how you use it. 🕛🥶\n Note: the flag format is without a comma and is only 5 characters long",
    coins: 300,
    flag: "47678",
    duration: 1000 * 60 * 25, // 25 minutes
  },

  {
    id: 6,
    title: "3odd_nen",
    description: '"elon musk buying twitter made life easier" (@el3odnen)',
    coins: 300,
    flag: "u've earned the samurai title",
    duration: 1000 * 60 * 18, // 10 minutes
  },

  {
    id: 7,
    title: "rip in peace",
    description:
      "20:3 20:12 20:16 \n Note: The flag is a date in the format **-**-****", //el audio mtaa l morse code
    coins: 500,
    flag: "08-09-2022", //it's a date be tolerate if you can or hint the format
    duration: 1000 * 60 * 30, // 30 minutes
    audio: "/audio/task7.wav",
  },
];
