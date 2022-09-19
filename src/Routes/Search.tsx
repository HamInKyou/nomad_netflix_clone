import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import {
  IGetMoviesResult,
  IGetTvsResult,
  searchMovies,
  searchTvs,
} from "../api";
import styled from "styled-components";
import { motion } from "framer-motion";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  padding-top: 100px;
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: movieSearchResult, isLoading: isMovieSearchLoading } =
    useQuery<IGetMoviesResult>(["movies", "searched", keyword], () =>
      searchMovies(keyword + "")
    );
  const { data: tvSearchResult, isLoading: isTvSearchLoading } =
    useQuery<IGetTvsResult>(["tvs", "searched", keyword], () =>
      searchTvs(keyword + "")
    );

  const loading = isMovieSearchLoading || isTvSearchLoading;
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {movieSearchResult && (
            <Slider
              data={movieSearchResult}
              title="영화 검색 결과"
              type="movie"
            />
          )}
          {tvSearchResult && (
            <Slider data={tvSearchResult} title="시리즈 검색 결과" type="tv" />
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Search;
