export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e5e7eb',
        muted: '#64748b',
        surface: '#ffffff',
        soft: '#f8fafc',
        brand: '#2563eb'
      },
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
