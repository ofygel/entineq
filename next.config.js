/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 15: typedRoutes больше не в experimental
  typedRoutes: true,

  // (опционально) — если у тебя есть собственный CSP в middleware, оставь как есть.
  // headers: async () => ([
  //   { source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] }
  // ]),
};

module.exports = nextConfig;
