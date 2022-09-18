/**
 *
 * @param {string} id 이미지의 아이디
 * @param {string} format 이미지의 타입 (original, w500 등등..)
 * @returns 이미지의 전체 경로를 반환.
 */
export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
