// Step 0: Set up our chart
//= ================================

d3.select(window).on("resize", handleResize);

// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
  var svgArea = d3.select("svg");

  // If there is already an svg container on the page, remove it and reload the chart
  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}

function loadChart() {
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

//var svgWidth = 960;
//var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from the CSV file and execute everything below
d3.csv("datasets/data.csv", function(err, FFData) {
  if (err) throw err;

  FFData.forEach(function(data) {
    data.medianIncome = +data.medianIncome;
    data.smoker = +data.smoker;
    data.sexRatio = +data.sexRatio;
    data.physicallyActive = +data.physicallyActive;
    data.alcoholConsumption = +data.alcoholConsumption;
    data.percentBelowPoverty = +data.percentBelowPoverty;
  });

  // Create scale functions
  var yScale = d3.scaleLinear().range([height, 0]);
  var xScale = d3.scaleLinear().range([0, width]);

  // define axis functions
  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMax;
  var yMin;

  // These functions identifies the minimum and maximum values in a column in data.csv
  // and assign them to xMin and xMax variables, which will define the axis domain

  function findMinAndMaxX(dataColumnX) {
    xMin = d3.min(FFData, function (data) { return data[dataColumnX] * 0.8 });
    xMax = d3.max(FFData, function (data) { return data[dataColumnX] * 1.2 });
  };

  function findMinAndMaxY(dataColumnY) {
    yMin = d3.min(FFData, function (data) { return data[dataColumnY] * 0.8 });
    yMax = d3.max(FFData, function (data) { return data[dataColumnY] * 1.2 });
  };

  
  // The default x-axis is 'percentBelowPoverty'
  // Another axis can be assigned to the variable during an onclick event.
  // This variable is key to the ability to change axis/data column

  // set the default x-axis
  var currentAxisLabelX = "percentBelowPoverty"
  // set the default y-axis
  var currentAxisLabelY = "smokers"

  // Call findMinAndMax() with 'hair_length' as default
  findMinAndMaxX(currentAxisLabelX);
  findMinAndMaxY(currentAxisLabelY)

  // set the domain of the axes
  xScale.domain([xMin, xMax]);
  yScale.domain([yMin, yMax])

  
  // Initialize tooltip
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  // Define position
  .offset([80, -60])
  // The html() method allows us to mix JavaScript with HTML in the callback function
  .html(function(data) {
    var state = data.geography;
    var currentY = +data[currentAxisLabelY];
    var currentX = +data[currentAxisLabelX];
    var XString;
    var YString;
    // Tooltip text depends on which axis is active/has been clicked
        
    if (currentAxisLabelX === "percentBelowPoverty") {
      XString = "In Poverty (%): ";
    }
    else if (currentAxisLabelX === "medianIncome"){
      XString = "Household Income: ";
    }
    else {
      XString = "Age Dependency Ratio: ";
    }

    if (currentAxisLabelY === "smokers") {
      YString = "Smokes (%): ";
    }
    else if (currentAxisLabelY === "alcoholConsumption"){
      YString = "Alcohol Consumption (%): ";
    }
    else {
      YString = "Physically Active (%):";
    } 

    return state +
      "<br>" + XString +
      currentX +
      "<br>" + YString +
      currentY;
  });


// Create tooltip
 chart.call(toolTip);

// create chart
  chart.selectAll("circle")
  .data(FFData)
  .enter()
  .append("circle")
  .attr("cx", function (data) {
      return xScale(data[currentAxisLabelX]);
  })
  .attr("cy", function (data) {
      return yScale(data[currentAxisLabelY]);
  })
  .attr("r", 15)
  .attr("fill", "#e75480") 
  .attr("opacity", 0.75)
  // display tooltip on click
  .on("mouseover", function (data) {
      toolTip.show(data);
  })
  // hide tooltip on mouseout
  .on("mouseout", function (data, index) {
      toolTip.hide(data);
  });

  // create state labels
  chart.selectAll("text")
  .data(FFData)
  .enter()
  .append("text")
  .text(function (data) {
      return data.locationAbbr;
  })
  .attr("x", function (data) {
      return xScale(data[currentAxisLabelX]);
  })
  .attr("y", function (data) {
      return yScale(data[currentAxisLabelY]);
  })
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("class","stateText")

  // display tooltip on click
  .on("mouseover", function (data) {
      toolTip.show(data);
  })
  // hide tooltip on mouseout
  .on("mouseout", function (data, index) {
      toolTip.hide(data);
  })


  // create x-axis
  chart.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

 // create y-axis
 chart.append("g")
  .attr("class", "y-axis")
  .call(yAxis)
  
  
  // add x-axis titles
  chart.append("text")
  .attr("transform", `translate(${width / 2},${height + 40})`)
  // This axis label is active by default
  .attr("class", "axis-text-x active")
  .attr("data-axis-name", "percentBelowPoverty")
  .text("In Poverty (%)");

chart.append("text")
  .attr("transform", `translate(${width / 2},${height + 60})`)
  // This axis label is active by default
  .attr("class", "axis-text-x inactive")
  .attr("data-axis-name", "medianIncome")
  .text("Household Income (Median)");

chart.append("text")
  .attr("transform", `translate(${width / 2},${height + 80})`)
  // This axis label is active by default
  .attr("class", "axis-text-x inactive")
  .attr("data-axis-name", "ageDependencyRatio")
  .text("Age Dependency Ratio");


// add y-axis titles 
chart.append("text")
  .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
  .attr("class", "axis-text-y active")
  .attr("data-axis-name", "smokers")
  .text("Smokes (%)");


chart.append("text")
  .attr("transform", `translate(-60,${height / 2})rotate(-90)`)
  .attr("class", "axis-text-y inactive")
  .attr("data-axis-name", "alcoholConsumption")
  .text("Alcohol Consumption (%)");


chart.append("text")
  .attr("transform", `translate(-80,${height / 2})rotate(-90)`)
  .attr("class", "axis-text-y inactive")
  .attr("data-axis-name", "physicallyActive")
  .text("Physically Active (%)");


// change the x axis's status from inactive to active when clicked and change all active to inactive
function labelChangeX(clickedAxis) {
  d3.selectAll(".axis-text-x")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

  clickedAxis.classed("inactive", false).classed("active", true);
}

// change the y axis's status from inactive to active when clicked and change all active to inactive
function labelChangeY(clickedAxis) {
  d3.selectAll(".axis-text-y")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

  clickedAxis.classed("inactive", false).classed("active", true);
}


// on click events for the x-axis
d3.selectAll(".axis-text-x").on("click", function () {
  // assign the variable to the current axis
  var clickedSelection = d3.select(this);
  var isClickedSelectionInactive = clickedSelection.classed("inactive");
  //console.log("this axis is inactive", isClickedSelectionInactive)
  var clickedAxis = clickedSelection.attr("data-axis-name");
  //console.log("current axis: ", clickedAxis);

  if (isClickedSelectionInactive) {
    currentAxisLabelX = clickedAxis;
    findMinAndMaxX(currentAxisLabelX);
    xScale.domain([xMin, xMax]);
    // create x-axis
    svg.select(".x-axis")
       .transition()
       .duration(1000)
       .ease(d3.easeLinear)
       .call(xAxis);
  
    d3.selectAll("circle")
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .on("start", function () {
        d3.select(this)
          .attr("opacity", 0.50)
          .attr("r", 20)
  
      })
      .attr("cx", function (data) {
        return xScale(data[currentAxisLabelX]);
      })
      .on("end", function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr("r", 15)
          .attr("fill","#e75480") //"#4380BA" )  
          .attr("opacity", 0.75);
      })
  
      d3.selectAll(".stateText")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("x", function (data) {
          return xScale(data[currentAxisLabelX]);
        })
                      
    labelChangeX(clickedSelection);
  }
  });
  

  // On click events for the y-axis
  d3.selectAll(".axis-text-y").on("click", function () {

    // assign the variable to the current axis
    var clickedSelection = d3.select(this);
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    var clickedAxis = clickedSelection.attr("data-axis-name");
    
    
    if (isClickedSelectionInactive) {
      currentAxisLabelY = clickedAxis;
      findMinAndMaxY(currentAxisLabelY);
    
      yScale.domain([yMin, yMax]);
      // create y-axis
      svg.select(".y-axis")
         .transition()
         .duration(1000)
         .ease(d3.easeLinear)
         .call(yAxis);
    
      d3.selectAll("circle")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .on("start", function () {
          d3.select(this)
            .attr("opacity", 0.50)
            .attr("r", 20)
    
        })
        .attr("cy", function (data) {
          return yScale(data[currentAxisLabelY]);
        })
        .on("end", function () {
          d3.select(this)
            .transition()
            .duration(500)
            .attr("r", 15)
            .attr("fill", "#e75480")
            .attr("opacity", 0.75);
        })
    
        d3.selectAll(".stateText")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("y", function (d) {
            return yScale(d[currentAxisLabelY]);
          })
    
        labelChangeY(clickedSelection);
    }
    
  });
    
});
}