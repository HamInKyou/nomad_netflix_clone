import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvsResult } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";

const StyledSlider = styled.div`
  height: 180px;
  margin-bottom: 50px;
`;

const SliderTitle = styled.h2`
  font-size: 34px;
  margin-bottom: 20px;
  padding-left: 50px;
`;

const SliderController = styled.button<{ isNext?: boolean }>`
  position: absolute;
  right: ${(props) => props.isNext && 0};
  width: 50px;
  height: 180px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 0;
  color: #ffffff;
  font-size: 30px;
  font-weight: 700;
  cursor: pointer;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: calc(100% - 100px);
  position: absolute;
  left: 50px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 180px;
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
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
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

interface ISliderProps {
  data: IGetMoviesResult | IGetTvsResult;
  title: string;
  type: string;
}

const OFFSET = 6;

function Slider({ data, title, type }: ISliderProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const incraseIndex = () => {
    setBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decraseIndex = () => {
    setBack(true);
    console.debug(index, leaving);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (id: number) => {
    if (type === "movie") {
      navigate(`/movies/${id}`);
      return;
    }
    if (type === "tv") {
      navigate(`/tv/${id}`);
    }
  };

  return (
    <>
      <SliderTitle>{title}</SliderTitle>
      <StyledSlider>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={back}
        >
          <SliderController onClick={decraseIndex}> &lt; </SliderController>
          <Row
            variants={rowVariants}
            custom={back}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(OFFSET * index, OFFSET * index + OFFSET)
              .map((item) => (
                <Box
                  layoutId={item.id + ""}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: "tween" }}
                  key={item.id}
                  bgphoto={makeImagePath(item.backdrop_path, "w500")}
                  onClick={() => onBoxClicked(item.id)}
                >
                  <Info variants={infoVariants}>
                    <h4>{type === "movie" && item.title}</h4>
                    <h4>{type === "tv" && item.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
          <SliderController isNext onClick={incraseIndex}>
            &gt;
          </SliderController>
        </AnimatePresence>
      </StyledSlider>
    </>
  );
}

export default Slider;
