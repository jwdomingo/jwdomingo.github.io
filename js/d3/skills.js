  ////////////
 /*  DATA  */
////////////

	var dataset,
			padding = 1.5, // separation between same-color circles
			clusterPadding = 6, // separation between different-color circles
			maxRadius = 15;

	d3.json('/js/d3/data/json/skills.json', function(error, json){

		if (error) {
			console.log(error);
		} else {
			dataset = json;

				///////////
			 /*  SVG  */
			///////////

				var svg = d3.select(".skills-container")
					.append("svg")
					.attr("id", "skills-vis");
					//.call(responsivefy);

				var w = document.getElementById('skills-vis').getBoundingClientRect().width;
				var h = document.getElementById('skills-vis').getBoundingClientRect().height;

			  //////////////
			 /*  SCALES  */
			//////////////

				var rScale = d3.scale.sqrt().range([0,maxRadius])

			  /////////////
			 /*  FORCE  */
			/////////////

				var force = d3.layout.force()
					.nodes(dataset.nodes)
					.links(dataset.edges)
					.size([w, h])
					.gravity([0.2])
					.linkDistance([100])
					.charge([-500])
					.start();

				var edges = svg.selectAll("line")
					.data(dataset.edges)
					.enter()
					.append("line")
					.style({
						"stroke": "#ccc",
						"stroke-width": 0
					});

				var nodes = svg.selectAll("cirlce")
					.data(dataset.nodes)
					.enter()
					.append("circle")
					.attr("r", function(d, i) { return rScale(d.level); })
					.attr("class", function(d) { return d.type; })
					.call(force.drag);

				// var labels1 = svg.selectAll("text")
				// 	.data(dataset.nodes)
				// 	.enter()
				// 	.append("text")
				// 	.text(function(d, i) {
				// 		return d.skill;
				// 	})
				// 	.attr({
				// 		"class": function(d) { return d.type; },
				// 		"font-family": "sans-serif",
				// 		"font-size": "10px",
				// 		"text-anchor": "middle",
				// 		fill: "#023647"
				// 	});

				var labels = d3.select(".skills-container")
					.selectAll("#bubble-labels")
					.data(dataset.nodes)
    			.enter()
    			.append("div")
    			.attr({
						"id": "bubble-labels",
						"class": function(d) { return d.type; }
					});

				var labelEnter = labels.append("div")
		      .attr("class", "bubble-label-name")
		      .text(function(d) { return d.skill; });

		    labelEnter.append("div")
		      .attr("class", "bubble-label-value")
		      .text(function(d) { return d.level; });

				force.on("tick", tick);

				function tick() {
					edges.attr({
						x1: function(d) { return d.source.x; },
					  y1: function(d) { return d.source.y; },
					  x2: function(d) { return d.target.x; },
					  y2: function(d) { return d.target.y; }
					});

					nodes.each(collide(0.5))
						.attr("cx", function(d) { return d.x; })
					  .attr("cy", function(d) { return d.y; });

					labels
						.style("font-size", function(d) { return Math.max(8, rScale(d.level / 6)) + "px"; })
  					.style("width", function(d) { return 2.5 * rScale(d.level) + "px"; })
						.append("span").text(function(d) { return d.skill; })
						.each(function(d) {
							return d.dx = Math.max(2.5 * rScale(d.level), this.getBoundingClientRect().width);
						}).remove();

				  labels
						.style("width", function(d) {
				    	return d.dx + "px";
				  	});

				  labels
						.style("height", function(d) {
				    	return d.dy = this.getBoundingClientRect().height;
				  	});

					labels
						.style("left", function(d) {
								return d.x - d.dx / 2 + "px";
						})
  					.style("top", function(d) {
								return d.y - d.dy / 2 + "px";
						});




					// labels1.attr("x", function(d) { return d.x; })
					// 	.attr("y", function(d) { return d.y; });
				}

			//console.log(json);

		// Resolves collisions between d and all other circles.
			function collide(alpha) {
			  var quadtree = d3.geom.quadtree(nodes);
			  return function(d) {
			    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
			        nx1 = d.x - r,
			        nx2 = d.x + r,
			        ny1 = d.y - r,
			        ny2 = d.y + r;
			    quadtree.visit(function(quad, x1, y1, x2, y2) {
			      if (quad.point && (quad.point !== d)) {
			        var x = d.x - quad.point.x,
			            y = d.y - quad.point.y,
			            l = Math.sqrt(x * x + y * y),
			            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
			        if (l < r) {
			          l = (l - r) / l * alpha;
			          d.x -= x *= l;
			          d.y -= y *= l;
			          quad.point.x += x;
			          quad.point.y += y;
			        }
			      }
			      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			    });
			  };
			}

		  /////////////////////////
		 /*  Fx : RESPONSIVEFY  */
		/////////////////////////
			// function responsivefy(svg) {
			//     // get container + svg aspect ratio
			//     var container = d3.select(svg.node().parentNode),
			//         width = parseInt(svg.style("width")),
			//         height = parseInt(svg.style("height")),
			//         aspect = width / height;
			//
			//     // add viewBox and preserveAspectRatio properties,
			//     // and call resize so that svg resizes on inital page load
			//     svg.attr("viewBox", "0 0 " + width + " " + height)
			//         .attr("perserveAspectRatio", "xMinYMid")
			//         .call(resize);
			//
			//     // to register multiple listeners for same event type,
			//     // you need to add namespace, i.e., 'click.foo'
			//     // necessary if you call invoke this function for multiple svgs
			//     // api docs: https://github.com/mbostock/d3/wiki/Selections#on
			//     d3.select(window).on("resize." + container.attr("id"), resize);
			//
			//     // get width of container and resize svg to fit it
			//     function resize() {
			//         var targetWidth = parseInt(container.style("width"));
			//         svg.attr("width", targetWidth);
			//         svg.attr("height", Math.round(targetWidth / aspect));
			//     }
			// 	}
		}
	});
