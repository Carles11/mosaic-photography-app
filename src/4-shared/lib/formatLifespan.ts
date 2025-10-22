export function formatLifespan(
  birthdate?: string,
  deceasedate?: string
): string {
  const birth = birthdate ? birthdate.split("-")[0] : "";
  const death = deceasedate ? deceasedate.split("-")[0] : "";
  if (birth && death) return `${birth}–${death}`;
  if (birth) return `${birth}–`;
  return "";
}
