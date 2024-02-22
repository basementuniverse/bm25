import Corpus from '.';

const documents = [
  `To be, or not to be: that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles,
And by opposing end them. To die: to sleep;`,

  `This above all: to thine own self be true,
And it must follow, as the night the day,
Thou canst not then be false to any man.`,

  `Life's but a walking shadow, a poor player
That struts and frets his hour upon the stage,
And then is heard no more. It is a tale
Told by an idiot, full of sound and fury,
Signifying nothing.`,

  `Moderate lamentation is the right of the dead,
excessive grief the enemy to the living.`,

  `Love all, trust a few,
Do wrong to none: be able for thine enemy
Rather in power than use, and keep thy friend
Under thy own life's key: be cheque'd for silence,
But never tax'd for speech.`,

  `There are more things in heaven and earth, Horatio,
Than are dreamt of in your philosophy.`,

  `Cowards die many times before their deaths;
The valiant never taste of death but once.`,

  `Men at some time are masters of their fates:
The fault, dear Brutus, is not in our stars,
But in ourselves, that we are underlings.`,

  `My words fly up, my thoughts remain below:
Words without thoughts never to heaven go.`,

  `Young men's love then lies
Not truly in their hearts, but in their eyes.`,

  `By all the vows that ever men have broke,
In number more than ever women spoke`,

  `Ay me, for aught that I could ever read,
Could ever hear by tale or history,
The course of true love never did run smooth,
But either it was different in blood—`,

  `...be not afraid of greatness.
Some are born great, some achieve greatness,
and some have greatness thrust upon 'em.`,

  `Love looks not with the eyes, but with the mind,
And therefore is wing'd Cupid painted blind.`,

  `We are such stuff
As dreams are made on, and our little life
Is rounded with a sleep.`,

  `Our doubts are traitors,
And make us lose the good we oft might win
By fearing to attempt.`,
];

const corpus1 = new Corpus(documents);

const corpus2 = new Corpus(
  [
    {
      id: '1234',
      name: 'John Doe',
    },
    {
      id: '2345',
      name: 'Jane Doe',
    },
    {
      id: '3456',
      name: 'John Smith',
    },
    {
      id: '4567',
      name: 'Jane Smith',
    },
    {
      id: '5678',
      name: 'John Baker',
    },
    {
      id: '6789',
      name: 'Jane Baker',
    },
    {
      id: '7890',
      name: 'John Jones',
    },
    {
      id: '8901',
      name: 'Jane Jones',
    },
  ],
  {
    processor: document => [document.id, ...document.name.toLowerCase().split(' ')],
  },
);

test('Search for a moderately common term', () => {
  const results = corpus1.search('love');

  expect(results.length).toBe(4);
  expect(results[0].score).toBeCloseTo(1.555, 2);
  expect(results[1].score).toBeCloseTo(1.390, 2);
  expect(results[2].score).toBeCloseTo(1.147, 2);
  expect(results[3].score).toBeCloseTo(0.994, 2);
});

test('Search for a common term with partial term matching', () => {
  const results = corpus1.search('the', true);

  expect(results.length).toBe(13);
  for (const result of results) {
    expect(result.score).toBeLessThan(0.5);
  }
});

test('Search for an uncommon term', () => {
  const results = corpus1.search('philosophy');

  expect(results.length).toBe(1);
  expect(results[0].score).toBeCloseTo(2.760130);
});

test('Search a list of objects using a custom processor', () => {
  const results = corpus2.search('baker');

  expect(results.length).toBe(2);
  expect(results[0].score).toBeCloseTo(1.280, 2);
  expect(results[0].document.id).toBe('5678');
  expect(results[1].score).toBeCloseTo(1.280, 2);
  expect(results[1].document.id).toBe('6789');
});
