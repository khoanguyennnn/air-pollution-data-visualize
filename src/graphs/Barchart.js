import { useEffect } from "react";
import * as d3 from "d3";
import data from '../assets/air-pollution-deaths-country.csv';
import d3Tip from "d3-tip";


function Barchart() {
    useEffect(() => {
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 90, left: 60 },
            width = 850 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page

        const svg = d3.select(".Barchart-wrapper")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)


        svg
            .append("text")
            .text(
                "Death case by air pollution in the world from 1990 to 2019"
            )
            .attr("class", "Axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 70)
            .attr("font-weight", "bold")
            .attr("font-size", 14);
        // Parse the Data
        d3.csv(data).then(function (data) {

            let groupedData = d3
                .group(data, (d) => d.Entity)
                .entries();

            groupedData = Array.from(groupedData, ([key, value]) => ({ key, value }))
            // X axis
            const x = d3.scaleBand()
                .range([0, width])
                .domain(groupedData[224].value.map(d => d.Year))
                .padding(0.2);
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .attr("font-weight", "bold")
                .style("text-anchor", "end");

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([6300000, 6800000])
                .range([height, 0]);
            svg.append("g")
                .attr("font-weight", "bold")
                .call(d3.axisLeft(y));


            var tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
                return d.target.__data__.Deaths + " Deaths";
            });
            svg.call(tip);

            // Bars
            svg.selectAll("mybar")
                .data(groupedData[224].value)
                .join("rect")
                .attr("x", d => x(d.Year))
                .attr("width", x.bandwidth())
                .attr("fill", "#7fe0ff")
                // no bar at the beginning thus:
                .attr("height", d => height - y(6300000)) // always equal to 0
                .attr("y", d => y(6300000))
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            // Animation
            svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", d => y(d.Deaths))
                .attr("height", d => height - y(d.Deaths))
                .delay((d, i) => { return i * 100 })

        })

    }, []);
}

export default Barchart;