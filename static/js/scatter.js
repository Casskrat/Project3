console.log(housingData[0])
console.log(d3.select("#selCompare").html());

var stateDropdown = d3.select("#selDataset");

var states = [];

for (let i = 0; i < housingData.length; i++) {

    if (states.includes(housingData[i].State) == false) {
        
        states.push(housingData[i].State);
    }
}

states.sort();
states.unshift("Select state...");

var cityDropdown = d3.select("#selCity");

var cities = [];

for (let i = 0; i < housingData.length; i++) {

    if (cities.includes(housingData[i].City) == false) {
        
        cities.push(housingData[i].City);
    }
}

cities.sort();
cities.unshift("Select city...");

var zipDropdown = d3.select("#selDataset2");

var zipcodes = ["Select zip code..."];

for (let i = 0; i < housingData.length; i++) {

    if (zipcodes.includes(housingData[i]['Zip Code']) == false) {
        
        zipcodes.push(housingData[i]['Zip Code']);
    }
}

stateCompare = d3.select("#selCompare");
cityCompare = d3.select("#selCity2");
zipCompare = d3.select("#selCompare2");

function init() {

    states.map(state => stateDropdown.append("option").text(state).property("value", state));

    cities.map(city => cityDropdown.append("option").text(city).property("value", city));

    zipcodes.map(zipcode => zipDropdown.append("option").text(zipcode).property("value", zipcode));

    states.map(state => stateCompare.append("option").text(state).property("value", state));

    cities.map(city => cityCompare.append("option").text(city).property("value", city));

    zipcodes.map(zipcode => zipCompare.append("option").text(zipcode).property("value", zipcode));

    let firstState = states[1];
    let secondState = states[2];

    createScatter(firstState);
    createComparescatter(secondState);
    populateTable(firstState, secondState);
}

function mean(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}


function createScatter(selectItem) {
// maybe make a variable based function out of this selected part so its not repeated 3 times in the code//
    if (stateDropdown.text().includes(selectItem) == true) {

        var itemCurrent = housingData.filter(property => property.State == selectItem);
    }
    else if (cityDropdown.text().includes(selectItem) == true) {

        var itemCurrent = housingData.filter(property => property.City == selectItem);
    }
    else {

        var itemCurrent = housingData.filter(property => property['Zip Code'] == selectItem);
    }

    let price  = [];
    let income = [];
    let space = [];

    for (let i = 0; i < itemCurrent.length; i++) {

        price.push(itemCurrent[i].Price);
        income.push(itemCurrent[i]["Median Household Income"]);
        space.push(itemCurrent[i]["Living Space"]);
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////
    let trace1 = {
        x: price,
        name: 'Price',
        type: 'histogram',
        autobinx: false,
        histnorm: 'percent',
        opacity: 0.75,
        xbins: {
            end: mean(price) + getStandardDeviation(price) * 2,
            size: 50000,
            start: 0
        },
        marker: {color: 'red'}
    };

    let trace2 = {
        x: income,
        name: 'Income',
        type: 'histogram',
        autobinx: false,
        histnorm: 'percent',
        opacity: 0.75,
        xbins: {
            end: Math.max(...income),
            size: 20000,
            start: 0
        },
        marker: {color: 'green'}
    };

    let layoutHist = {
        barmode: 'overlay',
        title: {
            text: `(${selectItem})`,
            font: {
                size: 16
            }
        },
        yaxis: {title: "Percent"}
    };

    let trace3 = {
        x: space,
        y: price,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 7,
            color: space,
            colorscale: 'Jet'
        }
    };

    let layout = {
        title: {
            text: `(${selectItem})`,
            font: {
                size: 16
            }
        },
        xaxis: {
            title: {
                text: 'Living Space',
                font: {
                    size: 12
                }
            }
            
        },
        yaxis: {
            title: {
                text: 'Price',
                font: {
                    size: 12
                }
            }
        }
    }

    var dataHist = [trace1, trace2];

    Plotly.newPlot('scatter', dataHist, layoutHist);

    var data = [trace3];

    Plotly.newPlot('layout_scatter', data, layout);
}

