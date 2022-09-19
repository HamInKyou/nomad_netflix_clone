import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0; //기본적으로 안보이게
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3, //사이즈 키우기
    y: -80, //위로 올라가면서
    transition: {
      //hover했을 때만 transition 효과 주기, 마우스 치웠을 땐 transition효과 주지 않음
      delay: 0.2,
      duaration: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1, //호버하면 보이게!
    transition: {
      delay: 0.3,
      duaration: 0.1,
      type: "tween",
    },
  },
};

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
`;

const OFFSET = 6; //ROW 하나에 몇개의 박스가 들어갈지

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false); //현재 다음 스크롤로 넘어가는 이벤트가 진행중인지 알려주는 state
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1; //슬라이드에서 표현할 총 영화 수 (0번째 인덱스는 배너에 쓸거기 때문에 총 개수에서 뺀다.)
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1; //최대 Index 구하기, 반내림하여 모든 슬라이드가 비지 않게 했다.
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1)); //최대 인덱스면 다음으로 넘겼을 때 제일 처음으로 돌아오게
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev); //애니메이션 진행중에 increaseIndex 막기 위해서
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            onClick={incraseIndex}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            {/* initial = {false} -> 맨 처음에 렌더링될때도 애니메이션 적용되는거 막기 위해
            onExitComplete={toggleLeaving} -> 애니메이션 진행되는동안 다음 스크롤 땡겨오는 이벤트 막기 위해(onExitComplete는 exit 애니메이션 끝나고 실행하는 함수) */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1) //0번째 인덱스 제외하고 그 다음부터 (0번째는 배너에 사용)
                  .slice(OFFSET * index, OFFSET * index + OFFSET) //현재 인덱스에 맞는 6개만 가져오기
                  .map(
                    (
                      movie //가져온 6개로 렌더링하기
                    ) => (
                      <Box
                        layoutId={movie.id + ""}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        transition={{ type: "tween" }} //tween은 linear랑 같은 효과, 모든 애니메이션에 공통적으로 부여함!
                        key={movie.id}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        onClick={() => onBoxClicked(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    )
                  )}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }} //motionValue에 사칙연산 하려면 .get()한거에다 해야함!
                  layoutId={bigMovieMatch.params.movieId}
                >
                  hello
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
