  ////////////
 /*  DATA  */
////////////
	d3.json('/js/d3/data/json/skills.json', function(error, json){

		if (error) {
			console.log(error);
		} else {
			var dataset,
					collisionPadding = 4,
		  		minCollisionRadius = 12,
					maxRadius,
					gravX = 1,
					gravY = 1,
					jitter = 0.5,
					centerNode = "HTML5";

			dataset = json;

				///////////
			 /*  SVG  */
			///////////

				var svg = d3.select(".skills-container")
					.append("svg")
					.attr("id", "skills-vis")
					.call(responsivefy);

				var w = document.getElementById('skills-vis').getBoundingClientRect().width;
				var h = document.getElementById('skills-vis').getBoundingClientRect().height;

				console.log("weight: " + w);
				console.log("height: " + h);

				if (w <= h) {
					gravY = 8;
				} else {
					gravX = 8;
				}

				if (h <= 800 && h < w) {
					maxRadius = h / 50;
				} else if (w <= 900 && w < h) {
					maxRadius = w / 50;
				} else {
					maxRadius = 15;
				}

				console.log("maxRadius: " + maxRadius);
				console.log("gravX: " + gravX);
				console.log("gravY: " + gravY);

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
					.gravity(0)
					.charge(-100)
					.friction(0.5)
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

				var labels = d3.select(".skills-container")
					.selectAll("#bubble-labels")
					.data(dataset.nodes)
    			.enter()
    			.append("div")
    			.attr({
						"id": "bubble-labels",
						"class": function(d) { return d.type; }
					})
					.call(force.drag);

				var labelEnter = labels.append("div")
		      .attr("class", "bubble-label-name")
		      .text(function(d) { return d.skill; });

		    labelEnter.append("div")
		      .attr("class", "bubble-label-value")
		      .text(function(d) { return d.level; });

				force.on("tick", tick);

				function tick(e) {
					var dampenedAlpha = e.alpha * 0.1;

					edges.attr({
						x1: function(d) { return d.source.x; },
					  y1: function(d) { return d.source.y; },
					  x2: function(d) { return d.target.x; },
					  y2: function(d) { return d.target.y; }
					});

					nodes
						.each(gravity(dampenedAlpha))
						.each(collide(jitter))
						.attr("cx", function(d) {
							if (d.skill == centerNode && w > h) {
								return d.x = w / 2;
							} else {
								return d.x = Math.max(d.level * 5, Math.min(w - d.level * 5, d.x));
							}
						})
					  .attr("cy", function(d) {
							if (d.skill == centerNode && h > w) {
								firstTick = false
								return d.y = h / 2;
							} else {
								return d.y = Math.max(d.level * 5, Math.min(h - d.level * 5, d.y));
							}
						});

					labels
						.style("font-size", function(d) { return Math.max(8, rScale(d.level / 6)) + "px"; })
  					.style("width", function(d) { return 2.5 * rScale(d.level) + "px"; })
						.append("span").text(function(d) { return d.skill; })
						.each(function(d) {
							return d.dx = Math.max(2.5 * rScale(d.level), this.getBoundingClientRect().width);
						})
						.remove();

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
				}

				function gravity(alpha) {
				  var ax, ay, cx, cy;
				  cx = w / 2;
				  cy = h / 2;
				  ax = alpha / gravX;
				  ay = alpha / gravY;

				  return function(d) {
				    d.x += (cx - d.x) * ax;
				    d.y += (cy - d.y) * ay;
				  };
				}; // gravity function

		// Resolves collisions between d and all other circles.
			function collide(jitter) {
		    return function(d) {
		      return dataset.nodes.forEach(function(d2, i) {
		        var distance, minDistance, moveX, moveY, x, y, dminR, d2minR;

		        if (d !== d2) {
		          x = d.x - d2.x;
		          y = d.y - d2.y;
		          distance = Math.sqrt(x * x + y * y);
							dminR = Math.max(minCollisionRadius, rScale(d.level))
							d2minR = Math.max(minCollisionRadius, rScale(d2.level))
		          minDistance =  dminR + d2minR + collisionPadding;

		          if (distance < minDistance) {
		            distance = (distance - minDistance) / distance * jitter;
		            moveX = x * distance;
		            moveY = y * distance;
		            d.x -= moveX;
		            d.y -= moveY;
		            d2.x += moveX;
		            d2.y += moveY;
		          }
		        }
		      });
		    };
			}; // collide function

		  /////////////////////////
		 /*  Fx : RESPONSIVEFY  */
		/////////////////////////
			function responsivefy(svg) {
			    // get container + svg aspect ratio
			    var container = d3.select(svg.node().parentNode),
			        width = parseInt(svg.style("width")),
			        height = parseInt(svg.style("height")),
			        aspect = width / height;

			    // add viewBox and preserveAspectRatio properties,
			    // and call resize so that svg resizes on inital page load
			    svg.attr("viewBox", "0 0 " + width + " " + height)
			        .attr("perserveAspectRatio", "xMinYMid")
			        .call(resize);

			    // to register multiple listeners for same event type,
			    // you need to add namespace, i.e., 'click.foo'
			    // necessary if you call invoke this function for multiple svgs
			    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
			    d3.select(window).on("resize." + container.attr("id"), resize);

			    // get width of container and resize svg to fit it
			    function resize() {
			        var targetWidth = parseInt(container.style("width"));
			        svg.attr("width", targetWidth);
			        svg.attr("height", Math.round(targetWidth / aspect));
			    }
				}

		} // else statement
	});
