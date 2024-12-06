import { Box } from "@mui/material";
import "../css/dom.css";
import { ISecondText } from "../common/interfaces/ISecondText";

export default function SecondText(props: ISecondText) {
  return (
    <div
      className="second-text-div"
      onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
        //
        props.onWheel(e);
      }}
    >
      <Box className="section-box-02">
        <p className="typography-03">
          To become a great coder, you'll face countless challenges: the
          frustration of debugging endless errors, the struggle of mastering
          complex algorithms, and the overwhelming task of keeping up with
          rapidly evolving technologies.
          <br></br>
          <br></br>
          You'll wrestle with the temptation to give up when solutions don’t
          come easily, but each setback will teach you resilience and
          perseverance.
          <br></br>
          <br></br>
          The journey will demand patience as you learn to embrace failure as a
          stepping stone, and the constant quest for improvement will push you
          to refine your skills. Through every obstacle, you'll find that true
          mastery is built not on perfection, but on persistence and the courage
          to keep going.
        </p>
      </Box>
    </div>
  );
}
