  ////////////
 /*  DATA  */
////////////
	d3.json('/js/d3/data/json/skills.json', function(error, json){
		if (error) {
			console.log(error);
		} else {
		var root = typeof exports !== "undefined" && exports !== null ? exports : this;
		var Bubbles = function() {
			var dataset = json;

			var node = [];

			var maxRadius = 15,
					collisionPadding = 4,
				  minCollisionRadius = 12,
					jitter = 0.5,
					margin = { top: 5, right: 0, bottom: 0, left: 0 };

			  //////////////
			 /*  SCALES  */
			//////////////

				var rScale = d3.scale.sqrt().range([0,maxRadius])

			  //////////////
			 /*  EVENTS  */
			//////////////

				var tick = function(e) {
			    var dampenedAlpha = e.alpha * 0.1;

			    node
						.each(gravity(dampenedAlpha))
						.each(collide(jitter))
						.attr("transform", function(d) {
			      	return "translate(" + d.x + "," + d.y + ")";
			    	});

					label
						.style("left", function(d) {
			      	return ((margin.left + d.x) - d.dx / 2) + "px";
			    	})
						.style("top", function(d) {
			      	return ((margin.top + d.y) - d.dy / 2) + "px";
			    	});
			  };

			  /////////////
			 /*  FORCE  */
			/////////////

			  force = d3.layout.force()
			    .gravity(0)
			    .charge(0)
			    .size([width, height])
			    .on("tick", tick);

				///////////
			 /*  SVG  */
			///////////

				var chart = function(selection) {
			    return selection.each(function(rawData) {
			      var maxDomainValue, svg, svgEnter;

			      var data = dataset.nodes;

			      var maxDomainValue = d3.max(data, function(d) {
			        return d.level;
			      });

			      rScale.domain([0, maxDomainValue]);

			      svg = d3.select(this)
			        .selectAll("svg")
							.attr("id", "skills-vis")
			        .data([data]);

			      svgEnter = svg.enter()
			        .append("svg")
			        .attr("width", width + margin.left + margin.right)
			        .attr("height", height + margin.top + margin.bottom);

			      node = svgEnter.append("g")
			        .attr({
								"id": "bubble-nodes",
								"transform": "translate(" + margin.left + "," + margin.top + ")"
							})
			        .append("rect")
							.attr({
								"id": "bubble-background",
								"width": width,
								"height": height
							})
							.on("click", clear);

			      label = d3.select(this)
			        .selectAll("#bubble-labels")
			        .data([data])
			        .enter()
			        .append("div")
			        .attr("id", "bubble-labels");

			      update();
			    });
			  };

				///////////////
			 /*  UPDATES  */
			///////////////

				var update = function() {
			    data.forEach(function(d, i) {
			      return d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)));
			    });
			    force.nodes(data).start();
			    updateNodes();
			    updateLabels();
			  };

				var updateNodes = function() {
			    node = node.selectAll(".bubble-node")
					.data(data, function(d) {
			      return d.skill;
			    });
			    node.exit()
						.remove()
			    	.enter()
						.append("a")
						.attr("class", "bubble-node")
						.attr("xlink:href", function(d) {
			      	return "#" + (encodeURIComponent(d.skill));
			    	})
						.call(force.drag)
						.call(connectEvents)
						.append("circle")
						.attr("r", function(d) {
							return rScale(d.level);
			    	});
			  };

				updateLabels = function() {
			    var label;

					label = label.selectAll(".bubble-label")
					.data(data, function(d) {
			      return d.skill;
			    })
			    .exit().remove();

			    var labelEnter = label.enter()
						.append("a")
						.attr("class", "bubble-label")
						.attr("href", function(d) {
			      	return "#" + (encodeURIComponent(idValue(d)));
			    	})
						.call(force.drag)
						.call(connectEvents)
			    	.append("div")
						.attr("class", "bubble-label-name")
						.text(function(d) {
			      	return d.skill;
			    	})
			    	.append("div")
						.attr("class", "bubble-label-value")
						.text(function(d) {
			      	return d.level;
			    	});

			    label
						.style("font-size", function(d) {
			      	return Math.max(8, rScale(d.level / 2)) + "px";
			    	})
						.style("width", function(d) {
			      	return 2.5 * rScale(d.level) + "px";
			    	})
			    	.append("span")
						.text(function(d) {
			      	return d.skill;
			    	})
						.each(function(d) {
			      	return d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
			    	})
						.remove()
			    	.style("width", function(d) {
			      	return d.dx + "px";
			    	})
			    	.each(function(d) {
			      	return d.dy = this.getBoundingClientRect().height;
			    	});
			  };

			  //////////////
			 /*  EVENTS  */
			//////////////

				var connectEvents = function(d) {
			    d.on("click", click);
			    d.on("mouseover", mouseover);
			    d.on("mouseout", mouseout);
			  };

				var clear = function() {
			    return location.replace("#");
			  };

				var click = function(d) {
			    location.replace("#" + encodeURIComponent(d.level));
			    d3.event.preventDefault();
			  };

				var mouseover = function(d) {
			    node.classed("bubble-hover", function(p) {
			    	p === d;
			    });
			  };

			  var mouseout = function(d) {
			    node.classed("bubble-hover", false);
			  };

			  //////////////
			 /*  EVENTS  */
			//////////////

				chart.jitter = function(_) {
			    if (!arguments.length) {
			      return jitter;
			    }
			    jitter = _;
			    force.start();
			    return chart;
			  };

			  chart.height = function(_) {
			    if (!arguments.length) {
			      return height;
			    }
			    height = _;
			    return chart;
			  };

				chart.width = function(_) {
			    if (!arguments.length) {
			      return width;
			    }
			    width = _;
			    return chart;
			  };

				chart.r = function(_) {
			    if (!arguments.length) {
			      return rValue;
			    }
			    rValue = _;
			    return chart;
			  };

			  return chart;
			};

			root.plotData = function(selector, data, plot) {
			  return d3.select(selector).datum(data).call(plot);
			};

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

		} // else statement
	});
