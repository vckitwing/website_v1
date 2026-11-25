export const environment = {
  production: false,
  // Published History + Conferences, as a static file from object storage. Locally the API serves the storage folder
  // (Object_Storage_Data) at /media; in production this is the R2 media bucket (see docs/hosting-plan.md).
  contentUrl: 'http://localhost:8000/media/content.json'
};
