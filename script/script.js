//Don't forget to start a simple http server
//python -m http.server

//THINGS LEFT TO DO
		//fix x-axis to spread out values more
		

//Set up Canvas
	var margin = {t:50,r:50,b:50,l:50};
	var width = $('.plot').width() - margin.r - margin.l,
    	height = $('.plot').height() - margin.t - margin.b;

	var canvas = d3.select('.plot')
    	.append('svg')
    	.attr('width',width+margin.r+margin.l)
    	.attr('height',height + margin.t + margin.b)
    	.append('g')
    	.attr('class','canvas')
    	.attr('transform','translate('+margin.l+','+margin.t+')');

//Set up Scales
	var scaleX = d3.scale.log().range([0,width]),
		scaleY = d3.scale.log().range([height,0]),
		scaleR = d3.scale.sqrt().range([5, 30]);

//Set up Axis Generator

    //SIQI: this is a formatting function
    //https://github.com/mbostock/d3/wiki/Formatting#d3_format
    var myFormattingFunction = d3.format(',.0f');

	var axisX = d3.svg.axis()
		.orient('bottom')
		.tickSize(-height, 0)
        .tickValues([1000,5000,10000])//SIQI: this is how you arbitrarily specify tick values
        .tickFormat( myFormattingFunction)//SIQI: this is how you manually format tick values; @param myFormattingFunction is a function
		.scale(scaleX);
	var axisY = d3.svg.axis()
		.orient('left')
		.tickSize (-width,0)
        .tickValues([1,5,10,20])
		.scale (scaleY);

//Acquire data
	console.log('Start loading data.')
	d3.csv('data/world_bank_2010_gdp_co2.csv' , parse, dataLoaded)

//Functions
	function parse(row){	
		//parsing function
			/*
			Country Name,
			Country Code,
			"GDP per capita, PPP (constant 2011 international $)",
			CO2 emissions (kt),
			CO2 emissions (metric tons per capita),
			"Population, total"
			*/

		return{
			country: row['Country Name'],
			countryCode: row['Country Code'],
			gdpPerCap: row['GDP per capita, PPP (constant 2011 international $)']
						=='..'?undefined:+row['GDP per capita, PPP (constant 2011 international $)'],
			cEmiss: row['CO2 emissions (kt)']
						=='..'?undefined:+row['CO2 emissions (kt)'],
			cEmissPerCap: row['CO2 emissions (metric tons per capita)']
						=='..'?undefined:+row['CO2 emissions (metric tons per capita)'],
			pop: row['Population, total']
						=='..'?undefined:+row['Population, total'],
		};
	}

	function dataLoaded(err,rows){
		//Data loading function

	    	console.log("Data loaded");

		//Find mins & maxes
	    	var minX = d3.min(rows, function(d){ return d.gdpPerCap; }),
	        	maxX = d3.max(rows, function(d){ return d.gdpPerCap; });

	    	var minY = d3.min(rows, function(d){ return d.cEmissPerCap; }),
	    		maxY = d3.max(rows, function(d){ return d.cEmissPerCap; });

	    	var minR = d3.min(rows, function(d){ return d.cEmiss }),
	    		maxR = d3.max(rows, function(d){ return d.cEmiss });

	    //Check values
	    		
	    	console.log('The smallest country GDP per capita is ' + minX + '.');
	    	console.log('The largest country GDP per capita is ' + maxX + '.');
	   		console.log('The smallest country CO2 emissions per capita is ' + minY + '.');
	   		console.log('The largest country CO2 emissions per capita is ' + maxY + '.');
	   		console.log('The smallest total emssions by a country is ' + minR + '.');
	   		console.log('The largest total emissions by a country is ' + maxR + '.');
	    		

		//Scale the values
	    	scaleX.domain([minX,maxX]);
	    	scaleY.domain([minY,maxY]);
	    	scaleR.domain([minR,maxR]);

		//Draw the circles
	    	draw(rows);
	}

	function draw(rows){
		//Draw the plot
	    	console.log("Start drawing");
	 
		//Draw Axes
	    	canvas.append('g')
	        	.attr('class','axis x')
	        	.attr('transform','translate(0,'+height+')')
	        	.call(axisX);
	    	canvas.append('g')
	        	.attr('class','axis y')
	        	.call(axisY);

		//Draw circles
	    	var nodes = canvas.selectAll('.node')
	        	.data(rows)
	        	.enter()
	        	.append('g')
	        	.attr('class','node')
	        	.filter(function(d){
	        	    return d.gdpPerCap && d.cEmissPerCap;
	       		})
	        	.attr('transform', function(d){
	            	return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.cEmissPerCap)+')';
	        	});

		    nodes.append('circle')
	    	    .attr('r', function(d){
	            return scaleR(d.cEmiss);
	        });

		//mouse-over text
	    	nodes.append('text')
	        	.text(function(d){
	            	return d.country;
	        	})
	        	.attr('text-anchor','middle')
	        	.attr('dy', -12);
	}



//Design 
	/* 
		For any node that is high in gdp Per Capita and High total emissions
	change color from yellow to red

		For any node that is high in gdp Per Capita and low in total emissions
	change color from yellow to green 
	*/
		//for loop checking each node
			//if statement checking boolean values
				//if values are > .75 * max
					//then change color to red
				//else if values are < 1.25 * min
					//then change color to green
				//else stay yellow
	/*
		Label Axes with text
	*/

	/*
		Button to show only red, only green, only yellow
	*/
			//on event:click change visibility of 
				//everything not red to false
			//

