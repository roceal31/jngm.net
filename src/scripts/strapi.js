const strapiUrl = import.meta.env.STRAPI_URL;

export async function fetchArticles() {
  const apiUrl = `${strapiUrl}/api/articles?populate=*`;
  const response = await fetch(apiUrl);

  const { data } = await response.json();
  return data;
}