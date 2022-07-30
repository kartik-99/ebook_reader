export const feedbackUrl = 'https://forms.gle/pajSJd5iyNZ8dCU6A';
export const primaryColor = '#0f2439';
export const contrastColor = '#000000';
export const coverColours = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
  '#e67e22',
  '#e74c3c',
  '#95a5a6',
  '#f39c12',
  '#d35400',
  '#c0392b',
  '#7f8c8d',
];

export const highlightColours = [
  '#2ecc71',
  '#3498db',
  '#16a085',
  '#8e44ad',
  '#f39c12',
  '#c0392b',
];

export const settings = [
  {
    id: 'bg',
    text: 'Theme',
    title: 'Choose theme',
    items: [
      {label: 'Light', value: '#fafafa'},
      {label: 'Dark', value: '#121212'},
      {label: 'Classic', value: '#f8f1e3'},
      {label: 'Silver', value: '#bebebe'},
      {label: 'Grey', value: '#5a5a5c'},
    ],
  },
  {
    id: 'size',
    text: 'Font Size',
    title: 'Choose font size',
    items: [
      {label: '15', value: '15px'},
      {label: '16', value: '16px'},
      {label: '17', value: '17px'},
      {label: '18', value: '18px'},
      {label: '19', value: '19px'},
      {label: '20', value: '20px'},
      {label: '21', value: '21px'},
      {label: '22', value: '22px'},
      {label: '23', value: '23px'},
      {label: '24', value: '24px'},
    ],
  },
  {
    id: 'height',
    text: 'Line Height',
    title: 'Choose line height',
    items: [
      {label: '1.4', value: 1.4},
      {label: '1.6', value: 1.6},
      {label: '1.8', value: 1.8},
      {label: '2.0', value: 2.0},
      {label: '2.2', value: 2.2},
      {label: '2.4', value: 2.4},
    ],
  },
];

export const targets = {
  daily: [
    {
      name: '15 Minutes',
      mins: 15,
      caption: "Don't know if I will even get the time...",
    },
    {name: '30 Minutes', mins: 30, caption: "Let's start off small!"},
    {
      name: '45 Minutes',
      mins: 45,
      caption: 'I want to make reading a habit :)',
    },
    {name: '1 Hour', mins: 60, caption: 'I am serious about this decision'},
    {
      name: '1.5 Hours',
      mins: 90,
      caption: 'I love reading, and already have a habit',
    },
    {name: '2 Hours', mins: 180, caption: 'I read a book a day!'},
  ],
  monthly: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export const monthName = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sept',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};
