"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Package, TrendingUp, Settings, ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/* System graph: Components → Dashboard → Controls                     */
/* Animated SVG paths + GSAP scroll-triggered pulse                    */
/* ------------------------------------------------------------------ */

const NODES = [
  {
    id: "components",
    label: "Components",
    sub: "Pin List · Palette · Toast",
    icon: Package,
    x: 10,
    y: 50,
    color: "#34d399",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    sub: "KPIs · Charts · Table",
    icon: TrendingUp,
    x: 50,
    y: 50,
    color: "#2dd4bf",
  },
  {
    id: "controls",
    label: "Controls",
    sub: "Settings · Config · Persist",
    icon: Settings,
    x: 90,
    y: 50,
    color: "#fbbf24",
  },
];

const CONNECTIONS = [
  { from: "components", to: "dashboard", label: "consumes" },
  { from: "dashboard", to: "controls", label: "configures" },
  { from: "controls", to: "dashboard", label: "persists" },
];

export default function SystemGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the connection lines drawing in on scroll
    const paths = containerRef.current?.querySelectorAll(".connection-line");
    paths?.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: false,
        },
      });
    });

    // Pulse the nodes
    const nodes = containerRef.current?.querySelectorAll(".system-node");
    nodes?.forEach((node, i) => {
      gsap.from(node, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: i * 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      <svg viewBox="0 0 100 60" className="w-full" style={{ minHeight: "240px" }} preserveAspectRatio="xMidYMid meet">
        {/* Connection lines */}
        {CONNECTIONS.map((conn, i) => {
          const from = NODES.find((n) => n.id === conn.from)!;
          const to = NODES.find((n) => n.id === conn.to)!;
          const midX = (from.x + to.x) / 2;
          const arcY = i === 2 ? 70 : 30; // controls→dashboard arcs below
          return (
            <g key={i}>
              <path
                className="connection-line"
                d={`M ${from.x} ${from.y} Q ${midX} ${arcY} ${to.x} ${to.y}`}
                fill="none"
                stroke={to.color}
                strokeWidth={0.4}
                opacity={0.6}
              />
              {/* label */}
              <text
                x={midX}
                y={arcY + (i === 2 ? 4 : -3)}
                textAnchor="middle"
                fontSize={2}
                fill="#64748B"
                className="font-mono"
              >
                {conn.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => (
          <g key={node.id} className="system-node" style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
            <circle
              cx={node.x}
              cy={node.y}
              r={5}
              fill={node.color}
              opacity={0.15}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={3}
              fill={node.color}
              opacity={0.4}
            />
            <text
              x={node.x}
              y={node.y + 9}
              textAnchor="middle"
              fontSize={2.5}
              fill="#F8FAFC"
              className="font-semibold"
            >
              {node.label}
            </text>
            <text
              x={node.x}
              y={node.y + 12}
              textAnchor="middle"
              fontSize={1.5}
              fill="#64748B"
            >
              {node.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
