import { useQuery } from "@tanstack/react-query";
import {
  getMovieDetail,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IMovie,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { PathMatch, useNavigate, useMatch } from "react-router-dom";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const UnderBanner = styled.div`
  position: relative;
  top: -150px;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  min-height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigTagline = styled.p`
  position: relative;
  padding: 0 20px;
  top: -80px;
  font-weight: 100;
  font-style: italic;
  color: ${(props) => props.theme.white.darker};
`;
const BigOverview = styled.p`
  padding: 5px 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigGenres = styled.div`
  padding: 5px 20px;
  position: relative;
  top: -80px;
`;

const GenreBox = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data: nowPlayingMovies, isLoading: isNowPlayingMoviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlayingMovies);
  const { data: topRatedMovies, isLoading: isTopRatedMoviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "topLated"], getTopRatedMovies);
  const { data: upcomingMovies, isLoading: isUpcomingMoviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);
  const { data: movieData } = useQuery<IMovie>(
    ["movie", bigMovieMatch?.params.movieId],
    () => getMovieDetail(bigMovieMatch?.params.movieId)
  );
  const loading =
    isNowPlayingMoviesLoading ||
    isTopRatedMoviesLoading ||
    isUpcomingMoviesLoading;

  const onOverlayClick = () => navigate("/");
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              nowPlayingMovies?.results[0]?.backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMovies?.results[0]?.title}</Title>
            <Overview>{nowPlayingMovies?.results[0]?.overview}</Overview>
          </Banner>
          <UnderBanner>
            {nowPlayingMovies && (
              <Slider
                data={nowPlayingMovies}
                title="?????? ???????????? ??????"
                type="movie"
              />
            )}
            {topRatedMovies && (
              <Slider
                data={topRatedMovies}
                title="?????? ?????? ??????"
                type="movie"
              />
            )}
            {upcomingMovies && (
              <Slider
                data={upcomingMovies}
                title="?????? ?????? ??????"
                type="movie"
              />
            )}
          </UnderBanner>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }} //motionValue??? ???????????? ????????? .get()???????????? ?????????!
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {movieData && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            movieData.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{movieData.title}</BigTitle>
                      <BigTagline>{movieData.tagline}</BigTagline>
                      <BigOverview>{movieData.overview}</BigOverview>
                      <BigGenres>
                        {movieData.genres?.map((genre) => (
                          <GenreBox>{genre.name}</GenreBox>
                        ))}
                      </BigGenres>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
