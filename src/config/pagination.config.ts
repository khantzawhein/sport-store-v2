export default () => ({
  perPage: parseInt(process.env.PER_PAGE, 10) || 10,
});
