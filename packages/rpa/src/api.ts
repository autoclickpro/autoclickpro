import { Base_API } from "./consts";
import type { Box, IconName, Word } from "./type";

async function processFormApi<T extends { list: (Box | Word)[] }>(
  obj: Record<string, any>,
  api: (formData: FormData) => Promise<Response>
) {
  const formData = new FormData();
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  const res = await api(formData);
  console.log("=>fetch", res.url);
  const json = await res.json();
  const { data, code, message } = json;
  if (code !== 0) {
    console.error(json);
    throw new Error(message);
  }
  console.log("data=", data);
  return data as T;
}

export async function findBoxByIcon(image: Buffer, iconName: IconName) {
  const obj = { name: iconName, image: new File([image], "image.png", { type: "image/png" }) };
  return processFormApi<{ list: Box[] }>(obj, async (formData: FormData) => {
    return fetch(`${Base_API}/findBoxByIcon`, {
      method: "POST",
      body: formData,
    });
  });
}
export async function findBoxByText(image: Buffer, text: string) {
  const obj = { text, image: new File([image], "image.png", { type: "image/png" }) };
  return processFormApi<{ list: Word[] }>(obj, (formData: FormData) =>
    fetch(`${Base_API}/findBoxByText`, {
      method: "POST",
      body: formData,
    })
  );
}

export async function findWords(image: Buffer) {
  const obj = { image: new File([image], "image.png", { type: "image/png" }) };
  return processFormApi<{ list: Word[] }>(obj, (formData: FormData) =>
    fetch(`${Base_API}/ocr`, {
      method: "POST",
      body: formData,
    })
  );
}

export { IconName };
