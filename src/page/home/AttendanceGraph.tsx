import React, { useRef } from "react";
import { GlubEvent } from "state/models";
import { XAxis, YAxis, XYPlot } from "react-vis";

export const AttendanceGraph: React.FC<{ events: GlubEvent[] }> = ({
  events
}) => {
  const d3Container = useRef<Element | null>(null);
  const margin = { top: 20, right: 20, bottom: 20, left: 24 };
  const width = 900;
  const height = 400;

  const eventData = events.map(event => ({
    x: new Date(event.callTime),
    y: event.change!.partialScore
  }));
  const eventDataWithBookends = [
    { ...eventData[0], y: 0 },
    ...eventData,
    { ...eventData[eventData.length - 1], y: 0 }
  ];

  return (
    <XYPlot width={width} height={height} data={eventData}>
      <XAxis />
      <YAxis />
    </XYPlot>
  );
};

// useEffect(
//   () => {
//     if (d3Container.current && events.length) {
//       const svg = d3.select(d3Container.current);

//       // setup visual aesthetics
//       const gradient = d3
//         .select("svg")
//         .append("defs")
//         .append("linearGradient")
//         .attr("id", "attendanceGradient")
//         .attr("gradientTransform", "rotate(90)");
//       gradient
//         .append("stop")
//         .attr("offset", "0%")
//         .attr("stop-color", "lightgrey");
//       gradient
//         .append("stop")
//         .attr("offset", "100%")
//         .attr("stop-color", "darkgrey");
//       const div = d3
//         .select("#tooltip")
//         .attr("class", "box")
//         .attr("class", "hidden");

//       // setup scales
//       var x = d3.scaleTime().rangeRound([margin.left, width - margin.right]);
//       var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);
//       x.domain(
//         d3.extent(events, event => new Date(event.callTime)) as [Date, Date]
//       );
//       y.domain([0, 100]);

//       svg
//         .append("g")
//         .attr("transform", "translate(0," + (height - margin.bottom) + ")")
//         .call(d3.axisBottom(x).ticks(3));
//       svg
//         .append("g")
//         .attr("transform", "translate(" + margin.left + ", 0)")
//         .call(d3.axisLeft(y));

//       var valueline = d3
//         .line()
//         .x(event => x(event.callTime))
//         .y(event => y(Math.max(0, event.partialScore)))
//         .curve(d3.curveMonotoneX); //http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8

//       events.unshift({
//         callTime: events[0].callTime,
//         partialScore: 0
//       });
//       events.push({
//         call: events[events.length - 1].call,
//         partialScore: 0
//       });
//       svg
//         .append("path")
//         .datum(events)
//         .attr("class", "line")
//         .attr("d", valueline);
//       events.shift();
//       events.pop();
//       var svgContainer = svg;
//       var circleSelect = svgContainer
//         .selectAll("circle")
//         .data(events)
//         .enter();
//       circleSelect
//         .append("circle")
//         .attr("cx", function(d) {
//           return x(d.call);
//         })
//         .attr("cy", function(d) {
//           if (d.partialScore > 0) return y(d.partialScore);
//           else return y(0);
//         })
//         .attr("r", function() {
//           return 4;
//         })
//         .attr("class", "attendanceDot")
//         .attr("stroke-width", 3);
//       circleSelect
//         .append("circle")
//         .attr("cx", function(d) {
//           return x(d.call);
//         })
//         .attr("cy", function(d) {
//           if (d.partialScore > 0) return y(d.partialScore);
//           else return y(0);
//         })
//         .attr("r", function() {
//           return 8;
//         })
//         .attr("fill-opacity", "0")
//         .on("mouseover touchdown", function(d) {
//           div.attr("class", "box shown");
//           div.append("p").html("<strong>" + d.name + "</strong>");
//           div.append("p").html(moment(d.call).format(this.dateFmtLong));
//           div
//             .append("p")
//             .html(
//               d.pointChange +
//                 " points <span v-else class='icon is-primary has-text-primary'><i class='fas fa-arrow-right'></i></span> " +
//                 d.partialScore +
//                 "%"
//             );
//           div.append("p").html("<em>" + d.explanation + "</em>");
//           div.attr(
//             "style",
//             "position:absolute;left:" +
//               d3.event.pageX +
//               "px;top:" +
//               d3.event.pageY +
//               "px;"
//           );
//         })
//         .on("mouseout touchup", function() {
//           div.attr("class", "hidden");
//           div.html("");
//         });
//     }

//       const svg = d3.select(d3Container.current);

//       // Bind D3 data
//       const update = svg
//         .append("g")
//         .selectAll("text")
//         .data(props.data);

//       // Enter new D3 elements
//       update
//         .enter()
//         .append("text")
//         .attr("x", (d, i) => i * 25)
//         .attr("y", 40)
//         .style("font-size", 24)
//         .text((d: number) => d);

//       // Update existing D3 elements
//       update.attr("x", (d, i) => i * 40).text((d: number) => d);

//       // Remove old D3 elements
//       update.exit().remove();
//     }
//   },
//   [events, d3Container.current]
// );
