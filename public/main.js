const sorts = [
  (a, b) => (a.index < b.index ? 1 : -1),
  (a, b) => {
    if (a.tfidf_label > b.tfidf_label) {
      return 1;
    } else if (a.tfidf_label < b.tfidf_label) {
      return -1;
    } else {
      return a.index < b.index ? 1 : -1;
    }
  },
  (a, b) => {
    if (a.use_label > b.use_label) {
      return 1;
    } else if (a.use_label < b.use_label) {
      return -1;
    } else {
      return a.index < b.index ? 1 : -1;
    }
  }
];

const colors = [false, "tfidf_color", "use_color"];

const titles = [
  "Shakespeare’s Sonnets",
  "...ordered by simple cluster, colored by simple vector",
  "...ordered by complex cluster, colored by complex vector"
];

d3.json("data.json").then(data => {
  const rc = Math.ceil(Math.sqrt(data.length));
  const padding = 20;
  const size = 640;
  const svg = d3
    .select("svg")
    .attr("width", size)
    .attr("height", size);
  const guts = svg.append("g");
  const gridsize = size / rc;
  const sonnets = guts
    .selectAll("g.sonnet")
    .data(data)
    .enter()
    .append("g")
    .classed("sonnet", true);

  const title = guts
    .append("text")
    .attr("x", 0)
    .attr("y", size - gridsize + 20)
    .style("font-size", "20px")
    .style("font-family", "Source Sans Pro")
    .style("font-weight", 800);

  const rects = sonnets
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", gridsize - 1)
    .attr("height", gridsize - 1);

  const render = (o, isFirst) => {
    if (!isFirst) {
      sonnets
        .sort(sorts[o])
        .transition()
        .duration(1500)
        .attr("transform", (d, i) => {
          const x = Math.floor(i % rc) * gridsize;
          const y = Math.floor(i / rc) * gridsize;
          return `translate(${x},${y})`;
        });
      rects
        .transition()
        .duration(1500)
        .style("fill", d => {
          console.log(colors[o], d[colors[o]]);
          if (colors[o]) {
            return `rgb(${255},${d[colors[o]][1]},${d[colors[o]][2]})`;
          } else {
            return "pink";
          }
        });
    } else {
      sonnets.sort(sorts[o]).attr("transform", (d, i) => {
        const x = Math.floor(i % rc) * gridsize;
        const y = Math.floor(i / rc) * gridsize;
        return `translate(${x},${y})`;
      });
      rects.style("fill", d => {
        if (colors[o]) {
          return `rgb(${255},${d[colors[o]][1]},${d[colors[o]][2]})`;
        } else {
          return "pink";
        }
      });
    }
  };

  let o = 0;
  render(o, true);
  title.text(titles[0]);
  const order = () => {
    render(o);
    title.text(titles[o]);
    o++;
    if (o >= sorts.length) {
      o = 0;
    }
  };
  window.setInterval(order, 5000);
});
