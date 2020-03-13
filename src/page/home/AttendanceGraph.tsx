import React, { useRef, useEffect } from "react";
import { GlubEvent } from "state/models";
import * as d3 from "d3";
import { HoveredEvent } from "./Page";

interface AttendanceGraphProps {
  events: GlubEvent[];
  hover: (event: HoveredEvent) => void;
}

export const AttendanceGraph: React.FC<AttendanceGraphProps> = ({
  events, hov
}) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 20, bottom: 20, left: 24 };
  const width = 1200;
  const height = 400;

  useEffect(() => {
    if (!d3Container.current || !events.length) return;

    const svg = d3.select(d3Container.current);
    const tooltipBox = d3.select("#tooltip").attr("class", "hidden");

    // setup visual aesthetics
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "attendanceGradient")
      .attr("gradientTransform", "rotate(90)");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "lightgrey");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "darkgrey");

    // setup scales
    const x = d3.scaleTime().rangeRound([margin.left, width - margin.right]);
    const y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);
    x.domain(
      d3.extent(events, event => new Date(event.callTime)) as [Date, Date]
    );
    y.domain([0, 100]);

    // create axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(3));
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // draw the line between event grades
    const valueline = d3
      .line<{ callTime: number; partialScore: number }>()
      .x(event => x(event.callTime))
      .y(event => y(Math.max(0, event.partialScore)))
      .curve(d3.curveMonotoneX); //http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8
    svg
      .append("path")
      .datum([
        {
          callTime: events[0].callTime,
          partialScore: 0
        },
        ...events
          .filter(event => event.callTime < new Date().getTime())
          .map(event => ({
            callTime: event.callTime,
            partialScore: event.change!.partialScore
          })),
        {
          callTime: events[events.length - 1].callTime,
          partialScore: 0
        }
      ])
      .attr("class", "line")
      .attr("d", valueline);

    const circleSelect = svg
      .selectAll("circle")
      .data(events)
      .enter();
    circleSelect
      .append("circle")
      .attr("cx", event => x(event.callTime))
      .attr("cy", event => y(Math.max(event.change!.partialScore, 0)))
      .attr("r", 4)
      .attr("class", "attendanceDot")
      .attr("stroke-width", 3);
    circleSelect
      .append("circle")
      .attr("cx", event => x(event.callTime))
      .attr("cy", event => y(Math.max(event.change!.partialScore, 0)))
      .attr("r", 8)
      .attr("fill-opacity", "0")
      .on("mouseover touchdown", 
  }, [events, d3Container.current]);

  return <svg width={width} height={height} ref={d3Container} />;
};