function createComparescatter(selectItem) {

    if (stateCompare.text().includes(selectItem) == true) {

        var compCurrent = housingData.filter(property => property.State == selectItem);
    }
    else if (cityCompare.text().includes(selectItem) == true) {

        var compCurrent = housingData.filter(property => property.City == selectItem);

    }
    else {

        var compCurrent = housingData.filter(property => property['Zip Code'] == selectItem);
    }

    let priceComp  = [];
    let incomeComp = [];
    let spaceComp = [];

    for (let i = 0; i < compCurrent.length; i++) {

        priceComp.push(compCurrent[i].Price);
        incomeComp.push(compCurrent[i]["Median Household Income"]);
        spaceComp.push(compCurrent[i]["Living Space"]);
    }

    let trace1 = {
        x: priceComp,
        name: 'Price',
        type: 'histogram',
        autobinx: false,
        histnorm: 'percent',
        opacity: 0.75,
        xbins: {
            end: mean(priceComp) + getStandardDeviation(priceComp) * 2,
            size: 50000,
            start: 0
        },
        marker: {color: 'red'}
    };

    let trace2 = {
        x: incomeComp,
        name: 'Income',
        type: 'histogram',
        autobinx: false,
        histnorm: 'percent',
        opacity: 0.75,
        xbins: {
            end: Math.max(...incomeComp),
            size: 20000,
            start: 0
        },
        marker: {color: 'green'}
    };

    let layoutHist = {
        barmode: 'overlay',
        title: {
            text: `(${selectItem})`,
            font: {
                size: 16
            }
        },
        yaxis: {title: "Percent"}
    };

    let trace3 = {
        x: spaceComp,
        y: priceComp,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 7,
            color: spaceComp,
            colorscale: 'Jet'
        }
    };

    let layout = {
        title: {
            text: `(${selectItem})`,
            font: {
                size: 16
            }
        },
        xaxis: {
            title: {
                text: 'Living Space',
                font: {
                    size: 12
                }
            }
            
        },
        yaxis: {
            title: {
                text: 'Price',
                font: {
                    size: 12
                }
            }
        }
    }

    let dataHist = [trace1, trace2];

    Plotly.newPlot('scatter2', dataHist, layoutHist);

    let data = [trace3];

    Plotly.newPlot('layout_scatter2', data, layout);

}

function setLocation(location) {

    if (stateDropdown.text().includes(location) == true) {

        var itemCurrent = housingData.filter(property => property.State == location);
    }
    else if (cityDropdown.text().includes(location) == true || cityCompare.text().includes(location) == true) {

        var itemCurrent = housingData.filter(property => property.City == location);
    }
    else {

        var itemCurrent = housingData.filter(property => property['Zip Code'] == location);
    }
    //console.log(itemCurrent);
    return itemCurrent;
}

