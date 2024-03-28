import { cn } from "./utils/cn";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { gameConfig } from "./gameConfig";
import { useGameControl } from "./hooks/useGameControl";
import { useMusic } from "./hooks/useMusic";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import { SyncLoader } from "react-spinners";
import { ReadyState } from "react-use-websocket";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

function Button({ children, disabled = false, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "bg-white",
        "bg-opacity-40",
        "rounded-lg",
        "px-4",
        "py-2",
        "backdrop-blur-md",
        "transition-all",
        "duration-300",
        "ease-in-out",
        {
          "cursor-not-allowed": disabled,
        },
        "box-content",
        "text-[20px]"
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

function App() {
  const { load, isLoading, isReady, play: playMusic } = useGlobalAudioPlayer();

  useEffect(() => {
    load("./yellow-short.wav", {});
  }, []);

  const gameStartTimeRef = useRef(new Date().getTime());
  const { sortedTs, beats, beatMap } = useMusic();
  const {
    pressed,
    countHit,
    hasStarted,
    hasEnded,
    play,
    restart,
    reset,
    handleGameOver,
    wsReadyState,
  } = useGameControl({
    gameStartTimeRef,
    sortedTs,
    beats,
  });

  const isMusicLoading = isLoading || !isReady;
  const isWebSocketReady = wsReadyState !== ReadyState.OPEN;

  return (
    <div
      className={cn(
        "bg-transparent",
        "w-full",
        "h-[100svh]",
        "text-black",
        "text-[18px]",
        "flex",
        "justify-center",
        "items-center"
      )}
    >
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{
          position: "absolute",
          top: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%23ffcc73&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1.2&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uAmplitude=0&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
        />
      </ShaderGradientCanvas>
      {!hasStarted && !hasEnded ? (
        <div className="flex-col flex gap-4">
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => {
                play();
                playMusic();
              }}
              disabled={isMusicLoading || isWebSocketReady}
            >
              {isMusicLoading || isWebSocketReady ? (
                <SyncLoader color="#000000" size={8} />
              ) : (
                "play"
              )}
            </Button>
            <Button>calibrate</Button>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <div
              className={cn("w-3 h-3 rounded-full", {
                "bg-red-400": isMusicLoading,
                "bg-green-400": !isMusicLoading,
              })}
            />
            <div>{isMusicLoading ? "loading music..." : "music loaded"}</div>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <div
              className={cn("w-3 h-3 rounded-full", {
                "bg-red-400": isWebSocketReady,
                "bg-green-400": !isWebSocketReady,
              })}
            />
            <div>
              {isWebSocketReady
                ? "waiting for WebSocket connection..."
                : "WebSocket connected"}
            </div>
          </div>
        </div>
      ) : hasEnded ? (
        <div>
          Your score: {countHit} 🔥
          <div className="flex flex-row gap-4">
            <Button onClick={restart}>play again?</Button>
            <Button onClick={reset}>menu</Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "w-[50%]",
            "h-fit",
            // "bg-white",
            // "bg-opacity-10",
            "rounded-md",
            "p-4",
            // "backdrop-blur-md",
            "overflow-hidden"
          )}
        >
          Score: {countHit}
          <div className="overflow-hidden w-full h-[30px] rounded-full relative mt-4">
            <div
              className={cn(
                "absolute left-0 top-0 w-[30px] aspect-square bg-gradient-to-r from-transparent from-[50%]",

                "before:content-[''] before:absolute before:inset-[0px] before:bg-radial before:opacity-0",
                {
                  "to-gray-400": !pressed,
                  "to-red-500 before:opacity-100": pressed === "A",
                  "to-blue-500 before:opacity-100": pressed === "B",
                }
              )}
            />

            {Object.values(beatMap).map((b, idx) => (
              <motion.div
                key={idx}
                animate={{
                  x: [
                    "1250%",
                    "1125%",
                    "1000%",
                    "875%",
                    "750%",
                    "625%",
                    "500%",
                    "375%",
                    "250%",
                    "125%",
                    "0%",
                  ],
                  opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                }}
                onAnimationStart={() => {
                  if (idx === 0) {
                    gameStartTimeRef.current = new Date().getTime();
                  }
                }}
                onAnimationComplete={() => {
                  if (idx === Object.keys(beatMap).length - 1) {
                    setTimeout(() => {
                      handleGameOver();
                    }, gameConfig.gameOverDuration);
                  }
                }}
                transition={{
                  ease: "linear",
                  duration: gameConfig.showUpDuration / 1000,
                  delay: (b.ts - gameConfig.showUpDuration) / 1000,
                }}
                className={cn(
                  `w-[30px]`,
                  "aspect-square",
                  "rounded-full",
                  "absolute",
                  "left-0",
                  "top-0",
                  {
                    "bg-red-400": b.type === "A",
                    "bg-blue-400": b.type === "B",
                  }
                )}
              >
                {" "}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
