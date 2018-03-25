# Data Journalism and D3

The porpose of this project is to use Data Driven Document (D3) to explore certain associations 
between data collected from "the American Community Survey (ACS)" and "the Behavioral
Risk Factor Surveillance System (BRFSS)" during the year 2014.
			        
What I found are: There is an inverse association between poverty and being physically active.
There is an inverse association between the household income and smoking. 
There is an association between age dependency and alcohol consumption. 
As people age, the probability of getting sober is more.



[American FactFinder](http://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml) tool.
 When searching through the data, be sure to select these options in the left sidebar:

* Topics -> Dataset -> 2014 ACS 1-year estimates

* Geographies -> Select a geographic type -> State - 040 -> All States within United States and Puerto Rico

Next, you'll search for data on health risks using 2014 survey data from the 
[Behavioral Risk Factor Surveillance System]
(https://chronicdata.cdc.gov/Behavioral-Risk-Factors/BRFSS-2014-Overall/5ra3-ixqq).
 Note that we already filtered the data by year and break-out—you just need to find the behavioral 
risk you want to use. 
Filter the `Question` data on the site before downloading a specified .csv, or simply download the whole
 .csv file and use Excel's filtering tools.


To make sure you have a solid trend, you need to test for correlation with Excel's `=CORREL()` function. 
Aim for a value either less 
than -0.5 or more than 0.5—these values would indicate a moderate correlation and a story that might be 
worth pursuing
 (shoot for -0.75 or 0.75 if you're feeling super diligent).

* If you don't find a value that matches, try at least four other demographic-risk combinations—if you can't find one that hits 
-0.5 or .5, just go with the most striking mix.

