d3.json('/js/d3/data/json/skills.json', function (error, json) {
  if (error) {
    console.log('Could not load json file:', error);
    throw new Error('Could not load json file:' + error);
  }

  chart(0.5); // draw visulaization

  function chart(jitter) {
    var dataset = json;
    var collisionPadding = 4;
    var minCollisionRadius = 12;
    var maxRadius;
    var gravX = 1;
    var gravY = 1;
    var centerNode = 'javascript';
    var bubbleSelected = false;

    var skills = {}
    dataset.nodes.forEach(function (node, i) {
      skills[node.skill] = i
    })

    dataset.edges = [];
    var edge = {};
    dataset.nodes.forEach(function (node, i) {
      if (node.targets.length) {
        node.targets.forEach(function (target) {
          dataset.edges.push({
            source: i,
            target: skills[target]
          })
        })
      }
    })

    var svg = d3.select('.skills-container')
      .append('svg')
      .attr('id', 'skills-vis');

    var w = window.innerWidth;
    var h = window.innerHeight;

    if (w <= h) {
      gravY = 8;
    } else {
      gravX = 8;
    }

    if (h <= 800 && h <= w) {
      maxRadius = h / 50;
    } else if (w <= 900 && w < h) {
      maxRadius = w / 50;
    } else {
      maxRadius = 15;
    }

    /*----------*/
    /*  SCALES  */
    /*----------*/
    var rScale = d3.scale.sqrt().range([0,maxRadius])

    /*---------*/
    /*  FORCE  */
    /*---------*/
    var force = d3.layout.force()
      .nodes(dataset.nodes)
      .links(dataset.edges)
      .size([w, h])
      .gravity(0)
      .charge(-100)
      .friction(0)
      .start();

    var edges = svg.selectAll('line')
    .data(dataset.edges)
    .enter()
    .append('line')
    .style({
      'stroke': '#CCC',
      'stroke-width': 0
    });

    var nodes = svg.selectAll('cirlce')
      .data(dataset.nodes)
      .enter()
      .append('circle')
      .attr('r', function(d, i) { return rScale(d.level); })
      .attr('class', function(d) { return d.type; })
      .call(force.drag)
      .on('mouseover', function(d) { return mouseover(d); })
      .on('mouseout', mouseout)
      .on('click', function(d) { return click(d); });

    var labels = d3.select('.skills-container')
      .selectAll('#bubble-labels')
      .data(dataset.nodes)
      .enter()
      .append('div')
      .attr({
        'id': 'bubble-labels',
        'class': function(d) { return d.type; }
      })
      .call(force.drag)
      .on('mouseover', function(d) { return mouseover(d); })
      .on('mouseout', mouseout)
      .on('click', function(d) { return click(d); });

    var labelEnter = labels.append('div')
      .attr('class', 'bubble-label-name')
      .text(function(d) { return d.skill; });

    labelEnter.append('div')
      .attr('class', 'bubble-label-value')
      .text(function(d) { return d.level; });

    force.on('tick', tick);

    function tick(e) {
      if (w < 600) {
        maxRadius = w / 50;
        rScale = d3.scale.sqrt().range([0,maxRadius])
      }

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
        .attr('cx', function(d) {
          if ((bubbleSelected && d.skill == centerNode && w >= h) || (d.skill == centerNode && w >= h)) {
            return d.x = w / 2;
          } else {
            return d.x = Math.max(d.level * 5, Math.min(w - d.level * 5, d.x));
          }
        })
        .attr('cy', function(d) {
          if ((bubbleSelected && d.skill == centerNode && h > w) || (d.skill == centerNode && h > w)) {
            return d.y = h / 2;
          } else {
            return d.y = Math.max(d.level * 5, Math.min(h - d.level * 5, d.y));
          }
        });
      labels
        .style('font-size', function(d) {
          return Math.max(8, rScale(d.level / 6)) + 'px';
        })
        .style('width', function(d) {
          return 2.5 * rScale(d.level) + 'px';
        })
        .append('span').text(function(d) {
          return d.skill;
        })
        .each(function(d) {
          return d.dx = Math.max(2.5 * rScale(d.level), this.getBoundingClientRect().width);
        })
        .remove();

      labels
        .style('width', function(d) {
          return d.dx + 'px';
        })
        .style('height', function(d) {
          return d.dy = this.getBoundingClientRect().height;
        })
        .style('left', function(d) {
          return d.x - d.dx / 2 + 'px';
        })
        .style('top', function(d) {
          return d.y - d.dy / 2 + 'px';
        });
    }

    var gravity = function(alpha) {
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
    var collide = function(jitr) {
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
              distance = (distance - minDistance) / distance * jitr;
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

    var mouseover = function(d) {
      d3.selectAll('circle')
      .classed('bubble-hover', function(p) {
        return p == d;
      });
    } // mouseover function

    var mouseout = function() {
      d3.selectAll('circle')
      .classed('bubble-hover', false);
    } // mouseout function

    var click = function(d) {
      centerNode = d.skill;
      bubbleSelected = true;
      d3.selectAll('circle')
      .classed('bubble-selected', function(p) {
        return p == d;
      });
      force.start();
    } // click function

  } // chart function

  /*----------*/
  /*  REDRAW  */
  /*----------*/
  window.addEventListener('resize', function(event){
    d3.select('.skills-container')
      .selectAll('*')
      .remove();
    chart(0.1);
  });
});
