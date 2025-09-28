export const formatJSONResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
