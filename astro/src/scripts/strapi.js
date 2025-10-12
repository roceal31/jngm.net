const strapiUrl = import.meta.env.STRAPI_URL;
const token = import.meta.env.STRAPI_TOKEN;

export async function fetchArticles() {
  const apiUrl = `${strapiUrl}/api/articles?populate=*`;
  const response = await fetch(apiUrl);

  const { data } = await response.json();
  return data;
}

export async function fetchContent(contentType) {
    const apiUrl = `${strapiUrl}/api/${contentType}?populate=*`;
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const response = await fetch(
      apiUrl,
      { headers: headers }
    );

    const { data } = await response.json();
    return data;
}

export async function getRawBody(article) {
  var result = '';
  for(var block of article.blocks) {
    if(block.__component == 'shared.rich-text') {
      result += '\n' + block.body;
    }
  }
  return result;
}

export async function getImageUrl(image) {
  const imageUrl = `${strapiUrl}${image.url}`;
  console.log(imageUrl);
  return imageUrl;
}