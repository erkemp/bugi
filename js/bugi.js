$(document).ready(function () {
    var lossArray = [0];
    var gainArray = [0];

    $("#payment-type .payment-event").each(function () {
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
            left: "prev, next, title",
            right: "today, month, agendaWeek, agendaDay"
        },
        selectable: true,
        selectHelper: true,
        droppable: true,
        eventLimit: true,
        eventClick: function (event, element) {
            if ($(this).css("background-color") == "rgb(60, 179, 113)")
                $(this).addClass("income");

            if ($(this).is(".income")) {
                var paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                                  '<div class="field"><label for="gainAmount">Amount: </label><input type="number" name="gainAmount" id="paymentAmount" value="0" min="0" /></div>';
            } else {
                var paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                                  '<div class="field"><label for="lossAmount">Amount: </label><input type="number" name="lossAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            paymentState = {
                state0: {
                    title: 'Enter payment information:',
                    html: paymentForm,
                    buttons: { Submit: 1 },
                    submit: function (e, v, m, f) {

                        if (f.lossAmount) {
                            var lossTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.lossAmount + ".00";
                            lossArray.push(f.lossAmount);
                            $.each(lossArray, function () { lossTotal += parseFloat(this) || 0; });
                            $("#expensePanel").html("$" + lossTotal + ".00");
                        } else {
                            var gainTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.gainAmount + ".00";
                            gainArray.push(f.gainAmount);
                            $.each(gainArray, function () { gainTotal += parseFloat(this) || 0; });
                            $("#incomePanel").html("$" + gainTotal + ".00");
                        }

                        $("#calendar").fullCalendar("updateEvent", event);
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
    $("#paymentForm").hide();
    $("#registerPanel").hide();
    $("#loginPanel").hide();
    $(".registerSlide").click(function () {
        $("#registerPanel").slideToggle("slow");
    });

    $(".loginSlide").click(function () {
        $("#loginPanel").slideToggle("slow");
    });
});