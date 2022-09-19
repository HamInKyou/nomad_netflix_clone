const API_KEY = "9b51164e719afc8e35930fd6b08e09c9";
const BASE_PATH = "https://api.themoviedb.org/3";

interface genre {
  id: number;
  name: string;
}

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
  tagline?: string;
  genres?: genre[];
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  title?: string;
  name: string;
  overview: string;
}

export interface IGetTvsResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getMovieDetail(movieId: string | undefined) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getAiringTodayTvs() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getPopularTvs() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getTopRatedTvs() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function getTvDetail(tvId: string | undefined) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function searchMovies(keyword: string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&language=ko-KR&region=kr
`).then((response) => response.json());
}

export function searchTvs(keyword: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}&language=ko-KR&region=kr
`).then((response) => response.json());
}
