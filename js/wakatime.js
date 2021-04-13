window.addEventListener('load', init);

let hoursHolder;
let minutesHolder;

function init()
{
    hoursHolder = document.querySelector("#hours");
    minutesHolder = document.querySelector("#minutes");
    showProgrammingTime();
}

function showProgrammingTime() {
    $.ajax({
        type: 'GET',
        url: 'https://wakatime.com/share/@KasperOfzeau/fd772e56-fb66-4ad7-9ff8-11a84a7e6ed4.json',
        dataType: 'jsonp',
        success: function(response) {
            let data = response.data;
            let hours = 0;
            let minutes = 0;
            for(let item of data ) {
                hours += parseInt(item.grand_total.hours);
                minutes += parseInt(item.grand_total.minutes);
            }

            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;

            hoursHolder.innerHTML = hours;
            minutesHolder.innerHTML = minutes;
        },
    });
}