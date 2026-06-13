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
      boxShadow: {
        'custom': '0px 2.44px 9.75px 0px #00000014',
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
