const availableFeatures = new Set([
  // Migrations
  "read:migrations",
  "create:migrations",

  // Sessions
  "read:session",
]);

export default Object.freeze(availableFeatures);
