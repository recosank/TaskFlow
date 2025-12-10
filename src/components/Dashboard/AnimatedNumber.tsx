import React from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

export default function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  React.useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.9,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, motionVal]);

  const [display, setDisplay] = React.useState<number>(0);
  React.useEffect(() => {
    const unsub = rounded.onChange((v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return <span>{display}</span>;
}
