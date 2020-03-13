import React, { useRef, useEffect } from "react";
import { GlubEvent } from "state/models";
import * as d3 from "d3";

export const ThisWeek: React.FC<{ events: GlubEvent[] }> = ({ events }) => {
  const d3Container = useRef<React.RefObject<SVGSVGElement> | null>(null);

  const height = 500;
  const circleX = 100;
  const circleRadius = 9;
  const circleLineWidth = 2;
  const timelineLineWidth = 5;

  // this needs to go from monday to sunday
  const now = new Date();
  const monday = d3.timeMonday(now);
  const sunday = new Date(monday.getTime() + 7 * 86400000 - 1);

  useEffect(() => {
    console.log("d3 container", d3Container);

    const timeline = d3.select(d3Container.current?.current || null);

    const y = d3.scaleTime().range([height - 20, 10]);
    y.domain([sunday, monday]);

    timeline
      .append("g")
      .attr("transform", "translate(" + (circleX - 1) + ",0)")
      .call(
        d3
          .axisLeft(y)
          .ticks(7)
          .tickFormat(date => d3.timeFormat("%a")(date as Date))
          .tickSizeOuter(0)
      );

    const tooCloseToPrevious = (event: GlubEvent, index: number) =>
      index && y(event.callTime) - y(events[index - 1].callTime) <= 20;

    // do something neat when an event is now
    timeline
      .selectAll("circle")
      .data(events)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cy", (event, index) =>
        tooCloseToPrevious(event, index) ? -1 * circleRadius : y(event.callTime)
      )
      .attr("cx", circleX)
      .attr("r", circleRadius)
      .attr("stroke-width", circleLineWidth);

    timeline
      .append("circle")
      .attr("class", "dot now")
      .attr("cy", y(now))
      .attr("cx", circleX - 0.5)
      .attr("r", timelineLineWidth / 2);

    timeline
      .selectAll("p")
      .data(events)
      .enter()
      .append("a")
      .attr("href", event => `/#/events/${event.id}`)
      .append("text")
      .text(event => event.name)
      .attr("y", (event, index) => {
        if (tooCloseToPrevious(event, index)) {
          return y(events[index - 1].callTime) + 16 + circleRadius / 2.0;
        } else {
          return y(event.callTime) + circleRadius / 2.0;
        }
      })
      .attr("x", circleX + 15);
  }, [events, d3Container.current]);

  return <svg height={height} ref={d3Container.current} />;
};
