// !preview r2d3 data=data.frame(party = c("Democrat", "Democrat", "Republican", "Republican"), gender = c("M", "F", "M", "F"), Freq = c(120, 30, 130, 15))
//
// r2d3: https://rstudio.github.io/r2d3
//

//console.log(JSON.stringify(data));
const totalCount = data.map((row) => row.Freq).reduce((a, b) => a+b, 0);
const genderCounts = data.reduce((acc, row) => {
  return (row.gender == "M") ?
    {...acc, M: acc.M + row.Freq } :
    {...acc, F: acc.F + row.Freq }
}, { M: 0, F: 0 });

const partyCounts = data.reduce((acc, row) => {
  if (row.gender == "M") {
    return row.party == "Democrat" ? 
      {...acc, M: {...acc.M, Democrat: acc.M.Democrat + row.Freq} } :
      {...acc, M: {...acc.M, Republican: acc.M.Republican + row.Freq} }
  } else {
    return row.party == "Democrat" ? 
      {...acc, F: {...acc.F, Democrat: acc.F.Democrat + row.Freq} } :
      {...acc, F: {...acc.F, Republican: acc.F.Republican + row.Freq} }
  }
}, { M: { Democrat: 0, Republican: 0 }, F: { Democrat: 0, Republican: 0 } });
//console.log(JSON.stringify(partyCounts));

const colors = {
  Democrat: "#00AEF3",
  Republican: "red"
};

const titleHeight = 40;
const axisHeight = 40;
const plotAreaSize = Math.min(height - titleHeight - axisHeight, width - (2*axisHeight)) // the area should be a square
const hSplitGutter = 1;
const vSplitGutter = 0.3;

const rects = [
  {x: 0, y: 0, height: (partyCounts.M.Democrat/genderCounts.M)*100, width: (genderCounts.M / totalCount)*100, fill: colors.Democrat},
  {x: 0, y: vSplitGutter + (partyCounts.M.Democrat/genderCounts.M)*100, height: (partyCounts.M.Republican/genderCounts.M)*100, width: (genderCounts.M / totalCount)*100, fill:colors.Republican},
  {x: hSplitGutter + (genderCounts.M / totalCount)*100, y: 0, height: (partyCounts.F.Democrat/genderCounts.F)*100, width: (genderCounts.F / totalCount)*100, fill: colors.Democrat},
  {x: hSplitGutter + (genderCounts.M / totalCount)*100, y: vSplitGutter + (partyCounts.F.Democrat/genderCounts.F)*100, height: (partyCounts.F.Republican/genderCounts.F)*100, width: (genderCounts.F / totalCount)*100, fill: colors.Republican},
];

const xTicks = [
  {x: (genderCounts.M / totalCount)*100/2, y: 5, fontSize: 5, label: "Male"},
  {x: hSplitGutter + (genderCounts.M / totalCount)*100 + (genderCounts.F / totalCount)*100/2, y: 5, fontSize: 5, label: "Female"},
  {x: 50, y: 10, fontSize: 5, label: "Gender"},
];

const yTicks = [
  {x: (partyCounts.M.Democrat/genderCounts.M)*100/2, y: 8, fontSize: 5, label: "Democrat"},
  {x: (partyCounts.M.Democrat/genderCounts.M)*100 + (partyCounts.M.Republican/genderCounts.M)*100/2, y: 8, fontSize: 5, label: "Republican"},
  {x: 50, y: 4, fontSize: 5, label: "Party"},
];

const title = svg.append("text")
  .attr("x", () => width/2)
  .attr("y", () => titleHeight - 20)
  .attr("font-size", () => 24)
  .attr("text-anchor", () => "middle")
  .text(() => "Party affiliation by gender in US Congress");
  
const plotArea = svg.append("g")
  // flip coordinate system to have origin in the bottom left corner
  .attr("transform", `translate(${(width - plotAreaSize)/2}, ${titleHeight + plotAreaSize}) scale(${ plotAreaSize/100 }) scale(1, -1)`) 

plotArea.selectAll('rect')
  .data(rects)
  .enter().append('rect')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);

const xAxis = svg.append("g")
  .attr("transform", `translate(${(width - plotAreaSize)/2}, ${titleHeight + plotAreaSize}) scale(${ plotAreaSize/100 })`);
xAxis.selectAll("text")
  .data(xTicks).enter()
  .append("text")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .attr("font-size", (d) => d.fontSize)
  .attr("text-anchor", (d) => "middle")
  .text((d) => d.label);

const yAxis = svg.append("g")
  .attr("transform", `translate(${(width - plotAreaSize)/2 - axisHeight}, ${titleHeight + plotAreaSize}) rotate(-90) scale(${ plotAreaSize/100 })`);
yAxis.selectAll("text")
  .data(yTicks).enter()
  .append("text")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .attr("font-size", (d) => d.fontSize)
  .attr("text-anchor", (d) => "middle")
  .text((d) => d.label);
