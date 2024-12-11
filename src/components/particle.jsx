import React, { useEffect, useState, useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { loadImageShape } from "tsparticles-shape-image";

const Particle = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
    await loadImageShape(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#00000",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            rotate: {
              value: 0,
              random: true,
              direction: "clockwise",
              animation: {
                enable: true,
                speed: 10,
                sync: false,
              },
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: isMobile ? 35 : 80,
            },
            opacity: {
              value: 1,
            },
            shape: {
              character: [
                {
                  fill: true,
                  font: "Noto Sans KR",
                  style: "",
                  value: "안녕하세요 감사합니다 사랑 사람 친구 가족 오늘 내일 어제 학교 집 음식 물 시간 일 하다 가다 보다 먹다 있다 없다 좋아하다 많이 조금 여기 저기 누구 무엇 어떻게 왜".split(" "),
                  weight: "40",
                },
                {
                  fill: false,
                  font: "Noto Sans KR",
                  style: "",
                  value: "Hello Thank Love Person Friend Family Today Tomorrow Yesterday School".split(" "),
                  weight: "40",
                },
                {
                  fill: false,
                  font: "Noto Sans KR",
                  style: "",
                  value: "Привет Спасибо Любовь Человек Друг Семья Сегодня Завтра Вчера Школа".split(" "),
                  weight: "40",
                },
                {
                  fill: false,
                  font: "Noto Sans KR",
                  style: "",
                  value: "Merhaba Teşekkür Aşk İnsan Arkadaş Aile Bugün Yarın Dün Okul".split(" "),
                  weight: "40",
                },
              ],
              polygon: { nb_sides: 5 },
              stroke: { color: "random", width: 1 },
              type: "char",
            },
            size: {
              value: { min: 8, max: 10 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default Particle;
