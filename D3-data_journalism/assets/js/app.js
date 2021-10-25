// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 625;

var margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // Step 1: parse data
    data.forEach(function(data) {
        data.poverty = +data.poverty;        
        data.healthcare = +data.healthcare;
        
    });

    // Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
          .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) +1])
          .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare) +1])
      .range([height, 0]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Step 5: Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true);

    var stateAbbr = chartGroup.selectAll(null)
    .data(data)
    .enter()
    .append("text");
  stateAbbr
    .attr("x", function (d) {
      return xLinearScale(d.poverty);
    })
    .attr("y", function (d) {
      return yLinearScale(d.healthcare) + 4
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");
    

    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
    });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })

    // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 5})`)
        .attr("class", "axisText")        
        .text("In Poverty (%)");
    }).catch(function(error) {
      console.log(error);



});