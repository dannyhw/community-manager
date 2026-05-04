export type RnpEvent = {
  id: string;
  n: string;
  title: string;
  date: string;
  dow: string;
  time: string;
  venue: string;
  tags: string[];
  going: number;
  capacity: number;
  past?: boolean;
};

export const EVENTS: RnpEvent[] = [
  {
    id: 'e1', n: '#3', title: 'Reanimated 4, deep dive', date: 'Apr 30', dow: 'THU',
    time: '18:30', venue: 'Blip · Av. da Boavista',
    tags: ['talks', 'reanimated', 'animations'], going: 64, capacity: 80,
  },
  {
    id: 'e2', n: '#2', title: 'Brownfield Native at scale', date: 'Mar 26', dow: 'WED',
    time: '18:30', venue: 'Bloq · Rua de Cedofeita',
    tags: ['talks', 'brownfield', 'expo'], going: 72, capacity: 72, past: true,
  },
  {
    id: 'e3', n: '#1', title: 'Hello, Porto', date: 'Jan 29', dow: 'THU',
    time: '18:00', venue: 'Blip · Porto',
    tags: ['kickoff'], going: 88, capacity: 100, past: true,
  },
];

export type Talk = {
  id: string;
  title: string;
  speaker: string;
  role: string;
  initials: string;
  length: string;
  abstract: string;
  time: string;
};

export const TALKS: Talk[] = [
  {
    id: 't1', time: '19:00', title: 'Shared Element Transitions, demystified',
    speaker: 'Inês Almeida', role: 'Senior Engineer · Remote',
    initials: 'IA', length: '25 min',
    abstract:
      'A practical tour through Reanimated 4 shared transitions — when they replace navigation animations, when they fall short, and how to debug the worklet bridge.',
  },
  {
    id: 't2', time: '19:30', title: 'Native modules without the headache',
    speaker: 'Tomás Ribeiro', role: 'Mobile Lead · Blip',
    initials: 'TR', length: '20 min',
    abstract:
      'Codegen, TurboModules, JSI: cutting through the acronym soup with three real bridges we shipped this quarter.',
  },
  {
    id: 't3', time: '19:55', title: 'Lightning · Expo Router patterns',
    speaker: 'Marta Sá', role: 'Indie',
    initials: 'MS', length: '8 min',
    abstract: '',
  },
];

export type ScheduleItem = {
  time: string;
  dur: string;
  kind: 'Doors' | 'Talk' | 'Lightning' | 'Mingle';
  title: string;
  who?: string;
  initials?: string;
  faded?: boolean;
};

export const SCHEDULE: ScheduleItem[] = [
  { time: '18:30', dur: '30 min', kind: 'Doors', title: 'Welcome + pizza', faded: true },
  { time: '19:00', dur: '25 min', kind: 'Talk', title: 'Shared Element Transitions, demystified', who: 'Inês Almeida', initials: 'IA' },
  { time: '19:30', dur: '20 min', kind: 'Talk', title: 'Native modules without the headache', who: 'Tomás Ribeiro', initials: 'TR' },
  { time: '19:55', dur: '8 min', kind: 'Lightning', title: 'Expo Router patterns', who: 'Marta Sá', initials: 'MS' },
  { time: '20:10', dur: '50 min', kind: 'Mingle', title: 'Beers, hallway track', faded: true },
];

export type Person = { i: string; n: string; r: string; b?: 'Speaker' | 'Lightning' };

export const PEOPLE: Person[] = [
  { i: 'IA', n: 'Inês Almeida', r: 'Senior Engineer · Remote', b: 'Speaker' },
  { i: 'TR', n: 'Tomás Ribeiro', r: 'Mobile Lead · Blip', b: 'Speaker' },
  { i: 'MS', n: 'Marta Sá', r: 'Indie', b: 'Lightning' },
  { i: 'JC', n: 'João Carvalho', r: 'Frontend · OutSystems' },
  { i: 'RP', n: 'Rita Pinto', r: 'Eng Manager · Talkdesk' },
  { i: 'NF', n: 'Nuno Fernandes', r: 'Mobile · Farfetch' },
  { i: 'AB', n: 'Ana Brito', r: 'Designer · indie' },
  { i: 'DV', n: 'Diogo Veiga', r: 'CTO · early-stage' },
];
