export default async function fetchTranslate(
  langFrom: string,
  text: string,
): Promise<string> {
  if (!text.trim()) return "";

  const response = await fetch("http://100.89.93.93:8000/translate");

  if (!response.ok) throw new Error("Server request error, try again..");

  const data = await response.json();

  if (data.result !== "success")
    throw new Error(`Error: ${data["error-type"]}`);

  return data.ApiUnknownWithTranslate;
}