function populateTable(selectItem, compareItem) {

    d3.select("#loc1").text(selectItem);
    d3.select("#loc2").text(compareItem);
    

/*     if (stateDropdown.text().includes(selectItem) == true) {

        var itemCurrent = housingData.filter(property => property.State == selectItem);
    }
    else if (cityDropdown.text().includes(selectItem) == true) {

        var itemCurrent = housingData.filter(property => property.City == selectItem);
    }
    else {

        var itemCurrent = housingData.filter(property => property['Zip Code'] == selectItem);
    } */

    let itemCurrent = [setLocation(selectItem), setLocation(compareItem)];

    for (let i = 0; i < itemCurrent.length; i++) {

        //console.log(itemCurrent[i]);

        let price  = [];
        var income = [];
        let space = [];
        let bed = [];
        let bath = [];
        let pop = [];
        let zips = [];
        let popzips = [];

        for (let j = 0; j < itemCurrent[i].length; j++) {

            let current = itemCurrent[i][j];

            price.push(current.Price);
            space.push(current["Living Space"]);
            bed.push(current.Beds);
            bath.push(current.Baths);

            if (income.includes(current["Median Household Income"]) == false && zips.includes(current['Zip Code']) == false) {

                income.push(current["Median Household Income"]);
                zips.push(current['Zip Code']);
            }
            if (pop.includes(current['Zip Code Density']) == false && popzips.includes(current['Zip Code']) == false) {

                pop.push(current['Zip Code Density']);
                popzips.push(current['Zip Code']);

            }

            console.log(selectItem, income, mean(income))

        }

        //temp fix for colorado springs
        var income = income.filter(num => num != '');

        d3.select(`#price${i}`).text(`$${Math.round(mean(price))}`);

        d3.select(`#income${i}`).text(`$${Math.round(mean(income))}`);

        d3.select(`#space${i}`).text(`${Math.round(mean(space))} sq ft`);

        d3.select(`#rooms${i}`).text(`${Math.round(mean(bed))}/${Math.round(mean(bath))}`);

        d3.select(`#pop${i}`).text(`${Math.round(mean(pop))} per sq mile`);
    }
}

function adjustZips(dropdown, citystate) {

    //if (dropdown.text().includes(citystate) == true) {

        if (dropdown == stateDropdown) {

            cityDropdown.selectAll("option").remove();
            var setCities = cityDropdown;

            zipDropdown.selectAll("option").remove();
            var setZips = zipDropdown;
            var zipcodes = housingData.filter(property => property.State == citystate);
        }
        else if (dropdown == stateCompare) {

            cityCompare.selectAll("option").remove();
            var setCities = cityCompare;

            zipCompare.selectAll("option").remove();
            var setZips = zipCompare;
            var zipcodes = housingData.filter(property => property.State == citystate);
        }
        else if (dropdown == cityDropdown) {

            zipDropdown.selectAll("option").remove();
            var setZips = zipDropdown;
            var zipcodes = housingData.filter(property => property.City == citystate);
        }
        else {

            zipCompare.selectAll("option").remove();
            var setZips = zipCompare;
            var zipcodes = housingData.filter(property => property.City == citystate);
        }

        if (setCities) {

            let cities = housingData.filter(property => property.State == citystate);

            let stateCities = [];

            for (let i = 0; i < cities.length; i++) {

                let currentCity = cities[i].City;
                
                if (stateCities.includes(currentCity) == false) {

                    stateCities.push(currentCity);

                    setCities.append("option").text(currentCity).property("value", currentCity);

                }
            }
        }

        //let zipcodes = housingData.filter(property => property.State == citystate);

        let stateZipcodes = [];

        for (let i = 0; i < zipcodes.length; i++) {

            let currentZip = zipcodes[i]['Zip Code'];
            
            if (stateZipcodes.includes(currentZip) == false) {

                stateZipcodes.push(currentZip);

                setZips.append("option").text(currentZip).property("value", currentZip);

            }
        }
    //}
}

function optionChanged(item) {

    console.log("Showing results for", item);

    var holder = d3.select("#loc2").text();

    console.log("Comparison is", holder);

    createScatter(item);
    populateTable(item, holder);

    if (states.includes(item) == true) {

        adjustZips(stateDropdown, item);
    }
    else if (cities.includes(item) == true) {

        adjustZips(cityDropdown, item);
    }
}

function optionChanged2(item) {

    console.log("Showing comparison results for", item);

    var holder = d3.select("#loc1").text();

    console.log("Original is", holder);

    createComparescatter(item);
    populateTable(holder, item); //need fix for colorado springs for some reason having extreme large means
    

    if (states.includes(item) == true) {

        adjustZips(stateCompare, item);
    }
    else if (cities.includes(item) == true) {

        adjustZips(cityCompare, item);
    }
}

init();