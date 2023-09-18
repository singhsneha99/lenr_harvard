// Update the path to your "data.json" file
const dataFile = "data.json";

// Load data from "data.json"
d3.json(dataFile).then(function (data) {
  // Create a D3 circular layout
  const width = 800;
  const height = 800;

  const svg = d3.select("#network")
    .attr("width", width)
    .attr("height", height);

  const pack = d3.pack()
    .size([width, height])
    .padding(10);

  // Create a hierarchical data structure
  const root = d3.hierarchy({ children: data })
    .sum(d => 1);

  // Generate the layout
  const nodes = pack(root).descendants();

  // Create donut graphs for each section
  const sections = svg.selectAll(".section")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "section")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  sections.append("circle")
    .attr("r", d => d.r)
    .style("fill", "lightblue")
    .style("stroke", "white");

  sections.append("text")
    .attr("dy", "0.3em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text(d => d.data.topic);

  // Handle click events on sections
  sections.on("click", function (event, d) {
    // Clear previous paper list
    d3.select("#paper-list").selectAll("li").remove();

    // Filter papers for the selected section
    const selectedPapers = data.filter(item => item.topic === d.data.topic);

    // Display papers on the right half of the page
    const paperList = d3.select("#paper-list");

    paperList.selectAll("li")
      .data(selectedPapers)
      .enter()
      .append("li")
      .text(d => d.document_id)
      .on("click", d => {
        // Handle clicking on individual papers (if needed)
      });
  });

  // Create lines to connect sections (you can modify this)
  svg.selectAll(".section")
    .each(function (source) {
      const connections = nodes.filter(node => node !== source);
      svg.selectAll(".connection")
        .data(connections)
        .enter()
        .append("line")
        .attr("class", "connection")
        .attr("x1", source.x)
        .attr("y1", source.y)
        .attr("x2", d => d.x)
        .attr("y2", d => d.y)
        .style("stroke", "gray")
        .style("stroke-width", d => Math.sqrt(d.value));
    });
});
