/* global d3, barChart, genderChart, scatterPlot, csData */

// http://bl.ocks.org/boeric/7d11226f5e1235cbe645
// https://bl.ocks.org/micahstubbs/66db7c01723983ff028584b6f304a54a

var sorterKey = {
    // "sunday": 0, // << if sunday is first day of week
    "lunes": 01,
    "martes": 02,
    "miércoles": 03,
    "jueves": 04,
    "viernes": 05,
    "sábado": 06,
    "domingo": 07,
    "enero": 08,
    "febrero": 09,
    "marzo": 10,
    "abril": 11,
    "mayo": 12,
    "junio": 13,
    "julio": 14,
    "agosto": 15,
    "septiembre": 16,
    "octubre": 17,
    "noviembre": 18,
    "diciembre": 19
}

var dateFmt = d3.timeParse("%Y/%m/%d %I:%M:%S %p");

d3.tsv("data/Hurto celulares - Bogota_5.tsv",
    function (d) {
        // This function is applied to each row of the dataset
        d["TIMESTAMP"] = dateFmt(d["TIMESTAMP"]);
        return d;
    },
    function (err, data) {
        if (err) throw err;

        var filtro_dinamico = true;
        d3.select("#checkBox01").property("checked", filtro_dinamico);
        d3.select("#checkBox01").on("change", oncheckBox01);

        function oncheckBox01() {
            if (filtro_dinamico) {
                filtro_dinamico = false;
                reload();
            } else {
                filtro_dinamico = true;
                reload();
            }
            console.log("filtro_dinamico: " + filtro_dinamico);
        }

        //var armaSelected = [];
        var barrioSelected = [];
        var genderSelected = [];
        var armaMovilSelected = [];
        var diaSelected = [];
        var yearSelected = [];

        function sortByKey(a, b) {
            var key1 = a.key.toLowerCase();
            var key2 = b.key.toLowerCase();
            return sorterKey[key1] > sorterKey[key2];
        }

        function reload() {

            var weekButtonControl = buttonControl()
                .width(400)
                .height(20)
                .x(function (d) { return d.key; });

            var yearButtonControl = buttonControl()
                .width(400)
                .height(20)
                .x(function (d) { return d.key; });

            var barrioBarChart = barChart()
                .width(400)
                .height(300)
                .x(function (d) { return d.key; })
                .y(function (d) { return +d.value; });

            /*
            var armaBarChart = barChart()
                .width(300)
                .height(300)
                .x(function (d) { return d.key; })
                .y(function (d) { return +d.value; });
            */
            var myGenderChart = genderChart()
                .width(400)
                .height(300)
                //.xLeft(function (d) { return +d.value; })
                .xLeft(function (d) {
                    var string = d.key;
                    return (string.includes("FEMENINO")) ? +d.value : 0;
                    //return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_stroke_opacity : highlight_trans;});
                })
                //.xRight(function (d) { return +d.value; })
                .xRight(function (d) {
                    var string = d.key;
                    return (string.includes("MASCULINO")) ? +d.value : 0;
                })
                .y(function (d) { return d.key.slice(0, 10); });


            var myRadialLineChart = radialLineChart()
                .width(300)
                .height(300)
                .x(function (d) { return d.key; })
                .y(function (d) { return d.value; })
                .modo(0);

            var myScatterPlot = scatterPlot()
                .width(500)
                .height(300)
                .x(function (d) { return d.Barrio2; })
                .y(function (d) { return +d["2016"]; });

            var myHeatMap = heatMap();

            csData = crossfilter(data);
            all = csData.groupAll();

            csData.dimBarrio = csData.dimension(function (d) { return d["BARRIO_2"]; });
            csData.dimArma = csData.dimension(function (d) { return d["ARMA EMPLEADA"]; });
            // csData.dimMovilVictima = csData.dimension(function (d) { return d["MOVIL VICTIMA"]; });
            // csData.dimMovilAgresor = csData.dimension(function (d) { return d["MOVIL AGRESOR"]; });
            csData.dimArmaMovil = csData.dimension(function (d) { return d["ID_ARMA"] + '|' + d["ID_MOVIL"] })
            csData.dimRangoEtario = csData.dimension(function (d) { return d["RANGO_ETARIO"] + '   | ' + d["GENERO"]; });
            // csData.dimGenero = csData.dimension(function (d) { return d["GENERO"]; });
            csData.dimTimestamp = csData.dimension(function (d) { return d["TIMESTAMP"]; });
            csData.dimYear = csData.dimension(function (d) { return d["TIMESTAMP"].getFullYear(); });
            csData.dimDia = csData.dimension(function (d) { return d["DIA"]; });

            // GENERO: [MASCULINO|FEMENINO]
            // bisectByFoo = crossfilter.bisect.by(function (d) { return d["GENERO"]; });

            csData.barrio = csData.dimBarrio.group();
            csData.arma = csData.dimArma.group();
            // csData.movilVictima = csData.dimMovilVictima.group();
            // csData.movilAgresor = csData.dimMovilAgresor.group();
            csData.ArmaMovil = csData.dimArmaMovil.group();
            csData.rangoEtario = csData.dimRangoEtario.group();
            csData.timestampMonth = csData.dimTimestamp.group(d3.timeMonth);
            csData.timestampWeek = csData.dimTimestamp.group(d3.timeWeek);
            csData.timestampDay = csData.dimTimestamp.group(d3.timeDay);
            csData.year = csData.dimYear.group();
            csData.dia = csData.dimDia.group();

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::

            if (filtro_dinamico) {

                //armaSelected = [];
                barrioSelected = [];
                genderSelected = [];
                armaMovilSelected = [];
                diaSelected = [];
                yearSelected = [];

                //csData.dimArma.filterAll();
                csData.dimBarrio.filterAll();
                csData.dimRangoEtario.filterAll();
                csData.dimArmaMovil.filterAll();
                csData.dimDia.filterAll();
                csData.dimYear.filterAll();

                d3.selectAll('rect').attr('style', 'fill:;')

                //-----------------------------------------------------                                
                //Arma Empleada
                /*
                armaBarChart.onMouseOver(function (d) {
                    csData.dimArma.filter(d.key);
                    update();
                });
                
                armaBarChart.onMouseOut(function (d) {
                    csData.dimArma.filterAll();
                    update();
                });
                */
                //-----------------------------------------------------                
                //Barrio
                barrioBarChart.onMouseOver(function (d) {
                    csData.dimBarrio.filter(d.key);
                    update();
                });

                barrioBarChart.onMouseOut(function (d) {
                    csData.dimBarrio.filterAll();
                    update();
                });

                //-----------------------------------------------------                
                //Género
                myGenderChart.onMouseOver(function (d) {
                    csData.dimRangoEtario.filter(d.key);
                    update();
                });

                myGenderChart.onMouseOut(function (d) {
                    csData.dimRangoEtario.filterAll();
                    update();
                });

                //-----------------------------------------------------                
                //HeatMap
                myHeatMap.onMouseOver(function (d) {
                    csData.dimArmaMovil.filter(d.key);
                    update();
                });
                myHeatMap.onMouseOut(function (d) {
                    csData.dimArmaMovil.filterAll();
                    update();
                });

                //-----------------------------------------------------                
                //Dia
                weekButtonControl.onMouseOver(function (d) {
                    csData.dimDia.filter(d.key);
                    update();
                });
                weekButtonControl.onMouseOut(function (d) {
                    csData.dimDia.filterAll();
                    update();
                });

                //-----------------------------------------------------                
                //Year
                yearButtonControl.onMouseOver(function (d) {
                    csData.dimYear.filter(d.key);
                    // csData.dimTimestamp.filter(d.key.getFullYear());
                    update();
                });
                yearButtonControl.onMouseOut(function (d) {
                    csData.dimYear.filterAll();
                    update();
                });

                //-----------------------------------------------------                                
            } else { //filtro_dinamico = false
                //Arma Empleada - OnClick
                /*
                armaBarChart.onMouseClick(function (d) {

                    if (d3.select(this).style("fill") === "brown") {
                        d3.select(this).style("fill", "");
                        armaSelected.splice(armaSelected.indexOf(d.key), 1);
                    } else {
                        d3.select(this).style("fill", "brown");
                        armaSelected.push(d.key);
                    }

                    armaBarChart_onClickFilter();
                    update();
                });
                */
                //-----------------------------------------------------                                
                //Barrio - OnClick
                barrioBarChart.onMouseClick(function (d) {

                    if (d3.select(this).style("fill") === "brown") {
                        d3.select(this).style("fill", "");
                        barrioSelected.splice(barrioSelected.indexOf(d.key), 1);
                    } else {
                        d3.select(this).style("fill", "brown");
                        barrioSelected.push(d.key);
                    }

                    barrioBarChart_onClickFilter();
                    update();
                });

                //-----------------------------------------------------                                
                //Género - OnClick
                myGenderChart.onMouseClick(function (d) {

                    if (d3.select(this).style("fill") === "brown") {
                        d3.select(this).style("fill", "");
                        genderSelected.splice(genderSelected.indexOf(d.key), 1);
                    } else {
                        d3.select(this).style("fill", "brown");
                        genderSelected.push(d.key);
                    }

                    myGenderChart_onClickFilter();
                    update();
                });

                //-----------------------------------------------------                                
                //HeatMap - OnClick
                myHeatMap.onMouseClick(function (d) {

                    if (d3.select(this).style("stroke") === "brown") {
                        d3.select(this).style("stroke", "");
                        d3.select(this).style("stroke-width", 0);
                        armaMovilSelected.splice(armaMovilSelected.indexOf(d.key), 1);
                    } else {
                        d3.select(this).style("stroke", "brown");
                        d3.select(this).style("stroke-width", 2);
                        armaMovilSelected.push(d.key);
                    }

                    myHeatMap_onClickFilter();
                    update();
                });
                //-----------------------------------------------------                                
                //Dia - OnClick
                weekButtonControl.onMouseClick(function (d) {

                    if (d3.select(this).classed("selected")) {
                        d3.select(this).classed("selected", false);
                        diaSelected.splice(diaSelected.indexOf(d.key), 1);
                    } else {
                        d3.select(this).classed("selected", true)
                        diaSelected.push(d.key);
                    }

                    weekButtonControl_onClickFilter();
                    update();
                });
                //-----------------------------------------------------                                
                //Year - OnClick                
                yearButtonControl.onMouseClick(function (d) {

                    if (d3.select(this).classed("selected")) {
                        d3.select(this).classed("selected", false);
                        yearSelected.splice(yearSelected.indexOf(d.key), 1);
                    } else {
                        d3.select(this).classed("selected", true)
                        yearSelected.push(d.key);
                    }

                    yearButtonControl_onClickFilter();
                    update();
                });
                //-----------------------------------------------------                                                                
            }

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::
            /*
            function armaBarChart_onClickFilter() {

                var string = "";
                for (i = 0; i < armaSelected.length; i++) { string = string + " | " + armaSelected[i]; }                
                csData.dimArma.filter(function (d) { return (string.includes(d)) ? true : false; });                
                if (armaSelected.length === 0) { csData.dimArma.filterAll(); }
                
                console.log("---------------------------------");
                console.log("armaSelected string: " + string);
                console.log("armaSelected size: " + armaSelected.length);
                for (i = 0; i < armaSelected.length; i++) { console.log(armaSelected[i]); }
                console.log("---------------------------------");
            }
            */
            //-----------------------------------------------------

            function barrioBarChart_onClickFilter() {

                var string = "";
                for (i = 0; i < barrioSelected.length; i++) { string = string + " | " + barrioSelected[i]; }
                csData.dimBarrio.filter(function (d) { return (string.includes(d)) ? true : false; });
                if (barrioSelected.length === 0) { csData.dimBarrio.filterAll(); }

                console.log("---------------------------------");
                console.log("barrioSelected string: " + string);
                console.log("barrioSelected size: " + barrioSelected.length);
                for (i = 0; i < barrioSelected.length; i++) { console.log(barrioSelected[i]); }
                console.log("---------------------------------");
            }

            //-----------------------------------------------------

            function myGenderChart_onClickFilter() {

                var string = "";
                for (i = 0; i < genderSelected.length; i++) { string = string + " | " + genderSelected[i]; }
                csData.dimRangoEtario.filter(function (d) { return (string.includes(d)) ? true : false; });
                if (genderSelected.length === 0) { csData.dimRangoEtario.filterAll(); }

                console.log("---------------------------------");
                console.log("genderSelected string: " + string);
                console.log("genderSelected size: " + genderSelected.length);
                for (i = 0; i < genderSelected.length; i++) { console.log(genderSelected[i]); }
                console.log("---------------------------------");
            }

            //-----------------------------------------------------

            function myHeatMap_onClickFilter() {

                var string = "";
                for (i = 0; i < armaMovilSelected.length; i++) { string = string + " | " + armaMovilSelected[i]; }
                csData.dimArmaMovil.filter(function (d) { return (string.includes(d)) ? true : false; });
                if (armaMovilSelected.length === 0) { csData.dimArmaMovil.filterAll(); }

                console.log("---------------------------------");
                console.log("armaMovilSelected string: " + string);
                console.log("armaMovilSelected size: " + armaMovilSelected.length);
                for (i = 0; i < armaMovilSelected.length; i++) { console.log(armaMovilSelected[i]); }
                console.log("---------------------------------");
            }

            //-----------------------------------------------------

            function weekButtonControl_onClickFilter() {

                var string = "";
                for (i = 0; i < diaSelected.length; i++) { string = string + " | " + diaSelected[i]; }
                csData.dimDia.filter(function (d) { return (string.includes(d)) ? true : false; });
                if (diaSelected.length === 0) { csData.dimDia.filterAll(); }

                console.log("---------------------------------");
                console.log("diaSelected string: " + string);
                console.log("diaSelected size: " + diaSelected.length);
                for (i = 0; i < diaSelected.length; i++) { console.log(diaSelected[i]); }
                console.log("---------------------------------");
            }

            //-----------------------------------------------------

            function yearButtonControl_onClickFilter() {

                var string = "";
                for (i = 0; i < yearSelected.length; i++) { string = string + " | " + yearSelected[i]; }
                csData.dimYear.filter(function (d) { return (string.includes(d)) ? true : false; });
                if (yearSelected.length === 0) { csData.dimYear.filterAll(); }

                console.log("---------------------------------");
                console.log("yearSelected string: " + string);
                console.log("yearSelected size: " + yearSelected.length);
                for (i = 0; i < yearSelected.length; i++) { console.log(yearSelected[i]); }
                console.log("---------------------------------");
            }

            //-----------------------------------------------------

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::
            function TESTING() {
                console.log("succes!");
            }

            d3.select("#titulo_barrio").append('a')
                //.attr('href', `javascript:reset(${id})`)
                //href="javascript:gateNameChart.filterAll();dc.redrawAll();"

                .attr('href', "javascript:TESTING();")
                .attr('class', 'reset')
                .text('reset')
                .style('display', 'null'); //none

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::
            function update() {
                d3.select("#weekButtons")
                    .datum(csData.dia.all().sort(function (a, b) { return sortByKey(a, b); }))
                    .call(weekButtonControl);

                d3.select("#yearButtons")
                    .datum(csData.year.all())
                    .call(yearButtonControl);

                d3.select("#barrioBarChart")
                    .datum(csData.barrio.top(20))
                    .call(barrioBarChart)
                    .select(".x.axis")
                    .selectAll(".tick text")
                    .attr("transform", "rotate(-90) translate(-10, -13)");

                /*
                 d3.select("#armaBarChart")
                     .datum(csData.arma.top(Infinity))
                     .call(armaBarChart)
                     .select(".x.axis")
                     .selectAll(".tick text")
                     .attr("transform", "rotate(-90) translate(-10, -13)");
                */

                d3.select("#gender")
                    .datum(csData.rangoEtario.all())
                    .call(myGenderChart);

                d3.select("#mesRadialLinechart")
                    .datum(csData.timestampMonth.all())
                    .call(myRadialLineChart
                        .title('Año')
                        .subtitle('Mes')
                    );

                d3.select("#semanaRadialLinechart")
                    .datum(csData.timestampWeek.all())
                    .call(myRadialLineChart
                        .title('Año')
                        .subtitle('Semana')
                    );

                d3.select("#diaRadialLinechart")
                    .datum(csData.timestampDay.all())
                    .call(myRadialLineChart
                        .title('Año')
                        .subtitle('Día')
                    );

                d3.select("#heatmapArmaMovilchart")
                    .datum(csData.ArmaMovil.all())
                    .call(myHeatMap);
            }

            update();
        }
        reload();
    });
