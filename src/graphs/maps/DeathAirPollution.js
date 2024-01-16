import { useEffect } from "react";
import * as d3 from "d3";
import importedData from '../../assets/share-deaths-air-pollution.csv';
import d3Tip from "d3-tip";

function DeathAirPollution() {
    useEffect(() => {
        // The svg
        const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(120)
            .center([0, 20])
            .translate([width / 2, height / 2]);

        // Data and color scale
        const data = new Map();
        const colorScale = d3.scaleThreshold()
            .domain([0, 0.01, 0.1, 1, 10])
            .range(d3.schemeBlues[5]);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        // Load external data and boot

        Promise.all([
            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
            d3.csv(importedData, function (d) {
                data.set(d.Code, +d.Value)
            })]).then(function (loadData) {
                let topo = loadData[0]
                console.log(topo);
                let mouseOver = function (event, d) {
                    d3.selectAll(".Country")
                        .transition()
                        .duration(200)
                        .style("opacity", .5)
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", 1)
                        .style("stroke", "black")
                    tooltip.html(`<strong>${d.properties.name}</strong><br/>Value: ${d.total.toFixed(2)}%`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY + 10) + "px")
                        .transition()
                        .duration(200)
                        .style("opacity", .9);
                }

                let mouseLeave = function (d) {
                    d3.selectAll(".Country")
                        .transition()
                        .duration(200)
                        .style("opacity", .8)
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("stroke", "transparent")
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                }

                // Draw the map
                svg.append("g")
                    .selectAll("path")
                    .data(topo.features)
                    .enter()
                    .append("path")
                    // draw each country
                    .attr("d", d3.geoPath()
                        .projection(projection)
                    )
                    // set the color of each country
                    .attr("fill", function (d) {
                        d.total = data.get(d.id) || 0;
                        return colorScale(d.total);
                    })
                    .style("stroke", "transparent")
                    .attr("class", function (d) { return "Country" })
                    .style("opacity", .8)
                    .on("mouseover", mouseOver)
                    .on("mouseleave", mouseLeave)

                var legendContainerSettings = {
                    x: width * 0.03,
                    y: height * 0.82,
                    width: 300,
                    height: 90,
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
                    x: 0,
                    width: 50,
                    height: 15,
                    y: legendContainerSettings.y + 55
                }

                var legendData = [0, 0.01, 0.1, 1, 10];

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
                        return colorScale(d)
                    })
                    .style('opacity', 1);

                legend.append('text')
                    .attr('x', function (d, i) {
                        return legendBoxSettings.x + legendBoxSettings.width * i + 65;
                    })
                    .attr('y', legendBoxSettings.y - 15)
                    .style('font-size', 12)
                    .text(function (d, i) {
                        return legendData[i] + "%";
                    });

            })
    }, [])
}

export default DeathAirPollution;