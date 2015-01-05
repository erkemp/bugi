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
            if  (!$(event)){
                var paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
					'<div class="field"><label for="gainAmount">Amount: </label><input type="number" name="gainAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            else {
                var paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
					'<div class="field"><label for="lossAmount">Amount: </label><input type="number" name="lossAmount" id="paymentAmount" value="0" min="0" /></div>';
            }
           
            paymentState = {
                state0: {
                    title: 'Enter payment information:',
                    html: paymentForm,
                    buttons: { Submit: 1 },
                    submit: function (e, v, m, f) {
                        if ($(event)) {
                            event.title = f.paymentName + " " + "$" + f.gainAmount + ".00";
                            $("#expense").html("$" + f.gainAmount + ".00");
                            
                        }

                        else {
                           event.title = f.paymentName + " " + "$" + f.lossAmount + ".00";
                            $("#income").html("$" + f.lossAmount + ".00");
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

function paymentEventUpdate() {
    var paymentForm = '<div class="field"><label for="paymentName">Name</label><input type="text" name="paymentName" id="paymentName" value="" /></div>' +
					'<div class="field"><label for="paymentAmount">amount</label><input type="number" name="paymentAmount" id="paymentAmount" value="0" /></div>';

    paymentState = {
        state0: {
            title: 'Enter payment information:',
            html: paymentForm,
            buttons: { Cancel: false, Submit: true },
            focus: 1,
            submit: function (e, v, m, f) {
                event.title = f.paymentName;
                $("#calendar").fullCalendar("updateEvent", event);
                $.prompt.close();
            }
        }
    };

    $.prompt(paymentState);
}