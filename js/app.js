//Ajax start/stop - loading overlay

$(document)
    .ajaxStart(function() {
        $('#overlay').show();
    })
    .ajaxStop(function() {
        $('#overlay').hide();
    });


$(function() {

    //Search input - mobile

    var cityInputMobile = $('.input-city-mobile');
    var searchButtonMobile = $('.search-button');

    //get forecast by city input

    searchButtonMobile.on('click', function(e) {
        var inputCity = cityInputMobile.val();
        getWeather(inputCity);
    })


    //Search input - deskop

    var cityInputDeskop = $('.input-city-deskop');
    var searchButtonDeskop = $('.search-button-deskop');

    //get forecast by city input

    searchButtonDeskop.on('click', function(e) {
        var inputCity = cityInputDeskop.val();
        getWeather(inputCity);
    })

    cityInputDeskop.on("keydown", function search(e) {
        //Enter button keydown
        if (e.keyCode == 13) {
            yourCity = $(this).val();
            getWeather(yourCity);
        }
    });


    //get location from ipinfo.io and get weather forecast

    $.ajax({
        url: 'http://ipinfo.io',
        type: 'GET',
        dataType: 'json'
    }).done(function(location) {
        if (location.city == "") {
            //default city Kraków
            getWeather("krakow");
        } else {
            getWeather(location.city);
        }
    }).fail(function(error) {
        alert("location error, check internet connection");
    });


    //get data from openweathermap
    function getWeather(city) {
        var myCity = city[0].toUpperCase() + city.slice(1);
        $('.current-city').html(myCity);

        var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + myCity + "&mode=json&units=metric&lang=pl&cnt=6&APPID=c3d1b45b181f76fafbe2dc68ef3b4281";

        $.ajax({
            url: weatherUrl,
            type: 'GET',
            dataType: 'json'
        }).done(function(response) {
            loadWeather(response);
        }).fail(function(error) {
            alert("ups, something went wrong");
        });

    }

    //save weather data in objects array and show in DOM
    function loadWeather(weatherData) {

        var forecastBoxes = $('.forecast__box');
        var forecastBoxesArr = Array.from(forecastBoxes);

        //reset active boxes, first active on start
        forecastBoxes.removeClass('forecast__box--active');
        forecastBoxesArr[0].classList.add('forecast__box--active');

        //push data to array
        var data = [];

        for (var i = 0; i < weatherData.list.length; i++) {
            data.push(new Weather(weatherData.list[i].temp.day,
                weatherData.list[i].temp.morn,
                weatherData.list[i].temp.night,
                weatherData.list[i].clouds,
                weatherData.list[i].speed,
                weatherData.list[i].pressure,
                weatherData.list[i].humidity,
                weatherData.list[i].dt,
                weatherData.list[i].weather[0].description,
                weatherData.list[i].weather[0].icon));

        }


        //curent section

        var currTempDay = $('.tempDay');
        var currConDesc = $('.con-description')
        var currConDt = $(".con-dt")
        var currConMorn = $(".con-morn")
        var currConNight = $(".con-night")
        var currConClouds = $(".con-clouds")
        var currConWind = $(".con-wind")
        var currConPressure = $(".con-pressure")
        var currConHum = $(".con-humidity")
        var currConIcon = $(".current-icon")

        //current section conditions - insert data
        currTempDay.html(Math.round(data[0].tempDay) + '<span class="celcius"><sup>o</sup>C</span>');
        currConDesc.text(data[0].description);
        currConDt.html(convertTime(data[0].dt, 'fullDate'));
        currConMorn.html("Rano &nbsp;" + Math.round(data[0].tempMorn) + "&deg;" + "C");
        currConNight.html("Noc &nbsp;&nbsp;" + Math.round(data[0].tempNight) + "&deg;" + "C");
        currConClouds.html("Chmury &nbsp;&nbsp;" + data[0].clouds + " %");
        currConWind.html("Wiatr &nbsp;&nbsp;" + Math.round(data[0].wind) + " m/s");
        currConPressure.html("Ciśnienie &nbsp;&nbsp;" + Math.round(data[0].pressure) + " hPa");
        currConHum.html("Wilgotność &nbsp;&nbsp;" + data[0].humidity + " %");
        currConIcon.css("background-image", data[0].imageUrl);



        //forecast section

        for (var i = 0; i < data.length; i++) {
            $(".icon" + (i + 1)).css("background-image", data[i].imageUrl);
        }

        //forecast box data - insert data

        $('.box__day--1').text('dzisiaj');
        $('.box__day--2').text('jutro');
        $('.box__day--3').text(convertTime(data[2].dt, 'shortDate'));
        $('.box__day--4').text(convertTime(data[3].dt, 'shortDate'));
        $('.box__day--5').text(convertTime(data[4].dt, 'shortDate'));
        $('.box__day--6').text(convertTime(data[5].dt, 'shortDate'));


        //section tomorrow - mobile

        //insert data

        var tommTempDay = $('.tempDay2');
        var tommConDesc = $('.con-description2');
        var tommIcon = $("#currIcon2");

        tommTempDay.html(Math.round(data[1].tempDay) + '<span class="celcius"><sup>o</sup>C</span>');
        tommConDesc.text(data[1].description);
        tommIcon.css("background-image", data[1].imageUrl);


        //section tomorrow conditions - mobile

        //insert data
        var tommConMorn = $(".con-morn2")
        var tommConNight = $(".con-night2")
        var tommConClouds = $(".con-clouds2")
        var tommConWind = $(".con-wind2")
        var tommConPressure = $(".con-pressure2")
        var tommConHum = $(".con-humidity2")
        var tommConIcon = $(".current-icon2")

        tommConMorn.html("Rano &nbsp;" + Math.round(data[1].tempMorn) + "&deg;" + "C");
        tommConNight.html("Noc &nbsp;&nbsp;" + Math.round(data[1].tempNight) + "&deg;" + "C");
        tommConClouds.html("Chmury &nbsp;&nbsp;" + data[1].clouds + " %");
        tommConWind.html("Wiatr &nbsp;&nbsp;" + Math.round(data[1].wind) + " m/s");
        tommConPressure.html("Ciśnienie &nbsp;&nbsp;" + Math.round(data[1].pressure) + " hPa");
        tommConHum.html("Wilgotność &nbsp;&nbsp;" + data[1].humidity + " %");
        tommConIcon.css("background-image", data[1].imageUrl);


        //section 6 days mobile

        for (var i = 0; i < data.length; i++) {
            $('.row__day--' + (i + 1)).text(convertTime(data[i].dt, 'shortDate'));
            $('.row__temperatureBox--' + (i + 1)).html(Math.round(data[i].tempDay) + "&deg;" + "C");
            $('.row__humidity--' + (i + 1)).html("<img src = './images/drop1.png'>" + "&nbsp" + data[i].humidity + " %");

        }

        var forecastBoxes = $('.forecast__box');
        var conditionsDeskop = $('.conditions-deskop');

        //match media - show conditions deskop
        var deskop = window.matchMedia("screen and (min-width: 981px) ")
        deskop.addListener(function(deskop) {
            if (deskop.matches) {
                button.classList.remove('active');
                conditionsDeskop.css("display", "block");

            } else {
                conditionsDeskop.css("display", "none");
            }
        });


        //show daily forecast by clicking forecast boxes
        forecastBoxes.on('click', function(e) {

            for (var i = 0; i < forecastBoxes.length; i++) {

                if ($(this).hasClass('forecast__box' + (i + 1))) {
                    $('.tempDay').html(Math.round(data[i].tempDay) + '<span class="celcius"><sup>o</sup>C</span>');
                    $('.con-description').text(data[i].description);
                    $(".con-dt").html(convertTime(data[i].dt, 'fullDate'));
                    $(".con-morn").html("Rano &nbsp;" + Math.round(data[i].tempMorn) + "&deg;" + "C");
                    $(".con-night").html("Noc &nbsp;&nbsp;" + Math.round(data[i].tempNight) + "&deg;" + "C");
                    $(".con-clouds").html("Chmury &nbsp;&nbsp;" + data[i].clouds + " %");
                    $(".con-wind").html("Wiatr &nbsp;&nbsp;" + Math.round(data[i].wind) + " m/s");
                    $(".con-pressure").html("Ciśnienie &nbsp;&nbsp;" + Math.round(data[i].pressure) + " hPa");
                    $(".con-humidity").html("Wilgotność &nbsp;&nbsp;" + data[i].humidity + " %");
                    $(".current-icon").css("background-image", data[i].imageUrl);
                }
            }
        })
    }


    //Weather constructor
    function Weather(tempDay, tempMorn, tempNight, clouds, wind, pressure, humidity, dt, description, icon) {
        this.tempDay = tempDay;
        this.tempMorn = tempMorn;
        this.tempNight = tempNight;
        this.clouds = clouds;
        this.wind = wind;
        this.pressure = pressure;
        this.humidity = humidity;
        this.dt = dt;
        this.description = description;
        this.icon = icon;
        this.imageUrl;

        //weather icons
        if (icon == "01d") {
            this.imageUrl = "url('./images/icon01d.png')";
        } else if (icon == "01n") {
            this.imageUrl = "url('./images/icon01n.png')";
        } else if (icon == "02d") {
            this.imageUrl = "url('./images/icon02d.png')";
        } else if (icon == "02n") {
            this.imageUrl = "url('./images/icon02n.png')";
        } else if (icon == "03d") {
            this.imageUrl = "url('./images/icon03d.png')";
        } else if (icon == "03n") {
            this.imageUrl = "url('./images/icon03n.png')";
        } else if (icon == "04d") {
            this.imageUrl = "url('./images/icon04d.png')";
        } else if (icon == "04n") {
            this.imageUrl = "url('./images/icon04n.png')";
        } else if (icon == "09d") {
            this.imageUrl = "url('./images/icon09d.png')";
        } else if (icon == "09n") {
            this.imageUrl = "url('./images/icon09n.png')";
        } else if (icon == "10d") {
            this.imageUrl = "url('./images/icon10d.png')";
        } else if (icon == "10n") {
            this.imageUrl = "url('./images/icon10n.png')";
        } else if (icon == "11d") {
            this.imageUrl = "url('./images/icon11d.png')";
        } else if (icon == "11n") {
            this.imageUrl = "url('./images/icon11n.png')";
        } else if (icon == "13d") {
            this.imageUrl = "url('./images/icon13d.png')";
        } else if (icon == "13n") {
            this.imageUrl = "url('./images/icon13n.png')";
        } else if (icon == "50d") {
            this.imageUrl = "url('./images/icon50d.png')";
        } else if (icon == "50n") {
            this.imageUrl = "url('./images/icon50n.png')";
        }
    }



    // convert time method
    function convertTime(timeDt, format) {

        var date = new Date(timeDt * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }

        if (format == "fullDate") {
            var newdate = day + "/" + month + '/' + year;
        } else if (format == "shortDate") {
            var newdate = day + "." + month;
        }

        return newdate;
    }



    //menu mobile

    var button = document.querySelector('.button');
    var mobileMenu = document.querySelector('.menu-mobile');
    var mobileSearch = document.querySelector('.menu-search');
    var search = document.querySelector('.search-icon');
    var searchButton = document.querySelector('.search-button');
    var tabMenu = document.querySelector('.material-tabs');


    button.addEventListener('click', function(e) {
        button.classList.toggle('active');
        mobileMenu.classList.toggle('mobile-active');
        if (!tabMenu.classList.contains('hide-tab')) {
            tabMenu.classList.add('hide-tab');
            tabMenu.classList.remove('show-tab');
        } else {
            tabMenu.classList.remove('hide-tab');
            if (tabMenu.style.height = "0") {
                tabMenu.classList.add('show-tab');
            }
        }
    });


    search.addEventListener('click', function(e) {

        mobileSearch.classList.toggle('search-active');

        if (!tabMenu.classList.contains('hide-tab')) {

            tabMenu.classList.add('hide-tab');
            tabMenu.classList.remove('show-tab');
        } else {

            tabMenu.classList.remove('hide-tab');
            if (tabMenu.style.height = "0") {
                tabMenu.classList.add('show-tab');
            }
        }
    });

    searchButton.addEventListener('click', function(e) {
        mobileSearch.classList.toggle('search-active');

        if (!tabMenu.classList.contains('hide-tab')) {

            tabMenu.classList.add('hide-tab');
            tabMenu.classList.remove('show-tab');
        } else {

            tabMenu.classList.remove('hide-tab');
            if (tabMenu.style.height = "0") {
                tabMenu.classList.add('show-tab');
            }
        }
    });



    //hide mobile loading info
    $.mobile.loading().hide();


    //mobile tabs menu
    var tabs = $('.tab');
    var tabSections = $('.section-tab');
    var sectionCurrent = $('.section-current');
    var sectionTommorow = $('.section-tomorrow');
    var sectionSixDays = $('.section-6days');


    tabs.on('click', function(e) {
        $(this).parent().find('.tab').removeClass('active');
        $(this).addClass('active');

        if ($(this).hasClass('tabbed-section__selector-tab-1')) {
            sectionCurrent.fadeIn();
            sectionTommorow.hide();
            sectionSixDays.hide();
        } else if ($(this).hasClass('tabbed-section__selector-tab-2')) {
            sectionCurrent.hide();
            sectionTommorow.fadeIn();
            sectionSixDays.hide();
        } else if ($(this).hasClass('tabbed-section__selector-tab-3')) {

            sectionSixDays.fadeIn();
            sectionCurrent.hide();
            sectionTommorow.hide();
        }
    });



    //swipe on mobile

    //swipe right
    tabSections.on('swiperight', function(e) {

        if ($(this).hasClass('section-tomorrow')) {

            //section
            $(this).hide();
            sectionCurrent.fadeIn();

            //tabs
            $('.tabbed-section__selector-tab-1').addClass('active');
            $('.tabbed-section__selector-tab-2').removeClass('active');

        } else if ($(this).hasClass('section-6days')) {

            //section
            $(this).hide();
            sectionTommorow.fadeIn();

            //tabs
            $('.tabbed-section__selector-tab-2').addClass('active');
            $('.tabbed-section__selector-tab-3').removeClass('active');

        }

    })


    //swipe left
    tabSections.on('swipeleft', function(e) {

        if ($(this).hasClass('section-current')) {

            //section
            $(this).hide();
            sectionTommorow.fadeIn();

            //tabs
            $('.tabbed-section__selector-tab-2').addClass('active');
            $('.tabbed-section__selector-tab-1').removeClass('active');


        } else if ($(this).hasClass('section-tomorrow')) {

            //section
            $(this).hide();
            $sectionSixDays.fadeIn();

            //tabs
            $('.tabbed-section__selector-tab-3').addClass('active');
            $('.tabbed-section__selector-tab-2').removeClass('active');


        }

    })


    //remove swipe on tablet,deskop

    var tablet = window.matchMedia("screen and (min-width: 641px) ")

    tablet.addListener(function(tablet) {
        if (tablet.matches) {
            tabSections.off('swiperight');
            tabSections.off('swipeleft');
        }
    });


    function deleteSwipe() {
        if (tablet.matches) {
            tabSections.off('swiperight');
            tabSections.off('swipeleft')
        } else {

        }
    }

    deleteSwipe();



    //forecast boxes - deskop

    var sectionCurrent = $('.section-current');
    var forecastBoxes = $('.forecast__box');
    var conditionsDeskop = $('.conditions-deskop')
    var currentDescription = $('.description');
    var currentIcon = $('.current-icon');
    var currentTemp = $('.current-temperature');


    forecastBoxes.on('click', function(e) {

        forecastBoxes.removeClass('forecast__box--active');
        $(this).addClass('forecast__box--active');
        currentDescription.hide().fadeIn('slow');
        currentIcon.hide().fadeIn('slow');
        currentTemp.hide().fadeIn('slow');

        if ($(window).innerWidth() > 980) {
            conditionsDeskop.hide().animate({
                marginLeft: -50
            }, 0).animate({
                marginLeft: 0,
                opacity: "show"
            } /*, 'slow'*/ );
        }

    })


});
