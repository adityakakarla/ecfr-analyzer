'use server'

export async function getSectionData(title: string) {
  const sectionDataURL = 'https://www.ecfr.gov/api/versioner/v1/versions/title-' + title + '.json';
  const response = await fetch(sectionDataURL);
  const sectionData = await response.json();
  return sectionData;
}

export async function getAgencyData() {
  const agencyDataURL = 'https://www.ecfr.gov/api/admin/v1/agencies.json';
  const agencyResponse = await fetch(agencyDataURL);
  const agencyData = await agencyResponse.json();
  return agencyData;
}

export async function getFullTitleData(title: string, date: string) {
  const fullTitleURL = 'https://www.ecfr.gov/api/versioner/v1/structure/' + date + '/title-' + title + '.json';
  const fullTitleResponse = await fetch(fullTitleURL);
  const fullTitleData = await fullTitleResponse.json();
  return fullTitleData;
}

export async function getTitles(){
    const url = 'https://www.ecfr.gov/api/versioner/v1/titles.json';
    const response = await fetch(url);
    const data = await response.json();
    return data;
}