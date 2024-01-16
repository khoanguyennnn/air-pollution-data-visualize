import { useEffect } from "react";
import * as d3 from "d3";
import data from '../assets/emissions-of-air-pollutants-oecd.csv';
import d3Tip from "d3-tip";

function Linechart() {
    useEffect(() => {
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 90, left: 60 },
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page

        const svg = d3.select(".Linechart-wrapper")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        // Label
        svg
            .append("text")
            .text(
                "Emissions by country from 1990 to 2015"
            )
            .attr("class", "Axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 70)
            .attr("font-weight", "bold")
            .attr("font-size", 14);

        //Tooltip div
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")

        //Read the data
        d3.csv(data).then(function (data) {
            // List of groups (here I have one group per column)
            const allGroup = new Set(data.map(d => d.Entity))
            // add the options to the button
            d3.select("#selectButton")
                .selectAll('myOptions')
                .data(allGroup)
                .enter()
                .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return d; }) // corresponding value returned by the button

            // A color scale: one color for each group
            const myColor = d3.scaleOrdinal()
                .domain(allGroup)
                .range(d3.schemeSet2);

            // Add X axis --> it is a date format
            const x = d3.scaleLinear()
                .domain([1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
                    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
                    2010, 2011, 2012, 2013, 2014, 2015])
                .range([0, width / 26]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(7));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.Carbon; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Initialize line with first group of the list
            const line = svg
                .append('g')
                .append("path")
                .datum(data.filter(function (d) { return d.Entity == "Australia" }))
                .attr("d", d3.line()
                    .x(function (d) { return x(d.Year) })
                    .y(function (d) { return y(+d.Carbon) })
                )
                .attr("stroke", function (d) { return myColor("valueA") })
                .style("stroke-width", 4)
                .style("fill", "none")

            const line1 = svg
                .append('g')
                .append("path")
                .datum(data.filter(function (d) { return d.Entity == "Australia" }))
                .attr("d", d3.line()
                    .x(function (d) { return x(d.Year) })
                    .y(function (d) { return y(+d.SO2) })
                )
                .attr("stroke", function (d) { return myColor("valueB") })
                .style("stroke-width", 4)
                .style("fill", "none")

            const line2 = svg
                .append('g')
                .append("path")
                .datum(data.filter(function (d) { return d.Entity == "Australia" }))
                .attr("d", d3.line()
                    .x(function (d) { return x(d.Year) })
                    .y(function (d) { return y(+d.NOx) })
                )
                .attr("stroke", function (d) { return myColor("valueC") })
                .style("stroke-width", 4)
                .style("fill", "none")

            onToolTip("Australia");

            function onToolTip(selectedGroup) {
                const circle = svg.append("circle")
                    .attr("r", 0)
                    .attr("fill", "steelblue")
                    .style("stroke", "white")
                    .attr("opacity", .70)
                    .style("pointer-events", "none")

                const circle2 = svg.append("circle")
                    .attr("r", 0)
                    .attr("fill", "steelblue")
                    .style("stroke", "white")
                    .attr("opacity", .70)
                    .style("pointer-events", "none")

                const circle3 = svg.append("circle")
                    .attr("r", 0)
                    .attr("fill", "steelblue")
                    .style("stroke", "white")
                    .attr("opacity", .70)
                    .style("pointer-events", "none")

                const listeningRect = svg.append("rect")
                    .attr('width', width)
                    .attr('height', height)
                    .style('pointer-event', "all")
                    .style('fill-opacity', 0)
                    .style('stroke-opacity', 0)
                    .style('z-index', 1);

                listeningRect.on("mousemove", function (event) {
                    const [xCoord] = d3.pointer(event, this);
                    const bisectYear = d3.bisector(d => d.Year).left;
                    const x0 = x.invert(xCoord)
                    const i = bisectYear(data.filter(function (d) { return d.Entity == selectedGroup }), x0, 1);
                    const d0 = data.filter(function (d) { return d.Entity == selectedGroup })[i - 1];
                    const d1 = data.filter(function (d) { return d.Entity == selectedGroup })[i];
                    const d = x0 - d0?.Year > d1?.Year - x0 ? d1 : d0;
                    const xPos = x(d.Year);
                    const yPos = y(d.Carbon);
                    const yPos2 = y(d.NOx);
                    const yPos3 = y(d.SO2);
                    circle
                        .attr("cx", xPos)
                        .attr("cy", yPos);
                    circle2
                        .attr("cx", xPos)
                        .attr("cy", yPos2);
                    circle3
                        .attr("cx", xPos)
                        .attr("cy", yPos3);

                    circle.transition()
                        .duration(50)
                        .attr("r", 5);

                    circle2.transition()
                        .duration(50)
                        .attr("r", 5);

                    circle3.transition()
                        .duration(50)
                        .attr("r", 5);

                    tooltip.style("display", "block")
                        .html(`
                    <strong>Year: ${d.Year}<strong/> 
                    <p>Carbon: ${d.Carbon}<p/> 
                    <p>NOx: ${d.NOx}<p/> 
                    <p>SO2: ${d.SO2}<p/> 
                    `)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY + 10) + "px")
                        .transition()
                        .duration(200)
                        .style("opacity", .9);


                })

                listeningRect.on("mouseleave", function () {
                    circle.transition()
                        .duration(50)
                        .attr("r", 0);

                    circle2.transition()
                        .duration(50)
                        .attr("r", 0);

                    circle3.transition()
                        .duration(50)
                        .attr("r", 0);

                    tooltip.style("display", "none");
                })
            }

            function update(selectedGroup) {

                // Create new data with the selection?
                const dataFilter = data.filter(function (d) { return d.Entity == selectedGroup })

                // Give these new data to update line
                line
                    .datum(dataFilter)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.Year) })
                        .y(function (d) { return y(+d.Carbon) })
                    )
                    .attr("stroke", function (d) { return myColor("valueA") })

                line1
                    .datum(dataFilter)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.Year) })
                        .y(function (d) { return y(+d.SO2) })
                    )
                    .attr("stroke", function (d) { return myColor("valueB") })

                line2
                    .datum(dataFilter)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.Year) })
                        .y(function (d) { return y(+d.NOx) })
                    )
                    .attr("stroke", function (d) { return myColor("valueC") })
            }

            // When the button is changed, run the updateChart function
            d3.select("#selectButton").on("change", function (event, d) {
                // recover the option that has been chosen
                const selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                update(selectedOption)
                onToolTip(selectedOption)
            })

            var legendContainerSettings = {
                x: -25,
                y: height + 20,
                width: 220,
                height: 70,
                roundX: 10,
                roundY: 10
            }

            var legendContainer = svg.append('rect')
                .attr('x', legendContainerSettings.x)
                .attr('y', legendContainerSettings.y)
                .attr('rx', legendContainerSettings.roundX)
                .attr('ry', legendContainerSettings.roundY)
                .attr('width', legendContainerSettings.width)
                .attr('height', legendContainerSettings.height)
                .attr('id', 'legend-container');

            var legendBoxSettings = {
                x: -40,
                width: 50,
                height: 15,
                y: legendContainerSettings.y + 40
            }

            var legendData = ["valueA", "valueB", "valueC"];
            var legendLabel = ["Carbon", "Nitrogen", "Sulfur"]
            var legend = svg.selectAll('g.legend')
                .data(legendData)
                .enter()
                .append('g')
                .attr('class', 'legend');

            legend.append('rect')
                .attr('x', function (d, i) {
                    return legendBoxSettings.x + legendBoxSettings.width * i + 50;
                })
                .attr('y', legendBoxSettings.y)
                .attr('width', legendBoxSettings.width)
                .attr('height', legendBoxSettings.height)
                .style('fill', function (d, i) {
                    switch (i) {
                        case 0:
                            return myColor("valueA")
                        case 1:
                            return myColor("valueB")
                        case 2:
                            return myColor("valueC")
                        default:
                            break;
                    }
                })
                .style('opacity', 1);

            legend.append('text')
                .attr('x', function (d, i) {
                    return legendBoxSettings.x + legendBoxSettings.width * i + 50;
                })
                .attr('y', legendBoxSettings.y - 5)
                .style('font-size', 12)
                .text(function (d, i) {
                    return legendLabel[i];
                });

        })
    }, [])
}

export default Linechart;