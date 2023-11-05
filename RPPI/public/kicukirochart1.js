const margin = { top: 20, right: 20, bottom: 60, left: 40 };
const width = 660 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const colors = {
    Gasabo: "#ebcf8a",
    Kicukiro: "#b69024",
    Nyarugenge: "#652c2e",
};

const x = d3.scaleBand().range([0, width]).padding(0.2);
const y = d3.scaleLinear().range([height, 0]);
const svg = d3
    .select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Fetching data from the server and visualizing it using D3.js
fetch('https://rppicalc.onrender.com/IndicesbyRegionhouse')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    }).then((data1) => {
    data1.forEach((d) => {
        d.Kicukiro = +d.Kicukiro;
    });

    x.domain(data1.map((d) => d.Quarter));
    y.domain([0, d3.max(data1, (d) => d.Kicukiro)]);

    // Plot house bars and labels
    svg
        .selectAll(".bar.house-kicukiro")
        .data(data1)
        .enter()
        .append("rect")
        .attr("class", "bar house-kicukiro")
        .attr("x", (d) => x(d.Quarter))
        .attr("width", x.bandwidth() / 2)
        .attr("y", height)
        .attr("height", 0)
        .style("fill", colors["Gasabo"])
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.Kicukiro))
        .attr("height", (d) => height - y(d.Kicukiro));

    svg
        .selectAll(".label.bar.house-kicukiro")
        .data(data1)
        .enter()
        .append("text")
        .attr("class", "label bar house-kicukiro")
        .attr("x", (d) => x(d.Quarter) + x.bandwidth() / 4)
        .attr("y", height)
        .style("font-size", "15px")
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .attr("y", (d) => y(d.Kicukiro) - 5)
        .text((d) => d.Kicukiro);

// Fetching data from the server and visualizing it using D3.js
fetch('https://rppicalc.onrender.com/IndicesbyRegionapart')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    }).then((data2) => {
        data2.forEach((d) => {
            d.Kicukiro = +d.Kicukiro;
        });

        // Adjust the domain and scale for apartment data
        y.domain([0, d3.max(data2, (d) => d.Kicukiro)]);

        // Plot apartment bars and labels
        svg
            .selectAll(".bar.apartment-kicukiro")
            .data(data2)
            .enter()
            .append("rect")
            .attr("class", "bar apartment-kicukiro")
            .attr("x", (d) => x(d.Quarter) + x.bandwidth() / 2)
            .attr("width", x.bandwidth() / 2)
            .attr("y", height)
            .attr("height", 0)
            .style("fill", colors["Kicukiro"])
            .transition()
            .duration(1000)
            .attr("y", (d) => y(d.Kicukiro))
            .attr("height", (d) => height - y(d.Kicukiro));

        svg
            .selectAll(".label.bar.apartment-kicukiro")
            .data(data2)
            .enter()
            .append("text")
            .attr("class", "label bar apartment-kicukiro")
            .attr("x", (d) => x(d.Quarter) + x.bandwidth() * 0.75)
            .attr("y", height)
            .style("font-size", "15px")
            .style("fill", "black")
            .attr("text-anchor", "middle")
            .attr("y", (d) => y(d.Kicukiro) - 5)
            .text((d) => d.Kicukiro);

        // Append x-axis and y-axis with named labels
        svg
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .style("fill", "black")
            .style("text-anchor", "middle") // Center x-axis labels under each bar
            .attr("dy", "1em");

        svg.append("g").call(d3.axisLeft(y));

        // X-axis label
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 30)
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Quarters");

        // Y-axis label
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Index");

        // Create a legend
        const legendData = [
            { label: "Houses", color: colors["Gasabo"] },
            { label: "Apartments", color: colors["Kicukiro"] },
        ];

        const legend = svg
            .selectAll(".legend")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend
            .append("rect")
            .attr("x", width - -8)
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", (d) => d.color);

        legend
            .append("text")
            .attr("x", width - -6)
            .attr("y", 5)
            .attr("dy", ".35em")
            .style("font-size", "13px")
            .style("fill", "#9e9d9d")
            .style("text-anchor", "end")
            .text((d) => d.label);
    });
});
