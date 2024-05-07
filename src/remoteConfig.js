// @ts-check

export async function getConfig(remoteUrl) {
  // fetch the schema from the remoteUrl

  const response = await fetch(remoteUrl);
  const schema = await response.text();
}
