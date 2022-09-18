import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";

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

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
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

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
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

const OFFSET = 6; //ROW 하나에 몇개의 박스가 들어갈지

function Home() {
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
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
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
                        key={movie.id}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      />
                    )
                  )}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
