Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(document).ready(function () {
    var tutorialSubmit = function (e, v, m, f) {
        if (v === 0)
            $.prompt.close();

        if (v === -1) {
            $.prompt.prevState();
            return false;
        }
        else if (v === 1) {
            $.prompt.nextState();
            return false;
        }
    },
tutorialStates = [
	{
	    title: 'Welcome',
	    html: 'Would you like to see a quick tutorial for Bügi?',
	    buttons: { No: 0, Yes: 1 },
	    focus: 1,
	    position: { container: 'h1', x: 200, y: 60, width: 300, arrow: 'tc' },
	    submit: tutorialSubmit
	},
	{
	    title: 'Start',
	    html: 'To begin, enter your beginning month balance in this box.',
	    buttons: { Prev: -1, Next: 1 },
	    focus: 1,
	    position: { container: '#start', x: 170, y: 0, width: 360, arrow: 'lt' },
	    submit: tutorialSubmit
	},
	{
	    title: "Start",
	    html: "... and you'll see it appear over here!",
	    buttons: { Prev: -1, Next: 1 },
	    focus: 1,
	    position: { container: '#calendar-info', x: -10, y: -145, width: 100, arrow: 'br' },
	    submit: tutorialSubmit
	},
	{
	    title: 'Choices',
	    html: 'You can find many options for inputting your monthly expenses, bills, income, or savings.',
	    buttons: { Prev: -1, Next: 1 },
	    focus: 1,
	    position: { container: '#choices', x: 170, y: 10, width: 400, arrow: 'lt' },
	    submit: tutorialSubmit
	},
	{
	    title: 'Choices',
	    html: 'Drag and drop them to the calendar over here!',
	    buttons: { Done: 2 },
	    focus: 1,
	    position: { container: '#calendar-info', x: 180, y: -130, width: 300, arrow: 'rt' },
	    submit: tutorialSubmit
	}
];
    $.prompt(tutorialStates);

    $("#paymentForm").hide();
    $("#register-panel").hide();
    $("#login-panel").hide();

    $(".register-slide").click(function () {
        $("#register-panel").slideToggle("slow");
    });

    $(".login-slide").click(function () {
        $("#login-panel").slideToggle("slow");
    });

    $("button").click(function () {
        var monthBalance = $("input").val();
        $("[data-date*='-01-'] > .month-insert").html(monthBalance);
    });

    var lossArray = [], gainArray = [], saveArray = [], billArray = [];
    var paymentForm, loopDay;

    $("#payment-box .payment-event").each(function () {
        $(this).data("event", {
            title: $.trim($(this).text()),
            stick: true,
            editable: true,
            color: $(this).css("background-color")
        });

        $(this).draggable({
            zIndex: 999,
            revert: true,
            revertDuration: 0,
        });
    });

    $("#calendar").fullCalendar({
        header: {
            left: "title",
            right: "today"
        },
        selectable: true,
        selectHelper: true,
        droppable: true,
        eventLimit: 3,
        eventClick: function(event, jsEvent, view,  element) {
            var clickedDate = $.nearest({
                x: jsEvent.pageX, y: jsEvent.pageY
            }, '.fc-day').attr('data-date');

            var data = clickedDate.split('-');
            var yyyy = parseInt(data[0]);
            var mm = parseInt(data[1], 10);
            var dd = parseInt(data[2], 10);
 
            if ($(this).css("background-color") == "rgb(109, 206, 152)")
                $(this).addClass("income");

            else if ($(this).css("background-color") == "rgb(158, 155, 177)")
                $(this).addClass("savings");

            else if ($(this).css("background-color") == "rgb(32, 178, 170)")
                $(this).addClass("bill");

            if ($(this).is(".income")) {
                    paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                    '<div class="field"><label for="gainAmount">Amount: </label><input type="number" name="gainAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            else if ($(this).is(".savings")) {
                    paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                    '<div class="field"><label for="saveAmount">Amount: </label><input type="number" name="saveAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            else if ($(this).is(".bill")) {
                    paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                    '<div class="field"><label for="billAmount">Amount: </label><input type="number" name="billAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            else {
                   paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                   '<div class="field"><label for="lossAmount">Amount: </label><input type="number" name="lossAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            var paymentState = {
                state0: {
                    title: 'Enter payment information:',
                    html: paymentForm,
                    buttons: { Submit: 1 },
                    submit: function (e, v, m, f) {

                        if (f.lossAmount) {
                            var lossTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.lossAmount;
                            f.lossAmount *= -1;
                            lossArray.push(f.lossAmount);
                            $.each(lossArray, function () { lossTotal -= parseFloat(this) || 0; });
                            $("#expense-panel").html("$" + (lossTotal.formatMoney(2)));
                            $("#expense-hide").removeClass("hide");
                        }

                        else if (f.saveAmount) {
                            var saveTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.saveAmount;
                            saveArray.push(f.saveAmount);
                            $.each(saveArray, function () { saveTotal += parseFloat(this) || 0; });
                            $("#savings-panel").html("$" + (saveTotal.formatMoney(2)));
                            $("#save-hide").removeClass("hide");
                        }

                        else if (f.billAmount) {
                            var billTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.billAmount;
                            f.billAmount *= -1;
                            lossArray.push(f.billAmount);
                            $.each(lossArray, function () { billTotal -= parseFloat(this) || 0; });
                            $("#expense-panel").html("$" + (billTotal.formatMoney(2)));

                            f.billAmount *= -1;
                            billArray = billArray.concat(f.paymentName + " " + "$" + f.billAmount.formatMoney(2));
                            $("#bill-panel").html(billArray.map(function (value) {
                                return (value + '</br>');
                            }).join(""));

                            $("#expense-hide").removeClass("hide");
                            $("#bill-box").removeClass("hide");
                        }

                        else {
                            var gainTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.gainAmount;
                            gainArray.push(f.gainAmount);
                            $.each(gainArray, function () { gainTotal += parseFloat(this) || 0; });
                            $("#income-panel").html("$" + (gainTotal.formatMoney(2)));
                            $("#income-hide").removeClass("hide");

                            $(".fc-event").html(gainTotal);
                        }

                        var gainlossTotal = 0;
                        var gainlossArray = gainArray.concat(lossArray);
                        $.each(gainlossArray, function () { gainlossTotal += parseFloat(this) || 0; });

                        if (gainlossTotal > 0) {
                            $("#loss-hide").addClass("hide");
                            $("#gain-hide").removeClass("hide");
                            $("#gain-panel").html("$" + (gainlossTotal.formatMoney(2)));
                        }

                        else if (gainlossTotal < 0) {
                            $("#gain-hide").addClass("hide");
                            $("#loss-hide").removeClass("hide");
                            $("#loss-panel").html("$" + (gainlossTotal.formatMoney(2)));
                        }

                        $("#calendar").fullCalendar("updateEvent", event);

                        var currentMonthInsert = $("[data-date*='" + clickedDate + "'] > .month-insert").text();
                        var currentMonthCalc = parseInt(currentMonthInsert);

                        var totalAmount = 0;
                        if (f.lossAmount)
                            totalAmount += parseInt(f.lossAmount);
                        if (f.billAmount)
                            totalAmount -= parseInt(f.billAmount);
                        if (f.gainAmount)
                            totalAmount += parseInt(f.gainAmount);
                        if (f.saveAmount)
                            totalAmount += parseInt(f.saveAmount);

                        if (dd < 10) {
                            for (loopDay = dd; loopDay < 10; loopDay++) {
                                $("[data-date='" + yyyy + "-0" + mm + "-0" + loopDay + "'] > .month-insert").html(currentMonthCalc + totalAmount);
                            }
                            for (loopDay = dd; loopDay <= 31; loopDay++) {
                                $("[data-date='" + yyyy + "-0" + mm + "-" + loopDay + "'] > .month-insert").html(currentMonthCalc + totalAmount);
                            }
                        } else {
                            for (loopDay = dd; loopDay <= 31; loopDay++)
                                $("[data-date='" + yyyy + "-0" + mm + "-" + loopDay + "'] > .month-insert").html(currentMonthCalc + totalAmount);
                        }

                        $.prompt.close();
                    }
                }
            };
            $.prompt(paymentState);
        }
    });
});

// Register and Login Buttons
$(document).ready(function () {
    
});