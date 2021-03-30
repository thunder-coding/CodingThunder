module.exports = {
  poweredByHeader: false,
  async redirects() {
    return [
      /* Social Links */
      {
        source: '/github',
        destination: 'https://github.com/thunder-coding',
        permanent: true,
      },
      {
        source: '/codepen',
        destination: 'https://codepen.io/thunder-coding',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/CodingThunder',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://linkedin.com/in/CodingThunder',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/YMhxGjzsJ8',
        permanent: true,
      },
    ];
  },
};