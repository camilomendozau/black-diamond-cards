import type { UUIDTypes } from "uuid";

//let cache: any = null;
export let idRef: string | null = null;

export async function getDatos(userCode: string) {
  idRef = userCode;

  const res = await fetch(`http://localhost:8000/dashboard/prospect-page-config/${idRef}`);
  return await res.json();
}

// export async function getDatos(userCode: string) {
//   idRef = userCode;
//   if (cache) return cache;

//   const res = await fetch(`http://localhost:8000/dashboard/prospect-page-config/${idRef}`);
//   cache = await res.json();
//   return cache;
// }