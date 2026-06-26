/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3D5240',
          light:   '#E2EAE0',
          mid:     '#7A9478',
          dark:    '#263529',
        },
        green: {
          primary: '#3D5240',
          light:   '#E2EAE0',
          mid:     '#BDC9B6',
        },
        water:    '#3D5240',
        sleep:    '#3D5240',
        activity: '#3D5240',
        stone:    '#E4E7DF',
        bg:       '#EFF0EB',
      },
      fontFamily: {
        serif: ['"Philosopher"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        sm:   '10px',
        pill: '99px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,28,22,.04), 0 3px 12px rgba(20,28,22,.07)',
      },
    },
  },
  plugins: [],
}
