import "../css/dom.css";
import { useRecoilState } from "recoil";
import { StepState } from "../common/interfaces/StepState";
import { atomCrntStep } from "../atoms/atoms";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/all";

import { useEffect, useLayoutEffect, useRef } from "react";
import { stepToString } from "../common/utils/RandomColor";
import { setScroll } from "../common/utils/scrollData";
import { Box } from "@mui/material";
import { IDomProps } from "../common/interfaces/IDomProps";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

export default function Dom(props: IDomProps) {
  const [crntStep, setCrntstep] = useRecoilState<StepState>(atomCrntStep);
  const sectionWrapRef = useRef<HTMLDivElement>(null);

  const scrollY = props.scrollYDelta;

  useEffect(() => {
    if (sectionWrapRef.current) {
      sectionWrapRef.current.scrollTop += scrollY;
      setScroll(sectionWrapRef.current.scrollTop);
    }
  }, [scrollY]);

  useLayoutEffect(() => {
    gsap.timeline({
      scrollTrigger: {
        scroller: ".section-wrapper",
        trigger: ".section-01",

        end: "100% 70%",

        onEnter: () => {
          setCrntstep(StepState.STEP_1);
        },

        onEnterBack: () => {
          setCrntstep(StepState.STEP_1);
        },
        onLeave: () => {
          setCrntstep(StepState.STEP_1_AND_2);
        },
      },
    });

    gsap.timeline({
      scrollTrigger: {
        scroller: ".section-wrapper",
        trigger: ".section-02",

        start: "0% 0%",
        end: "100% 36%",

        onEnter: () => {
          setCrntstep(StepState.STEP_2);
          gsap.to(".typography-03", { opacity: 1, x: 0, duration: 3 });
          gsap.to(".section-box-02", { right: "10%", duration: 1.5 });
        },

        onEnterBack: () => {
          setCrntstep(StepState.STEP_2);
        },

        onLeaveBack: () => {
          setCrntstep(StepState.STEP_1_AND_2);
          gsap.to(".typography-03", { opacity: 0, x: 1, duration: 0.8 });
          gsap.to(".section-box-02", { right: "-50%", duration: 1.5 });
        },

        onLeave: () => {
          setCrntstep(StepState.STEP_3);
        },
      },
    });
  }, []);

  return (
    <>
      <div className="dom-wrapper">
        <div className="step-display">{stepToString(crntStep)}</div>
        <div className="section-wrapper" ref={sectionWrapRef}>
          <div className="section-01">
            <Box className="section-box-01">
              <p className="typography-01">Code Beyond Limits</p>
              <p className="typography-02">
                Dive into the depths of algorithms, debug like a pro, and maybe
                invent the next big thing—if your code compiles, that is. Master
                the art of turning coffee into code, navigate the maze of bugs,
                and remember: every great program starts with a single line of
                frustration.
              </p>
            </Box>
          </div>
          <div className="section-02"></div>
          <div className="section-03"></div>
        </div>
      </div>
    </>
  );
}
