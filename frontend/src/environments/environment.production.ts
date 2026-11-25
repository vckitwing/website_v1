export const environment = {
  production: true,
  // Production: the public address of the R2 media bucket, e.g. 'https://media.<domain>/content.json'.
  // Until that exists this relative address 404s and the site uses its built-in content.
  contentUrl: 'content.json'
};
