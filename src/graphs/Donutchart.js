import { useEffect } from "react";
import * as d3 from "d3";
import importData from '../assets/air-pollution-deaths-by-age.csv';
import d3Tip from "d3-tip";

function Donutchart() {
    useEffect(() => {
        // set the dimensions and margins of the graph
        const width = 600,
            height = 450,
            margin = 40;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        const svg = d3.select(".Donutchart-wrapper")
            .append("svg")
            .attr("id", "donutchart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        svg
            .append("text")
            .text(
                "Death case by air pollution over the world in 1990 by age"
            )
            .attr("class", "Axis-label")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", height / 3 + 70)
            .attr("font-weight", "bold")
            .attr("font-size", 14);

        d3.csv(importData).then(function (data) {
            const allGroup = new Set(data.map(d => d.Year))

            d3.select("#selectButton2")
                .selectAll('myOptions')
                .data(allGroup)
                .enter()
                .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return d; }) // corresponding value returned by the button

            const dataFilter = data.filter(function (d) { return d.Year == "1990" && d.Entity == "World" })

            const newData = dataFilter.map((value) => {
                return {
                    "5": value["5"],
                    "5-14": value["5-14"],
                    "15-49": value["15-49"],
                    "50-69": value["50-69"],
                    "70+": value["70+"]
                }
            })
            // set the color scale
            const color = d3.scaleOrdinal()
                .domain(["under 5", "5-14", "15-49", "50-69", "70+"])
                .range(d3.schemeDark2);

            // Compute the position of each group on the pie:
            const pie = d3.pie()
                .sort(null) // Do not sort group by size
                .value(d => d[1])
            const data_ready = pie(Object.entries(newData[0]))

            // The arc generator
            const arc = d3.arc()
                .innerRadius(radius * 0.5)         // This is the size of the donut hole
                .outerRadius(radius * 0.8)

            // Another arc that won't be drawn. Just for labels positioning
            const outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9)

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg
                .selectAll('allSlices')
                .data(data_ready)
                .join('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data[1]))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)

            // Add the polylines between chart and labels:
            svg
                .selectAll('allPolylines')
                .data(data_ready)
                .join('polyline')
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function (d) {
                    const posA = arc.centroid(d) // line insertion in the slice
                    const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                    const posC = outerArc.centroid(d); // Label position = almost the same as posB
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                    return [posA, posB, posC]
                })

            // Add the polylines between chart and labels:
            svg
                .selectAll('allLabels')
                .data(data_ready)
                .join('text')
                .text(d => d.data[1] + " cases")
                .attr('transform', function (d) {
                    const pos = outerArc.centroid(d);
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return `translate(${pos})`;
                })
                .style('text-anchor', function (d) {
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    return (midangle < Math.PI ? 'start' : 'end')
                })

            var legends = svg.append("g").attr("transform", "translate(-250,0)")
                .selectAll(".legends").data(data_ready);

            var legend = legends.enter().append("g").classed("legends", true).attr("transform", function (d, i) { return "translate(0," + (i + 1) * 30 + ")" })
            legend.append("rect").attr("width", 20).attr("height", 20).attr("fill", d => color(d.data[1])).style("opacity", 0.7)

            legend.append("text").text(function (d) { return d.data[0] })
                .attr("x", 25)
                .attr("y", 17);

            function update(selectedGroup) {

                // Create new data with the selection?
                const dataFilter = data.filter(function (d) { return d.Year == selectedGroup && d.Entity == "World" })

                const newData = dataFilter.map((value) => {
                    return {
                        "5": value["5"],
                        "5-14": value["5-14"],
                        "15-49": value["15-49"],
                        "50-69": value["50-69"],
                        "70+": value["70+"]
                    }
                })

                const data_ready = pie(Object.entries(newData[0]))
                console.log(data_ready);

                // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                d3.select("#donutchart").remove();

                const width = 600,
                    height = 450,
                    margin = 40;

                // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
                const radius = Math.min(width, height) / 2 - margin

                // append the svg object to the div called 'my_dataviz'
                const svg = d3.select(".Donutchart-wrapper")
                    .append("svg")
                    .attr("id", "donutchart")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(${width / 2},${height / 2})`);

                svg
                    .append("text")
                    .text(
                        "Death case by air pollution over the world in " + selectedGroup + " by age "
                    )
                    .attr("class", "Axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", 0)
                    .attr("y", height / 3 + 70)
                    .attr("font-weight", "bold")
                    .attr("font-size", 14);

                svg
                    .selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

                // Add the polylines between chart and labels:
                svg
                    .selectAll('allPolylines')
                    .data(data_ready)
                    .join('polyline')
                    .attr("stroke", "black")
                    .style("fill", "none")
                    .attr("stroke-width", 1)
                    .attr('points', function (d) {
                        const posA = arc.centroid(d) // line insertion in the slice
                        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                        const posC = outerArc.centroid(d); // Label position = almost the same as posB
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                    })

                // Add the polylines between chart and labels:
                svg
                    .selectAll('allLabels')
                    .data(data_ready)
                    .join('text')
                    .text(d => d.data[1] + " cases")
                    .attr('transform', function (d) {
                        const pos = outerArc.centroid(d);
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                        return `translate(${pos})`;
                    })
                    .style('text-anchor', function (d) {
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        return (midangle < Math.PI ? 'start' : 'end')
                    })

                var legends = svg.append("g").attr("transform", "translate(-250,0)")
                    .selectAll(".legends").data(data_ready);

                var legend = legends.enter().append("g").classed("legends", true).attr("transform", function (d, i) { return "translate(0," + (i + 1) * 30 + ")" })
                legend.append("rect").attr("width", 20).attr("height", 20).attr("fill", d => color(d.data[1])).style("opacity", 0.7)

                legend.append("text").text(function (d) { return d.data[0] })
                    .attr("x", 25)
                    .attr("y", 17);

            }

            // When the button is changed, run the updateChart function
            d3.select("#selectButton2").on("change", function (event, d) {
                // recover the option that has been chosen
                const selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                update(selectedOption)
            })
        })
    }, [])
}

export default Donutchart;