import { useQuery } from "@tanstack/react-query";
import {
  getAiringTodayTvs,
  getPopularTvs,
  getTopRatedTvs,
  getTvDetail,
  IGetTvsResult,
  ITv,
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
  height: 80vh;
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

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

function Tv() {
  const navigate = useNavigate();
  const bigTVMatch: PathMatch<string> | null = useMatch("/tv/:tvId");
  const { scrollY } = useScroll();
  const { data: airingTodayTvs, isLoading: isAiringTodayTvsLoading } =
    useQuery<IGetTvsResult>(["tvs", "airingToday"], getAiringTodayTvs);
  const { data: popularTvs, isLoading: isPopularTvsLoading } =
    useQuery<IGetTvsResult>(["tvs", "popular"], getPopularTvs);
  const { data: topRatedTvs, isLoading: isTopRatedTvsLoading } =
    useQuery<IGetTvsResult>(["tvs", "topRated"], getTopRatedTvs);
  const { data: tvData } = useQuery<ITv>(["tv", bigTVMatch?.params.tvId], () =>
    getTvDetail(bigTVMatch?.params.tvId)
  );
  const loading =
    isAiringTodayTvsLoading || isPopularTvsLoading || isTopRatedTvsLoading;

  const onOverlayClick = () => navigate("/tv");
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              airingTodayTvs?.results[0]?.backdrop_path || ""
            )}
          >
            <Title>{airingTodayTvs?.results[0]?.name}</Title>
            <Overview>{airingTodayTvs?.results[0]?.overview}</Overview>
          </Banner>
          <UnderBanner>
            {airingTodayTvs && (
              <Slider
                data={airingTodayTvs}
                title="현재 방영중인 시리즈"
                type="tv"
              />
            )}
            {popularTvs && (
              <Slider data={popularTvs} title="인기 많은 시리즈" type="tv" />
            )}
            {topRatedTvs && (
              <Slider data={topRatedTvs} title="평점 높은 시리즈" type="tv" />
            )}
          </UnderBanner>
          <AnimatePresence>
            {bigTVMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }} //motionValue에 사칙연산 하려면 .get()한거에다 해야함!
                  layoutId={bigTVMatch.params.tvId}
                >
                  {tvData && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            tvData.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{tvData.name}</BigTitle>
                      <BigOverview>{tvData.overview}</BigOverview>
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
export default Tv;
